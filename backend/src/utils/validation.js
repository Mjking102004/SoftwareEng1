const { HttpError } = require('./http');

function positiveInteger(value, field = 'id') {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1) throw new HttpError(400, field + ' must be a positive integer');
  return n;
}

function nonnegativeMoney(value, field = 'price') {
  if (value === '' || value === null || value === undefined) throw new HttpError(400, field + ' is required');
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || !/^\d+(?:\.\d{1,2})?$/.test(String(value))) {
    throw new HttpError(400, field + ' must be a nonnegative amount with up to 2 decimals');
  }
  return n;
}

function trimmedString(value, field, max = 255) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new HttpError(400, field + ' must contain 1-' + max + ' characters');
  }
  return value.trim();
}

function emailAddress(value) {
  const email = trimmedString(value, 'email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Invalid email');
  return email;
}

function assertFields(body, allowed) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'A JSON object is required');
  }
  const extra = Object.keys(body).filter((key) => !allowed.includes(key));
  if (extra.length) throw new HttpError(400, 'Unexpected field: ' + extra[0]);
}

module.exports = { positiveInteger, nonnegativeMoney, trimmedString, emailAddress, assertFields };
