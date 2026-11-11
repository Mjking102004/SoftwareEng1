# Ken - Development Log (Cart & Checkout)

## Responsibilities
Shopping cart, cart calculations (subtotal, discount, tax, total), checkout, and order placement.

## Sprint 2 - Nov 10, 2026

### What I built
**Frontend**
- `frontend/src/ui/cartStore.js` - one shared cart module for the whole site. Talks to the backend `/api/cart` and `/api/orders` endpoints. Other pages import from it instead of making their own cart:
  - `loadCart()`, `getCart()`, `getCartCount()`, `getCartItemQuantity(book)`
  - `addToCart(book, qty)`, `updateQuantity(bookId, qty)`, `removeItem(bookId)`
  - `getSummary(code)`, `placeOrder(code)`, `getOrder(id)`, `formatPrice(n)`
  - Fires a `cart:updated` event and updates the navbar `#cart-count` badge whenever the cart changes.
- `frontend/src/pages/cart.html` + `frontend/src/ui/cartUI.js` - cart page: book cover, title, author, sale price, +/- quantity (capped at stock), remove, line totals, order summary with estimated tax, empty-cart and logged-out states.
- `frontend/src/pages/checkout.html` + `frontend/src/ui/checkoutUI.js` - checkout page: order review, discount code (apply / invalid code message), subtotal / discount / tax / total, Place Order, and an order confirmation screen with the order number.
- `frontend/src/cart.css` - styles for cart + checkout, kept in a separate file so it doesn't conflict with the shared `index.css`. Uses the same colors as the shared theme and works on phones.
- `frontend/src/ui/navigationUI.js` - small change: Cart link now shows the item count, `Cart (3)`.

**Backend**
- `backend/src/utils/pricing.js` - shared money math done in cents. Discount comes off the subtotal first, then 8.25% tax (San Antonio sales tax) on the rest.
- `GET /api/cart/summary?discount_code=CODE` - returns subtotal, discount, tax, total so the cart and checkout pages show exactly what the order will charge.
- `POST /api/orders` now charges tax using the same pricing function (it was 0 before).
- `GET /api/orders/:id` now includes book titles so the confirmation can show them.
- Cart items now include `author` and `image_url`, plus an `item_count` total.

### Testing
Ran the backend against a real PostgreSQL 16 database with test books, a sale price, and a `ROWDY10` (10%) discount code, then tested in Chrome:
- Logged out: cart shows "Log in to see your cart" with a login link.
- Add to cart from the store (book object with `book_id` or `id`, or just an id) - navbar count updates.
- Adding more than what's in stock is rejected ("No more copies available").
- + / - quantity, + disables at max stock, quantity 0 removes, Remove button works.
- Sale prices are used in totals and shown with the original price crossed out.
- Invalid discount code shows an error and isn't applied; valid code applies 10% off.
- Checkout preview total matched the placed order exactly (e.g. $37.97 - $3.80 discount + $2.82 tax = $36.99).
- Placing an order saves it, lowers book inventory, empties the cart, and shows the confirmation.
- Checkout with an empty cart shows "Your cart is empty."
- Checked the browser Console: no JavaScript errors. (The only red lines are expected 401s when logged out and 400 for an invalid discount code.)
- Checked layout on desktop and a phone-sized screen.

### Notes for the team
- Cart requires login because the backend cart routes use `requireAuth`.
- @Abraham: your Add to Cart button just needs `await addToCart(book)` and `getCartItemQuantity(book)` from `cartStore.js`. They're async now since they hit the backend. The old `cart.html` / `cartUi.js` / `cartStore.js` on your branch can be dropped in favor of these.
- Tax rate is in one place (`TAX_RATE` in `backend/src/utils/pricing.js`) if we want to change it.

### Tools used
VS Code, Git/GitHub, Docker, Node.js/Express, PostgreSQL, Chrome DevTools.
