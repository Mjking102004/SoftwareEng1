-- Apply once to an existing database volume (do not reset the volume).
-- Example: docker compose exec -T db psql -U postgres -d database < backend/src/db/migrate.sql
-- Back up important existing data first. Duplicate carts/items/codes must be resolved
-- manually before creating the unique indexes.
BEGIN;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code_id INT REFERENCES discount_codes(discount_id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique ON users (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS carts_user_unique_idx ON carts (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_cart_book_unique_idx ON cart_items (cart_id,book_id);
CREATE UNIQUE INDEX IF NOT EXISTS discount_code_lower_unique ON discount_codes (LOWER(code));
COMMIT;
