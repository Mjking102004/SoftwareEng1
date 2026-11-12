// Shared cart/checkout math so the cart page, checkout preview, and the
// placed order all come out to the exact same numbers.
// Everything is done in whole cents to avoid floating point rounding errors.
const { HttpError } = require('./http');

// San Antonio, TX combined sales tax rate (6.25% state + 2% local).
const TAX_RATE = 0.0825;

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

function centsToString(cents) {
  return (cents / 100).toFixed(2);
}

// subtotalCents: sum of (effective price * quantity) for every cart item
// discountPercent: 0-100 from discount_codes, or 0 when no code is used
// Discount comes off first, then tax is charged on what's left.
function calculateTotals(subtotalCents, discountPercent = 0) {
  const discountCents = Math.round(subtotalCents * discountPercent / 100);
  const taxableCents = subtotalCents - discountCents;
  const taxCents = Math.round(taxableCents * TAX_RATE);
  const totalCents = taxableCents + taxCents;
  return { subtotalCents, discountCents, taxCents, totalCents };
}

// Same totals, formatted the way the API sends money (strings like "12.50").
function formatTotals(totals) {
  return {
    subtotal: centsToString(totals.subtotalCents),
    discount: centsToString(totals.discountCents),
    tax: centsToString(totals.taxCents),
    total: centsToString(totals.totalCents)
  };
}

// Look up an active discount code (case-insensitive).
// db can be the pool or a transaction client. Returns null when no code was given.
async function findActiveDiscount(db, code) {
  if (code === undefined || code === null || code === '') return null;
  if (typeof code !== 'string' || !code.trim()) throw new HttpError(400, 'Invalid discount code');
  const { rows } = await db.query(
    'SELECT * FROM discount_codes WHERE LOWER(code)=LOWER($1) AND active=TRUE',
    [code.trim()]
  );
  if (!rows.length) throw new HttpError(400, 'Invalid discount code');
  return rows[0];
}

module.exports = {
  TAX_RATE, toCents, centsToString, calculateTotals, formatTotals, findActiveDiscount
};
