const pool = require('../db/db');
const { HttpError, asyncHandler } = require('../utils/http');
const { positiveInteger, assertFields } = require('../utils/validation');
const { toCents, calculateTotals, formatTotals, findActiveDiscount, TAX_RATE } = require('../utils/pricing');


async function getOrCreateCart(userId) {
  const { rows } = await pool.query(
    `INSERT INTO carts (user_id) VALUES ($1)
     ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id RETURNING cart_id`,
    [userId]);
  return rows[0].cart_id;
}

async function cartContents(userId) {
  const cartId = await getOrCreateCart(userId);
  const { rows } = await pool.query(`SELECT ci.cart_item_id, ci.book_id, b.title, b.author, b.image_url, ci.quantity,
    b.quantity AS available_quantity, b.price, s.sale_price,
    COALESCE(s.sale_price,b.price) AS effective_price
    FROM cart_items ci JOIN books b ON b.book_id=ci.book_id
    LEFT JOIN LATERAL (
      SELECT MIN(sale_price) AS sale_price FROM sales
      WHERE book_id=b.book_id AND active=TRUE AND (starts_at IS NULL OR starts_at <= NOW())
      AND (ends_at IS NULL OR ends_at > NOW())
    ) s ON TRUE
    WHERE ci.cart_id=$1 ORDER BY ci.cart_item_id`, [cartId]);
  const subtotalCents = rows.reduce((sum, item) => sum + toCents(item.effective_price) * item.quantity, 0);
  const itemCount = rows.reduce((sum, item) => sum + item.quantity, 0);
  return { items: rows, item_count: itemCount, subtotal: (subtotalCents / 100).toFixed(2), subtotalCents };
}

// Strip the internal cents field before sending a cart to the browser.
function publicCart(cart) {
  const { subtotalCents, ...rest } = cart;
  return rest;
}


const getCart = asyncHandler(async (req, res) => {
  res.json(publicCart(await cartContents(req.user.user_id)));
});

const addCartItem = asyncHandler(async (req, res) => {
  assertFields(req.body, ['book_id', 'quantity']);
  const bookId = positiveInteger(req.body.book_id, 'book_id');
  const quantity = positiveInteger(req.body.quantity === undefined ? 1 : req.body.quantity, 'quantity');
  const cartId = await getOrCreateCart(req.user.user_id);
  const { rows: books } = await pool.query('SELECT quantity FROM books WHERE book_id=$1', [bookId]);
  if (!books.length) throw new HttpError(404, 'Book not found');

  // An atomic upsert avoids leaving an invalid quantity on failed requests.
  const { rows } = await pool.query(`INSERT INTO cart_items (cart_id,book_id,quantity)
    SELECT $1,book_id,$3 FROM books WHERE book_id=$2 AND quantity >= $3
    ON CONFLICT (cart_id,book_id)
    DO UPDATE SET quantity=cart_items.quantity+EXCLUDED.quantity
      WHERE cart_items.quantity+EXCLUDED.quantity <=
        (SELECT quantity FROM books WHERE book_id=EXCLUDED.book_id)
    RETURNING quantity`, [cartId,bookId,quantity]);
  if (!rows.length) throw new HttpError(409, 'Requested quantity exceeds inventory');
  res.status(201).json(publicCart(await cartContents(req.user.user_id)));
});

const updateCartItem = asyncHandler(async (req, res) => {
  assertFields(req.body, ['quantity']);
  const bookId = positiveInteger(req.params.bookId, 'bookId');
  const quantity = positiveInteger(req.body.quantity, 'quantity');
  const { rows: books } = await pool.query('SELECT quantity FROM books WHERE book_id=$1', [bookId]);
  if (!books.length) throw new HttpError(404, 'Book not found');
  if (quantity > books[0].quantity) throw new HttpError(409, 'Requested quantity exceeds inventory');
  const cartId = await getOrCreateCart(req.user.user_id);
  const result = await pool.query('UPDATE cart_items SET quantity=$1 WHERE cart_id=$2 AND book_id=$3 RETURNING cart_item_id', [quantity,cartId,bookId]);
  if (!result.rowCount) throw new HttpError(404, 'Cart item not found');
  res.json(publicCart(await cartContents(req.user.user_id)));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cartId = await getOrCreateCart(req.user.user_id);
  const id = positiveInteger(req.params.bookId, 'bookId');
  const result = await pool.query('DELETE FROM cart_items WHERE cart_id=$1 AND book_id=$2', [cartId,id]);
  if (!result.rowCount) throw new HttpError(404, 'Cart item not found');
  res.json(publicCart(await cartContents(req.user.user_id)));
});

// GET /api/cart/summary?discount_code=CODE
// Order summary for the cart/checkout pages: subtotal, discount, tax, total.
// Uses the same math as createOrder so the preview matches the final order.
const getCartSummary = asyncHandler(async (req, res) => {
  const cart = await cartContents(req.user.user_id);
  const discount = await findActiveDiscount(pool, req.query.discount_code);
  const totals = calculateTotals(cart.subtotalCents, discount ? discount.discount_percent : 0);
  res.json({
    item_count: cart.item_count,
    ...formatTotals(totals),
    tax_rate: TAX_RATE,
    discount_code: discount ? discount.code : null,
    discount_percent: discount ? discount.discount_percent : 0
  });
});

module.exports = { getCart, getCartSummary, addCartItem, updateCartItem, removeCartItem };
