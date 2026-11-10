const { asyncHandler } = require('../utils/http');
const { positiveInteger } = require('../utils/validation');
const pool = require('../db/db');


const getBooks = asyncHandler(async (req, res) => {
  const { search, category_id, sort = 'title' } = req.query;
  const sortColumns = {
    title: 'b.title ASC', price_asc: 'effective_price ASC, b.title ASC',
    price_desc: 'effective_price DESC, b.title ASC', newest: 'b.book_id DESC',
    availability: 'b.quantity DESC, b.title ASC'
  };
  if (!sortColumns[sort]) return res.status(400).json({ error: 'Invalid sort option' });
  const params = [];
  const where = [];
  if (search) {
    params.push('%' + String(search).trim() + '%');
    where.push('(b.title ILIKE $' + params.length + ' OR b.author ILIKE $' + params.length + ')');
  }
  if (category_id !== undefined) {
    params.push(positiveInteger(category_id, 'category_id'));
    where.push('b.category_id = $' + params.length);
  }
  const sql = `SELECT b.*, c.name AS category, s.sale_price,
    COALESCE(s.sale_price, b.price) AS effective_price
    FROM books b LEFT JOIN categories c ON c.category_id = b.category_id
    LEFT JOIN LATERAL (
      SELECT MIN(sale_price) AS sale_price FROM sales
      WHERE book_id = b.book_id AND active = TRUE
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (ends_at IS NULL OR ends_at > NOW())
    ) s ON TRUE
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY ${sortColumns[sort]}`;
  const { rows } = await pool.query(sql, params);
  res.json({ books: rows });
});

const getCategories = asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY name');
  res.json({ categories: rows });
});

const getBook = asyncHandler(async (req, res) => {
  const id = positiveInteger(req.params.id);
  const { rows } = await pool.query(`SELECT b.*, c.name AS category, s.sale_price,
    COALESCE(s.sale_price, b.price) AS effective_price
    FROM books b LEFT JOIN categories c ON c.category_id=b.category_id
    LEFT JOIN LATERAL (
      SELECT MIN(sale_price) AS sale_price FROM sales
      WHERE book_id = b.book_id AND active = TRUE
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (ends_at IS NULL OR ends_at > NOW())
    ) s ON TRUE WHERE b.book_id=$1`, [id]);
  if (!rows.length) return res.status(404).json({ error: 'Book not found' });
  res.json({ book: rows[0] });
});
module.exports = { getBooks, getCategories, getBook };
