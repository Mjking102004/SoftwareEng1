const pool = require('../db/db');
const { asyncHandler, HttpError } = require('../utils/http');

const requireAuth = asyncHandler(async (req, res, next) => {
  if (!req.session || !req.session.userId) throw new HttpError(401, 'Please log in');
  const { rows } = await pool.query(
    'SELECT user_id, first_name, last_name, email, role, created_at FROM users WHERE user_id = $1',
    [req.session.userId]
  );
  if (!rows.length) throw new HttpError(401, 'Account not found');
  req.user = rows[0];
  next();
});

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new HttpError(403, 'Administrator access required'));
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
