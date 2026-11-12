// checkoutUI.js - checkout page (/checkout) (Ken)
// Review the cart, apply a discount code, see subtotal/discount/tax/total,
// place the order, then show the confirmation.

import {
    loadCart,
    getCart,
    getSummary,
    placeOrder,
    getOrder,
    formatPrice,
    LOGIN_MESSAGE
} from './cartStore.js';

const heading = document.getElementById('checkout-heading');
const message = document.getElementById('checkout-message');
const checkoutView = document.getElementById('checkout-view');
const itemsList = document.getElementById('checkout-items');
const totalsBox = document.getElementById('checkout-totals');

const discountForm = document.getElementById('discount-form');
const discountInput = document.getElementById('discount-code');
const discountApply = document.getElementById('discount-apply');
const discountFeedback = document.getElementById('discount-feedback');
const placeOrderButton = document.getElementById('place-order');

const confirmationView = document.getElementById('confirmation-view');
const confirmationNumber = document.getElementById('confirmation-number');
const confirmationItems = document.getElementById('confirmation-items');
const confirmationTotals = document.getElementById('confirmation-totals');

// The code that was checked and accepted. Only this one is sent with the order.
let appliedCode = '';

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle('is-error', isError);
}

function itemRow(title, quantity, lineTotal) {
    const li = el('li', 'checkout-item');
    li.appendChild(el('span', 'checkout-item-title', title + ' × ' + quantity));
    li.appendChild(el('span', 'checkout-item-total', formatPrice(lineTotal)));
    return li;
}

function totalsRow(label, value, className = '') {
    const row = el('div', 'summary-row ' + className);
    row.appendChild(el('span', '', label));
    row.appendChild(el('span', '', value));
    return row;
}

// Builds the subtotal / discount / tax / total rows.
// Works for both the live summary and a saved order.
function renderTotals(box, t) {
    box.innerHTML = '';
    box.appendChild(totalsRow('Subtotal', formatPrice(t.subtotal)));
    if (Number(t.discount) > 0) {
        const label = 'Discount' + (t.code ? ' (' + t.code + (t.percent ? ', ' + t.percent + '% off' : '') + ')' : '');
        box.appendChild(totalsRow(label, '−' + formatPrice(t.discount), 'summary-discount'));
    }
    const taxLabel = t.taxRate !== undefined ? 'Tax (' + (t.taxRate * 100).toFixed(2) + '%)' : 'Tax';
    box.appendChild(totalsRow(taxLabel, formatPrice(t.tax)));
    box.appendChild(totalsRow('Total', formatPrice(t.total), 'summary-total'));
}

function renderItems() {
    itemsList.innerHTML = '';
    getCart().items.forEach((item) => {
        itemsList.appendChild(itemRow(item.title, item.quantity, Number(item.effective_price) * item.quantity));
    });
}

async function refreshTotals(code) {
    const result = await getSummary(code);
    if (!result.ok) return result;
    const s = result.summary;
    renderTotals(totalsBox, {
        subtotal: s.subtotal,
        discount: s.discount,
        tax: s.tax,
        total: s.total,
        taxRate: s.tax_rate,
        code: s.discount_code,
        percent: s.discount_percent
    });
    return result;
}

// ---------- discount code ----------

discountForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const code = discountInput.value.trim();
    discountFeedback.classList.remove('is-error', 'is-success');

    if (!code) {
        // Empty box removes the code.
        appliedCode = '';
        discountFeedback.textContent = '';
        await refreshTotals('');
        return;
    }

    discountApply.disabled = true;
    const result = await refreshTotals(code);
    discountApply.disabled = false;

    if (!result.ok) {
        discountFeedback.textContent = result.message;
        discountFeedback.classList.add('is-error');
        discountInput.setAttribute('aria-invalid', 'true');
        appliedCode = '';
        await refreshTotals('');
        return;
    }
    appliedCode = result.summary.discount_code;
    discountInput.setAttribute('aria-invalid', 'false');
    discountFeedback.textContent = 'Code applied: ' + result.summary.discount_percent + '% off.';
    discountFeedback.classList.add('is-success');
});

// If the user edits the code after applying it, it's no longer applied.
discountInput.addEventListener('input', () => {
    if (appliedCode && discountInput.value.trim().toLowerCase() !== appliedCode.toLowerCase()) {
        appliedCode = '';
        refreshTotals('');
        discountFeedback.textContent = 'Press Apply to use this code.';
        discountFeedback.classList.remove('is-error', 'is-success');
    }
});

// ---------- place order ----------

placeOrderButton.addEventListener('click', async () => {
    placeOrderButton.disabled = true;
    placeOrderButton.textContent = 'Placing order...';
    showMessage('');

    const result = await placeOrder(appliedCode);
    if (!result.ok) {
        showMessage(result.message, true);
        placeOrderButton.disabled = false;
        placeOrderButton.textContent = 'Place Order';
        // Stock or prices may have changed, so reload what's in the cart.
        await loadCart();
        renderItems();
        await refreshTotals(appliedCode);
        return;
    }
    await showConfirmation(result.order);
});

async function showConfirmation(order) {
    checkoutView.hidden = true;
    heading.textContent = 'Order Confirmed';
    confirmationNumber.textContent = 'Order #' + order.order_id + ' · Status: ' + order.status;

    const details = await getOrder(order.order_id);
    confirmationItems.innerHTML = '';
    if (details.ok) {
        details.items.forEach((item) => {
            confirmationItems.appendChild(itemRow(item.title || 'Book #' + item.book_id, item.quantity, Number(item.price) * item.quantity));
        });
    }
    renderTotals(confirmationTotals, {
        subtotal: order.subtotal,
        discount: order.discount_amount,
        tax: order.tax,
        total: order.total,
        code: appliedCode
    });
    confirmationView.hidden = false;
    heading.focus();
}

// ---------- start ----------

async function init() {
    const result = await loadCart();
    if (!result.ok) {
        showMessage(result.message, true);
        if (result.message === LOGIN_MESSAGE) {
            const login = el('a', 'continue-link', 'Log In');
            login.href = '/login';
            message.after(login);
        }
        return;
    }
    if (getCart().items.length === 0) {
        showMessage('Your cart is empty.');
        const browse = el('a', 'continue-link', 'Browse Books');
        browse.href = '/#catalog';
        message.after(browse);
        return;
    }
    renderItems();
    await refreshTotals('');
    checkoutView.hidden = false;
}

heading.tabIndex = -1;
init();
