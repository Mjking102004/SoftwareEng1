-- Rowdy's Bookstore: initial schema (runs automatically on a NEW PostgreSQL volume).
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS books (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  image_url VARCHAR(255),
  category_id INT REFERENCES categories(category_id)
);

CREATE TABLE IF NOT EXISTS carts (
  cart_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  cart_id INT NOT NULL REFERENCES carts(cart_id),
  book_id INT NOT NULL REFERENCES books(book_id),
  UNIQUE (cart_id,book_id)
);

CREATE TABLE IF NOT EXISTS discount_codes (
  discount_id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  discount_percent INT NOT NULL CHECK (discount_percent BETWEEN 0 AND 100),
  active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE UNIQUE INDEX IF NOT EXISTS discount_code_lower_unique ON discount_codes (LOWER(code));

CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  tax DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending','Processing','Shipped','Completed','Cancelled')),
  order_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  discount_code_id INT REFERENCES discount_codes(discount_id),
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0)
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(order_id),
  book_id INT NOT NULL REFERENCES books(book_id),
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS sales (
  sale_id SERIAL PRIMARY KEY,
  book_id INT NOT NULL REFERENCES books(book_id),
  sale_price DECIMAL(10,2) NOT NULL CHECK (sale_price >= 0),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at)
);
