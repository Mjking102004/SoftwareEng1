const bcrypt = require('bcrypt');
const pool = require('../db/db');
const { HttpError, asyncHandler } = require('../utils/http');
const { trimmedString, emailAddress, assertFields } = require('../utils/validation');

const safeUser = (row) => ({
  user_id: row.user_id,
  first_name: row.first_name,
  last_name: row.last_name,
  email: row.email,
  role: row.role,
  created_at: row.created_at
});

function passwordInput(value) {
  if (typeof value !== 'string' || value.length < 8 || Buffer.byteLength(value, 'utf8') > 72) {
    throw new HttpError(400, 'Password must be at least 8 characters and at most 72 bytes');
  }
  return value;
}

async function startSession(req, userId) {
  await new Promise((resolve, reject) => req.session.regenerate((err) => err ? reject(err) : resolve()));
  req.session.userId = userId;
  await new Promise((resolve, reject) => req.session.save((err) => err ? reject(err) : resolve()));
}

const register = asyncHandler(async (req, res) => {
  assertFields(req.body, ['first_name', 'last_name', 'email', 'password']);
  const first = trimmedString(req.body.first_name, 'first_name', 50);
  const last = trimmedString(req.body.last_name, 'last_name', 50);
  const email = emailAddress(req.body.email);
  const password = passwordInput(req.body.password);
  const hash = await bcrypt.hash(password, 12);

  const { rows } = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, 'customer')
     RETURNING user_id, first_name, last_name, email, role, created_at`,
    [first, last, email, hash]
  );
  await startSession(req, rows[0].user_id);
  res.status(201).json({ user: safeUser(rows[0]) });
});

const login = asyncHandler(async (req, res) => {
  assertFields(req.body, ['email', 'password']);
  const email = emailAddress(req.body.email);
  if (typeof req.body.password !== 'string') throw new HttpError(400, 'Password is required');

  const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [email]);
  const valid = rows.length && await bcrypt.compare(req.body.password, rows[0].password_hash);
  if (!valid) throw new HttpError(401, 'Invalid email or password');

  await startSession(req, rows[0].user_id);
  res.json({ user: safeUser(rows[0]) });
});

const logout = asyncHandler(async (req, res) => {
  if (!req.session) return res.json({ message: 'Logged out' });
  await new Promise((resolve, reject) => req.session.destroy((err) => err ? reject(err) : resolve()));
  res.clearCookie('connect.sid', { path: '/' });
  res.json({ message: 'Logged out' });
});

const me = (req, res) => res.json({ user: safeUser(req.user) });

const updateMe = asyncHandler(async (req, res) => {
  assertFields(req.body, ['first_name', 'last_name', 'email']);
  if (!Object.keys(req.body).length) throw new HttpError(400, 'No changes provided');
  const first = req.body.first_name === undefined ? req.user.first_name
    : trimmedString(req.body.first_name, 'first_name', 50);
  const last = req.body.last_name === undefined ? req.user.last_name
    : trimmedString(req.body.last_name, 'last_name', 50);
  const email = req.body.email === undefined ? req.user.email : emailAddress(req.body.email);
  const { rows } = await pool.query(
    `UPDATE users SET first_name=$1, last_name=$2, email=$3 WHERE user_id=$4
     RETURNING user_id, first_name, last_name, email, role, created_at`,
    [first, last, email, req.user.user_id]
  );
  res.json({ user: safeUser(rows[0]) });
});

module.exports = { register, login, logout, me, updateMe };
