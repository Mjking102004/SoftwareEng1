# Backend integration contract — Rowdy's Bookstore

Owner: Michael (backend and integration). This document is the shared initial contract; teammates should coordinate any breaking changes before modifying field names or response structures.

## Setup

The existing stack remains **Nginx -> Express -> PostgreSQL**, started with `docker compose up --build -d`. All browser API calls use relative URLs beginning with `/api`, so the Nginx reverse proxy handles them. Keep the browser on the same origin (`http://localhost` for development). No frontend page files were changed by the backend work.

- `GET /api/health` returns `{"status":"ok","database":"connected"}` when PostgreSQL is reachable.
- Configuration lives in `docker-compose.yml`; `backend/src/db/db.js` reads `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Set `SESSION_SECRET` to a long unpredictable secret before deploying. Production mode requires a non-default secret and HTTPS for Secure cookies.
- PostgreSQL sessions are created automatically in a `user_sessions` table.
- `backend/src/db/init.sql` runs **only on a fresh Docker database volume**. For an existing volume, apply the non-destructive migration once:
  ```bash
  docker compose exec -T db psql -U postgres -d database < backend/src/db/migrate.sql
  ```
  Take a database backup first. If prior cart data contains duplicate user carts or duplicate books within one cart, resolve those duplicates before applying the unique indexes. `docker compose down -v` will **delete all database data**, so do not use it for normal migrations.
- No self-registration endpoint can create admin users. For development, after registering a user, a team member with direct database access can promote that user:
  ```sql
  UPDATE users SET role='admin' WHERE email='your-admin@example.com';
  ```
  Never accept a `role` value from public registration or profile updates.

## Naming and response conventions

- JSON keys use `snake_case` and match database columns: `user_id`, `book_id`, `category_id`, `cart_item_id`, `order_id`, `discount_id`.
- Frontend forms use `first_name`, `last_name`, `email`, `password`; confirmation password stays entirely in the browser.
- Money is stored as PostgreSQL `NUMERIC(10,2)` and returned as decimal strings; frontend code should use `Number(value)` for display calculations. Do not trust client-supplied order totals.
- HTTP statuses: `200` success, `201` created, `400` invalid input, `401` login required, `403` admin-only, `404` missing resource, `409` duplicate/conflict. Errors use `{"error":"explanation"}`.
- Login is cookie-based; browser `fetch()` on the same origin automatically sends the session cookie. For cross-origin clients, use a same-origin proxy instead. No JWT/localStorage token is needed.
- `role` is either `customer` or `admin` and is always enforced by the server, not just by hiding page links.
- `GET /api/books` accepts optional `search`, `category_id`, `sort` (one of `title`, `price_asc`, `price_desc`, `newest`, `availability`). Sale selection uses the cheapest currently active sale.

## Authentication (teammate account UI)

| Method | Route | Body | Response |
|---|---|---|---|
| POST | /api/auth/register | `{first_name,last_name,email,password}` | `201 {user}` and login cookie |
| POST | /api/auth/login | `{email,password}` | `{user}` and login cookie |
| POST | /api/auth/logout | empty | `{message}` |
| GET | /api/auth/me | none | `{user}` |
| PATCH | /api/auth/me | any of `first_name,last_name,email` | `{user}` |

`user` has `user_id`, `first_name`, `last_name`, `email`, `role`, `created_at`. Password hashes are **never returned**. Passwords are hashed with bcrypt and 12 work-factor rounds; input must be 8+ characters and at most 72 UTF-8 bytes. Public registration always assigns customer. Existing frontend registration/login/account pages currently validate forms but need API wiring by the frontend owner.

## Public book catalog

| Method | Route | Response |
|---|---|---|
| GET | /api/books | `{books: [...]}` |
| GET | /api/books/categories | `{categories: [...]}` |
| GET | /api/books/:id | `{book: {...}}` |

Books contain `book_id`, `title`, `author`, `description`, `price`, `quantity`, `image_url`, `category_id`, `category`, `sale_price`, and `effective_price`. The existing homepage uses hardcoded books; the homepage owner can replace those with `GET /api/books`.

## Cart (login required)

| Method | Route | Body | Response |
|---|---|---|---|
| GET | /api/cart | none | `{items:[...],subtotal:"0.00"}` |
| POST | /api/cart/items | `{book_id,quantity}` | updated cart |
| PATCH | /api/cart/items/:bookId | `{quantity}` | updated cart |
| DELETE | /api/cart/items/:bookId | none | updated cart |

Quantity is a positive integer; to remove an item use DELETE. Each customer has one persistent cart. Cart items include `cart_item_id`, `book_id`, `title`, `quantity`, `available_quantity`, `price`, `sale_price`, `effective_price`. Inventory is checked again during checkout.

## Orders (login required)

| Method | Route | Body | Response |
|---|---|---|---|
| POST | /api/orders | optional `{discount_code:"SAVE10"}` | `201 {order,message}` |
| GET | /api/orders | none | `{orders:[...]}` |
| GET | /api/orders/:id | none | `{order,items:[...]}` |

Checkout is one PostgreSQL transaction: locks cart/book rows, calculates sale price and discount on the server, checks inventory, creates order lines, decrements inventory and empties cart. The `order` response has `order_id`, `user_id`, `subtotal`, `tax`, `total`, `status`, `order_date`, `discount_code_id`, `discount_amount`. **This is a classroom order workflow, not a real payment processor.** Tax is explicitly `0.00` until the team defines a tax policy. Order cancellation is only a status update and does not automatically restore stock.

## Admin (login + admin role required)

| Method | Route | Body | Response |
|---|---|---|---|
| GET | /api/admin/books | none | raw book array (legacy admin UI contract) |
| POST | /api/admin/books | `{title,author,price,quantity,description?,image_url?,category_id?}` | created book |
| PATCH | /api/admin/books/:id | changed book fields | updated book |
| DELETE | /api/admin/books/:id | none | `{message}` |
| GET | /api/admin/categories | none | raw category array (legacy admin UI contract) |
| POST | /api/admin/categories | `{name}` | created category |
| GET | /api/admin/users | none | `{users:[...]}` |
| PATCH | /api/admin/users/:id/role | `{role:"customer"|"admin"}` | `{user}` |
| GET | /api/admin/orders | none | `{orders:[...]}` |
| PATCH | /api/admin/orders/:id/status | `{status}` | `{order}` |
| GET | /api/admin/discounts | none | `{discounts:[...]}` |
| POST | /api/admin/discounts | `{code,discount_percent,active?}` | created discount |
| PATCH | /api/admin/discounts/:id | `{active}` | updated discount |
| GET | /api/admin/sales | none | `{sales:[...]}` |
| POST | /api/admin/sales | `{book_id,sale_price,starts_at?,ends_at?,active?}` | created sale |
| PATCH | /api/admin/sales/:id | `{active}` | updated sale |

Allowed order statuses: `Pending`, `Processing`, `Shipped`, `Completed`, `Cancelled`. Prevent deleting books already referenced by carts/orders (API returns 409). Do not expose admin account credentials in code or documentation.

## Integration checklist

1. Run `docker compose up --build -d`, then `curl http://localhost/api/health`.
2. Run `bash scripts/smoke-test.sh` against an initialized local database (test uses temporary accounts/data).
3. Connect the teammate's account UI to `/api/auth/...` without changing backend field names.
4. Connect homepage/catalog UI to `/api/books`, cart UI to `/api/cart`, and checkout/history UI to `/api/orders`.
5. Verify public users get 401/403 for admin routes; only a database-promoted admin should manage books/users.
6. Review pull requests for breaking changes to naming, authentication, Nginx proxy settings and schema; coordinate with Jonathan before schema changes.

## Known boundaries

- Live Docker tests must be run on a machine with Docker; having source code alone does not verify runtime health.
- Historical `/api/items` and the `temp` table were connection-test scaffolding and are not part of the bookstore API.
- No payment provider, shipping integrations, refunds, stock restoration on cancellation, or automatic sales expiration jobs are implemented. Sale date windows are evaluated when querying books/checking out.
- Persistent sessions are stored in PostgreSQL, but cross-site frontend deployments require a deliberate cookie/CSRF design change.
