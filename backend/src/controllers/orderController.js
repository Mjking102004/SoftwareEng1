const pool = require('../db/db');
const { HttpError, asyncHandler } = require('../utils/http');
const { positiveInteger, assertFields } = require('../utils/validation');



const getOrders = asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY order_date DESC,order_id DESC', [req.user.user_id]);
  res.json({ orders: rows });
});

const getOrder = asyncHandler(async (req, res) => {
  const id = positiveInteger(req.params.id);
  const { rows } = await pool.query('SELECT * FROM orders WHERE order_id=$1 AND user_id=$2', [id,req.user.user_id]);
  if (!rows.length) throw new HttpError(404, 'Order not found');
  const items = await pool.query('SELECT * FROM order_items WHERE order_id=$1 ORDER BY order_item_id', [id]);
  res.json({ order: rows[0], items: items.rows });
});

const createOrder = asyncHandler(async (req, res) => {
  assertFields(req.body, ['discount_code']);
  const client = await pool.connect();
  let committed = false;
  try {
    await client.query('BEGIN');
    const cart = await client.query('SELECT cart_id FROM carts WHERE user_id=$1 FOR UPDATE', [req.user.user_id]);
    if (!cart.rows.length) throw new HttpError(400, 'Cart is empty');
    const cartId = cart.rows[0].cart_id;
    const itemResult = await client.query(`SELECT ci.book_id, ci.quantity FROM cart_items ci
      WHERE ci.cart_id=$1 ORDER BY ci.book_id FOR UPDATE`, [cartId]);
    if (!itemResult.rows.length) throw new HttpError(400, 'Cart is empty');
    const ids = itemResult.rows.map((r) => r.book_id);
    const bookResult = await client.query(`SELECT b.book_id, b.price, b.quantity,
      (SELECT MIN(sale_price) FROM sales s WHERE s.book_id=b.book_id AND s.active=TRUE
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (ends_at IS NULL OR ends_at > NOW())) AS sale_price
      FROM books b WHERE b.book_id=ANY($1::int[]) ORDER BY b.book_id FOR UPDATE`, [ids]);
    const bookMap = new Map(bookResult.rows.map((b) => [b.book_id, b]));
    let cents = 0;
    const items = [];
    for (const item of itemResult.rows) {
      const book = bookMap.get(item.book_id);
      if (!book || book.quantity < item.quantity) throw new HttpError(409, 'Not enough inventory for book ' + item.book_id);
      const priceCents = Math.round(Number(book.sale_price ?? book.price) * 100);
      cents += priceCents * item.quantity;
      items.push({ bookId: item.book_id, quantity: item.quantity, priceCents });
    }

    let discount = null;
    if (req.body.discount_code !== undefined) {
      if (typeof req.body.discount_code !== 'string' || !req.body.discount_code.trim()) {
        throw new HttpError(400, 'Invalid discount code');
      }
      const { rows } = await client.query(
        'SELECT * FROM discount_codes WHERE LOWER(code)=LOWER($1) AND active=TRUE',
        [req.body.discount_code.trim()]
      );
      if (!rows.length) throw new HttpError(400, 'Invalid discount code');
      discount = rows[0];
    }
    const discountCents = discount ? Math.round(cents * discount.discount_percent / 100) : 0;
    const totalCents = cents - discountCents;
    // Tax is zero until the team establishes a tax policy.
    const order = await client.query(`INSERT INTO orders
      (user_id,subtotal,tax,total,status,discount_code_id,discount_amount)
      VALUES ($1,$2,0,$3,'Pending',$4,$5) RETURNING *`,
      [req.user.user_id,(cents/100).toFixed(2),(totalCents/100).toFixed(2),
        discount?.discount_id ?? null,(discountCents/100).toFixed(2)]);
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id,book_id,quantity,price) VALUES ($1,$2,$3,$4)',
        [order.rows[0].order_id,item.bookId,item.quantity,(item.priceCents/100).toFixed(2)]
      );
      await client.query('UPDATE books SET quantity=quantity-$1 WHERE book_id=$2',
        [item.quantity,item.bookId]);
    }
    await client.query('DELETE FROM cart_items WHERE cart_id=$1', [cartId]);
    await client.query('COMMIT');
    committed = true;
    res.status(201).json({ order: order.rows[0], message: 'Order placed; payment not processed' });
  } catch (err) {
    if (!committed) await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

module.exports = { getOrders, getOrder, createOrder };
