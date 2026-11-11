// cartUI.js - renders the shopping cart page (/cart) (Ken)
// All cart data and math comes from cartStore.js / the backend.

import {
    loadCart,
    getCart,
    updateQuantity,
    removeItem,
    getSummary,
    formatPrice,
    LOGIN_MESSAGE
} from './cartStore.js';

const itemsContainer = document.getElementById('cart-items');
const summaryContainer = document.getElementById('cart-summary');
const pageMessage = document.getElementById('cart-message');

let messageTimer = null;
let busy = false;

// Small helper to create an element with a class and text.
function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function showMessage(text, isError = false) {
    pageMessage.textContent = text;
    pageMessage.classList.toggle('is-error', isError);
    clearTimeout(messageTimer);
    if (text) messageTimer = setTimeout(() => { pageMessage.textContent = ''; }, 4000);
}

// Turn all the cart buttons off while a request is running so the user
// can't double-click and send the same change twice.
function setBusy(value) {
    busy = value;
    document.querySelectorAll('.cart-page button').forEach((button) => {
        if (value) {
            button.dataset.wasDisabled = String(button.disabled);
            button.disabled = true;
        } else if (button.dataset.wasDisabled !== undefined) {
            // Only restore buttons we turned off (re-rendered buttons are already correct).
            button.disabled = button.dataset.wasDisabled === 'true';
            delete button.dataset.wasDisabled;
        }
    });
}

async function runChange(action) {
    if (busy) return;
    setBusy(true);
    const result = await action();
    setBusy(false);
    if (!result.ok) showMessage(result.message, true);
}

// ---------- one cart row ----------

function buildCartItem(item) {
    const row = el('article', 'cart-item');

    const image = document.createElement('img');
    image.className = 'cart-item-image';
    image.alt = item.title + ' cover';
    if (item.image_url) image.src = item.image_url;
    // If the cover can't load, leave the grey placeholder box instead of broken alt text.
    image.onerror = () => {
        image.removeAttribute('src');
        image.alt = '';
    };
    row.appendChild(image);

    const info = el('div', 'cart-item-info');
    info.appendChild(el('h3', '', item.title));
    if (item.author) info.appendChild(el('p', 'cart-item-author', 'By ' + item.author));

    const price = el('p', 'cart-item-price');
    if (item.sale_price !== null && item.sale_price !== undefined) {
        price.appendChild(el('span', 'original-price', formatPrice(item.price)));
        price.appendChild(document.createTextNode(' ' + formatPrice(item.effective_price) + ' each'));
    } else {
        price.textContent = formatPrice(item.effective_price) + ' each';
    }
    info.appendChild(price);

    if (item.quantity >= item.available_quantity) {
        info.appendChild(el('p', 'cart-item-stock', 'Only ' + item.available_quantity + ' in stock'));
    }

    const removeButton = el('button', 'cart-remove', 'Remove');
    removeButton.type = 'button';
    removeButton.setAttribute('aria-label', 'Remove ' + item.title + ' from cart');
    removeButton.addEventListener('click', () => runChange(() => removeItem(item.book_id)));
    info.appendChild(removeButton);
    row.appendChild(info);

    // Quantity controls: - [count] +
    const qty = el('div', 'cart-qty');
    const minus = el('button', 'qty-btn', '−');
    minus.type = 'button';
    minus.setAttribute('aria-label', 'Decrease quantity of ' + item.title);
    minus.addEventListener('click', () => runChange(() => updateQuantity(item.book_id, item.quantity - 1)));

    const count = el('span', 'qty-count', String(item.quantity));
    count.setAttribute('aria-label', 'Quantity of ' + item.title + ': ' + item.quantity);

    const plus = el('button', 'qty-btn', '+');
    plus.type = 'button';
    plus.setAttribute('aria-label', 'Increase quantity of ' + item.title);
    plus.disabled = item.quantity >= item.available_quantity;
    plus.addEventListener('click', () => runChange(() => updateQuantity(item.book_id, item.quantity + 1)));

    qty.append(minus, count, plus);
    row.appendChild(qty);

    const lineTotal = Number(item.effective_price) * item.quantity;
    row.appendChild(el('p', 'cart-line-total', formatPrice(lineTotal)));
    return row;
}

// ---------- order summary box ----------

function summaryRow(label, value, className = '') {
    const row = el('div', 'summary-row ' + className);
    row.appendChild(el('span', '', label));
    row.appendChild(el('span', '', value));
    return row;
}

async function renderSummary() {
    const result = await getSummary();
    summaryContainer.innerHTML = '';
    summaryContainer.appendChild(el('h2', '', 'Order Summary'));

    if (!result.ok) {
        summaryContainer.appendChild(el('p', 'cart-message is-error', result.message));
        return;
    }
    const s = result.summary;
    const itemLabel = 'Subtotal (' + s.item_count + (s.item_count === 1 ? ' item)' : ' items)');
    summaryContainer.appendChild(summaryRow(itemLabel, formatPrice(s.subtotal)));
    summaryContainer.appendChild(summaryRow('Estimated tax (' + (s.tax_rate * 100).toFixed(2) + '%)', formatPrice(s.tax)));
    summaryContainer.appendChild(summaryRow('Estimated total', formatPrice(s.total), 'summary-total'));
    summaryContainer.appendChild(el('p', 'summary-note', 'Discount codes can be applied at checkout.'));

    const checkout = el('a', 'checkout-button', 'Proceed to Checkout');
    checkout.href = '/checkout';
    summaryContainer.appendChild(checkout);
}

// ---------- whole page ----------

function renderEmpty() {
    const empty = el('div', 'cart-empty');
    empty.appendChild(el('h2', '', 'Your cart is empty'));
    empty.appendChild(el('p', '', 'Browse our catalog and add a book to get started.'));
    const link = el('a', 'continue-link', 'Browse Books');
    link.href = '/#catalog';
    empty.appendChild(link);
    itemsContainer.appendChild(empty);
    summaryContainer.hidden = true;
}

function renderLoggedOut(message) {
    const box = el('div', 'cart-empty');
    box.appendChild(el('h2', '', message === LOGIN_MESSAGE ? 'Log in to see your cart' : 'Something went wrong'));
    box.appendChild(el('p', '', message));
    if (message === LOGIN_MESSAGE) {
        const login = el('a', 'continue-link', 'Log In');
        login.href = '/login';
        box.appendChild(login);
    }
    itemsContainer.appendChild(box);
    summaryContainer.hidden = true;
}

function renderCart() {
    const cart = getCart();
    itemsContainer.innerHTML = '';

    if (cart.items.length === 0) {
        renderEmpty();
        return;
    }

    cart.items.forEach((item) => itemsContainer.appendChild(buildCartItem(item)));

    const back = el('a', 'continue-link', '← Continue Shopping');
    back.href = '/#catalog';
    itemsContainer.appendChild(back);

    summaryContainer.hidden = false;
    renderSummary();
}

async function init() {
    const result = await loadCart();
    if (!result.ok) {
        itemsContainer.innerHTML = '';
        renderLoggedOut(result.message);
        return;
    }
    renderCart();
    // Re-render whenever the cart changes (quantity, remove, etc.).
    window.addEventListener('cart:updated', renderCart);
}

init();
