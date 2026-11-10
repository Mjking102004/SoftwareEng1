const router = require('express').Router();
const pool = require('../db/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { HttpError, asyncHandler } = require('../utils/http');
const { positiveInteger, nonnegativeMoney, trimmedString, assertFields } = require('../utils/validation');

router.use(requireAuth, requireAdmin);

const bookFields = ['title','author','description','price','quantity','image_url','category_id'];
function parseBook(body, existing = null) {
  assertFields(body, bookFields);
  const merged = { ...existing, ...body };
  const quantity = Number(merged.quantity);
  if (!Number.isSafeInteger(quantity) || quantity < 0) throw new HttpError(400,'quantity must be a nonnegative integer');
  return {
    title: trimmedString(merged.title, 'title'),
    author: trimmedString(merged.author, 'author'),
    description: merged.description || null,
    price: nonnegativeMoney(merged.price),
    quantity,
    image_url: merged.image_url || null,
    category_id: merged.category_id ? positiveInteger(merged.category_id, 'category_id') : null
  };
}
router.get('/books', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT b.*,c.name AS category FROM books b
    LEFT JOIN categories c ON c.category_id=b.category_id ORDER BY b.book_id`);
  res.json(rows); // Preserve teammate's existing admin client contract.
}));
router.post('/books', asyncHandler(async (req, res) => {
  const b = parseBook(req.body);
  const { rows } = await pool.query(`INSERT INTO books
    (title,author,description,price,quantity,image_url,category_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [b.title,b.author,b.description,b.price,b.quantity,b.image_url,b.category_id]);
  res.status(201).json(rows[0]);
}));
router.patch('/books/:id', asyncHandler(async (req, res) => {
  const id = positiveInteger(req.params.id);
  const found = await pool.query('SELECT * FROM books WHERE book_id=$1',[id]);
  if (!found.rows.length) throw new HttpError(404,'Book not found');
  const b = parseBook(req.body, found.rows[0]);
  const { rows } = await pool.query(`UPDATE books SET title=$1,author=$2,description=$3,
    price=$4,quantity=$5,image_url=$6,category_id=$7 WHERE book_id=$8 RETURNING *`,
    [b.title,b.author,b.description,b.price,b.quantity,b.image_url,b.category_id,id]);
  res.json(rows[0]);
}));
router.delete('/books/:id', asyncHandler(async (req, res) => {
  const result = await pool.query('DELETE FROM books WHERE book_id=$1',[positiveInteger(req.params.id)]);
  if (!result.rowCount) throw new HttpError(404,'Book not found');
  res.json({message:'Book deleted.'});
}));

router.get('/categories', asyncHandler(async (req,res) => {
  const {rows} = await pool.query('SELECT * FROM categories ORDER BY name');
  res.json(rows);
}));
router.post('/categories', asyncHandler(async (req,res) => {
  assertFields(req.body,['name']);
  const {rows} = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [trimmedString(req.body.name,'name',100)]);
  res.status(201).json(rows[0]);
}));

router.get('/users', asyncHandler(async (req,res) => {
  const {rows} = await pool.query(`SELECT user_id,first_name,last_name,email,role,created_at
    FROM users ORDER BY user_id`);
  res.json({users:rows});
}));
router.patch('/users/:id/role', asyncHandler(async (req,res) => {
  assertFields(req.body,['role']);
  if (!['customer','admin'].includes(req.body.role)) throw new HttpError(400,'Invalid role');
  const id = positiveInteger(req.params.id);
  if (id === req.user.user_id && req.body.role !== 'admin') {
    throw new HttpError(400,'You cannot remove your own administrator access');
  }
  const {rows} = await pool.query(`UPDATE users SET role=$1 WHERE user_id=$2
    RETURNING user_id,first_name,last_name,email,role,created_at`,[req.body.role,id]);
  if (!rows.length) throw new HttpError(404,'User not found');
  res.json({user:rows[0]});
}));

router.get('/orders', asyncHandler(async (req,res) => {
  const {rows} = await pool.query('SELECT * FROM orders ORDER BY order_date DESC,order_id DESC');
  res.json({orders:rows});
}));
router.patch('/orders/:id/status', asyncHandler(async (req,res) => {
  assertFields(req.body,['status']);
  if (!['Pending','Processing','Shipped','Completed','Cancelled'].includes(req.body.status)) {
    throw new HttpError(400,'Invalid status');
  }
  const {rows} = await pool.query('UPDATE orders SET status=$1 WHERE order_id=$2 RETURNING *',
    [req.body.status,positiveInteger(req.params.id)]);
  if (!rows.length) throw new HttpError(404,'Order not found');
  res.json({order:rows[0]});
}));

router.get('/discounts', asyncHandler(async (req,res) => {
  const {rows} = await pool.query('SELECT * FROM discount_codes ORDER BY discount_id');
  res.json({discounts:rows});
}));
router.post('/discounts', asyncHandler(async (req,res) => {
  assertFields(req.body,['code','discount_percent','active']);
  const discount = Number(req.body.discount_percent);
  if (!Number.isInteger(discount) || discount < 0 || discount > 100) throw new HttpError(400,'discount_percent must be 0-100');
  const {rows} = await pool.query(
    'INSERT INTO discount_codes(code,discount_percent,active) VALUES($1,$2,$3) RETURNING *',
    [trimmedString(req.body.code,'code',50).toUpperCase(),discount,req.body.active ?? true]);
  res.status(201).json(rows[0]);
}));
router.patch('/discounts/:id', asyncHandler(async (req,res) => {
  assertFields(req.body,['active']);
  if (typeof req.body.active !== 'boolean') throw new HttpError(400,'active must be boolean');
  const {rows} = await pool.query('UPDATE discount_codes SET active=$1 WHERE discount_id=$2 RETURNING *',
    [req.body.active,positiveInteger(req.params.id)]);
  if (!rows.length) throw new HttpError(404,'Discount not found');
  res.json(rows[0]);
}));

router.get('/sales', asyncHandler(async (req,res) => {
  const {rows} = await pool.query('SELECT * FROM sales ORDER BY sale_id');
  res.json({sales:rows});
}));
router.post('/sales', asyncHandler(async (req,res) => {
  assertFields(req.body,['book_id','sale_price','starts_at','ends_at','active']);
  const starts = req.body.starts_at ?? null;
  const ends = req.body.ends_at ?? null;
  if (starts && Number.isNaN(Date.parse(starts)) || ends && Number.isNaN(Date.parse(ends))) {
    throw new HttpError(400,'Invalid sale dates');
  }
  if (starts && ends && Date.parse(ends) <= Date.parse(starts)) throw new HttpError(400,'Sale end must be after start');
  const {rows} = await pool.query(`INSERT INTO sales
    (book_id,sale_price,starts_at,ends_at,active) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [positiveInteger(req.body.book_id,'book_id'),nonnegativeMoney(req.body.sale_price,'sale_price'),
      starts,ends,req.body.active ?? true]);
  res.status(201).json(rows[0]);
}));
router.patch('/sales/:id', asyncHandler(async (req,res) => {
  assertFields(req.body,['active']);
  if (typeof req.body.active !== 'boolean') throw new HttpError(400,'active must be boolean');
  const {rows} = await pool.query('UPDATE sales SET active=$1 WHERE sale_id=$2 RETURNING *',
    [req.body.active,positiveInteger(req.params.id)]);
  if (!rows.length) throw new HttpError(404,'Sale not found');
  res.json(rows[0]);
}));

module.exports = router;
