// cartStore.js - the ONE shared cart for the whole site (Ken)
//
// Every page that touches the cart imports from here instead of keeping its own copy.
// The cart lives in the database (carts / cart_items) and is reached through
// the backend API at /api/cart, so it follows the user across pages and devices.
// The backend requires login for the cart, so a logged-out user gets a "please log in" message.
//
// How to use it from another page (example: Add to Cart on the homepage):
//
//   import { addToCart, getCartItemQuantity, loadCart } from './cartStore.js';
//
//   await loadCart();                        // once when the page loads
//   const result = await addToCart(book);    // book needs book_id (or id)
//   if (!result.ok) showError(result.message);
//
// Whenever the cart changes, a 'cart:updated' event fires on window, and any
// element with id="cart-count" (the navbar badge) is updated automatically.

const CART_API = '/api/cart';
const ORDERS_API = '/api/orders';

// Last cart we got from the server. Pages read this synchronously after loadCart().
let cart = { items: [], item_count: 0, subtotal: '0.00' };
let loggedIn = true;

export const LOGIN_MESSAGE = 'Please log in to use your cart.';

// ---------- helpers ----------

// Send a request to the backend and always come back with { ok, status, data }.
async function request(url, options = {}) {
    try {
        const response = await fetch(url, {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        let data = {};
        try {
            data = await response.json();
        } catch (err) {
            data = {};
        }
        if (response.status === 401) loggedIn = false;
        return { ok: response.ok, status: response.status, data };
    } catch (err) {
        return { ok: false, status: 0, data: { error: 'Unable to connect to the server. Please try again.' } };
    }
}

function errorMessage(result, fallback) {
    if (result.status === 401) return LOGIN_MESSAGE;
    return (result.data && result.data.error) || fallback;
}

// Save the new cart, update the navbar count, and tell the page it changed.
function setCart(newCart) {
    cart = {
        items: newCart.items || [],
        item_count: newCart.item_count || 0,
        subtotal: newCart.subtotal || '0.00'
    };
    updateCartCount();
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: getCart() }));
}

// Accept a book object from the catalog (book_id or id) or a plain id number.
function getBookId(bookOrId) {
    if (typeof bookOrId === 'object' && bookOrId !== null) {
        return Number(bookOrId.book_id ?? bookOrId.id);
    }
    return Number(bookOrId);
}

// ---------- reading the cart ----------

// Get the latest cart from the server. Call this once when a page loads.
export async function loadCart() {
    const result = await request(CART_API);
    if (result.ok) {
        loggedIn = true;
        setCart(result.data);
        return { ok: true, cart: getCart() };
    }
    setCart({ items: [], item_count: 0, subtotal: '0.00' });
    return { ok: false, message: errorMessage(result, 'Could not load your cart.') };
}

// Copy of the cart we already loaded (no network call).
export function getCart() {
    return {
        items: cart.items.map((item) => ({ ...item })),
        item_count: cart.item_count,
        subtotal: cart.subtotal
    };
}

export function isLoggedIn() {
    return loggedIn;
}

// Total number of books in the cart (2 copies of one book counts as 2).
export function getCartCount() {
    return cart.item_count;
}

// How many copies of one book are already in the cart (0 if none).
export function getCartItemQuantity(bookOrId) {
    const bookId = getBookId(bookOrId);
    const item = cart.items.find((i) => i.book_id === bookId);
    return item ? item.quantity : 0;
}

// Put the item count in the navbar badge if the page has one.
export function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = String(cart.item_count);
}

// ---------- changing the cart ----------

export async function addToCart(bookOrId, quantity = 1) {
    const bookId = getBookId(bookOrId);
    if (!Number.isInteger(bookId) || bookId < 1) {
        return { ok: false, message: 'Invalid book.' };
    }
    const result = await request(CART_API + '/items', {
        method: 'POST',
        body: JSON.stringify({ book_id: bookId, quantity })
    });
    if (!result.ok) {
        const message = result.status === 409
            ? 'No more copies available.'
            : errorMessage(result, 'Could not add this book to your cart.');
        return { ok: false, message };
    }
    setCart(result.data);
    return { ok: true, message: 'Added to cart!', cart: getCart() };
}

// Set a book to an exact quantity. 0 or less removes it.
export async function updateQuantity(bookOrId, quantity) {
    const bookId = getBookId(bookOrId);
    if (quantity < 1) return removeItem(bookId);
    const result = await request(CART_API + '/items/' + bookId, {
        method: 'PATCH',
        body: JSON.stringify({ quantity })
    });
    if (!result.ok) {
        const message = result.status === 409
            ? 'Only ' + availableFor(bookId) + ' in stock.'
            : errorMessage(result, 'Could not update the quantity.');
        return { ok: false, message };
    }
    setCart(result.data);
    return { ok: true, cart: getCart() };
}

export async function removeItem(bookOrId) {
    const bookId = getBookId(bookOrId);
    const result = await request(CART_API + '/items/' + bookId, { method: 'DELETE' });
    if (!result.ok) {
        return { ok: false, message: errorMessage(result, 'Could not remove this book.') };
    }
    setCart(result.data);
    return { ok: true, cart: getCart() };
}

function availableFor(bookId) {
    const item = cart.items.find((i) => i.book_id === bookId);
    return item ? item.available_quantity : 0;
}

// ---------- totals and checkout ----------

// Ask the backend for subtotal / discount / tax / total.
// The backend does the math so the numbers match the order that gets placed.
export async function getSummary(discountCode = '') {
    const code = discountCode.trim();
    const url = CART_API + '/summary' + (code ? '?discount_code=' + encodeURIComponent(code) : '');
    const result = await request(url);
    if (!result.ok) {
        return { ok: false, message: errorMessage(result, 'Could not calculate your total.') };
    }
    return { ok: true, summary: result.data };
}

// Place the order for everything in the cart. The backend checks stock,
// saves the order, lowers inventory, and empties the cart in one transaction.
export async function placeOrder(discountCode = '') {
    const code = discountCode.trim();
    const result = await request(ORDERS_API, {
        method: 'POST',
        body: JSON.stringify(code ? { discount_code: code } : {})
    });
    if (!result.ok) {
        return { ok: false, message: errorMessage(result, 'Could not place your order.') };
    }
    setCart({ items: [], item_count: 0, subtotal: '0.00' });
    return { ok: true, order: result.data.order };
}

// Full order with its items (used by the confirmation screen).
export async function getOrder(orderId) {
    const result = await request(ORDERS_API + '/' + encodeURIComponent(orderId));
    if (!result.ok) {
        return { ok: false, message: errorMessage(result, 'Could not load this order.') };
    }
    return { ok: true, order: result.data.order, items: result.data.items };
}

// $12.5 -> "$12.50"
export function formatPrice(amount) {
    return '$' + Number(amount || 0).toFixed(2);
}
