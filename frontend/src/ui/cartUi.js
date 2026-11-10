import { getCart, setQuantity, removeItem } from '../server/cartServer.js';
import { fetchBooks } from '../server/bookServer.js';
import { formatPrice, refreshCartBadge, TAX_RATE } from './cartStore.js';

const itemsContainer = document.getElementById('cart-items');
const summaryContainer = document.getElementById('cart-summary');
const pageMessage = document.getElementById('cart-message');

let coversById = {}; // book_id -> { image_url, author }
let messageTimer = null;

function el(tag, className, text) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text !== undefined) node.textContent = text;
	return node;
}

function showMessage(text) {
	pageMessage.textContent = text;
	clearTimeout(messageTimer);
	if (text) messageTimer = setTimeout(() => (pageMessage.textContent = ''), 3000);
}

// Run cart change, then re-renders.
async function change(action) {
	try {
		await action();
	} catch (err) {
		showMessage(err.message);
	}
	await renderCart();
	refreshCartBadge();
}

function buildCartItem(item) {
	const extra = coversById[item.book_id] || {};
	const row = el('article', 'cart-item');

	const imageLink = document.createElement('a');
	imageLink.href = '/book?id=' + item.book_id;
	if (extra.image_url) {
		const image = document.createElement('img');
		image.src = extra.image_url;
		image.alt = item.title + ' cover';
		image.onerror = () => image.removeAttribute('src');
		imageLink.appendChild(image);
	}
	row.appendChild(imageLink);

	const info = el('div', 'cart-item-info');
	info.appendChild(el('h3', '', item.title));
	if (extra.author) info.appendChild(el('p', 'cart-item-author', 'By ' + extra.author));
	info.appendChild(el('p', 'cart-item-price', formatPrice(item.effective_price) + ' each'));

	const removeBtn = el('button', 'cart-remove', 'Remove');
	removeBtn.type = 'button';
	removeBtn.addEventListener('click', () => change(() => removeItem(item.book_id)));
	info.appendChild(removeBtn);
	row.appendChild(info);

	const qty = el('div', 'cart-qty');
	const minus = el('button', 'qty-btn', '−');
	minus.type = 'button';
	minus.setAttribute('aria-label', 'Decrease quantity of ' + item.title);
	minus.addEventListener('click', () =>
		change(() =>
			item.quantity > 1 ? setQuantity(item.book_id, item.quantity - 1) : removeItem(item.book_id)
		)
	);

	const count = el('span', 'qty-count', String(item.quantity));

	const plus = el('button', 'qty-btn', '+');
	plus.type = 'button';
	plus.setAttribute('aria-label', 'Increase quantity of ' + item.title);
	plus.disabled = item.quantity >= item.available_quantity;
	plus.addEventListener('click', () => change(() => setQuantity(item.book_id, item.quantity + 1)));

	qty.append(minus, count, plus);
	row.appendChild(qty);
	row.appendChild(el('p', 'cart-line-total', formatPrice(item.effective_price * item.quantity)));
	return row;
}

function summaryRow(label, value, className) {
	const row = el('div', 'summary-row' + (className ? ' ' + className : ''));
	row.appendChild(el('span', '', label));
	row.appendChild(el('span', '', value));
	return row;
}

function buildSummary(subtotal) {
	const round = (n) => Math.round(n * 100) / 100;
	const tax = round(subtotal * TAX_RATE);
	const box = el('div', 'summary-box');
	box.appendChild(el('h2', '', 'Order Summary'));
	box.appendChild(summaryRow('Subtotal', formatPrice(subtotal)));
	box.appendChild(summaryRow('Estimated tax (' + (TAX_RATE * 100).toFixed(2) + '%)', formatPrice(tax)));
	box.appendChild(summaryRow('Total', formatPrice(round(subtotal + tax)), 'summary-total'));

	const checkout = el('button', 'checkout-btn', 'Proceed to Checkout');
	checkout.type = 'button';
	checkout.addEventListener('click', () => showMessage('Checkout is coming soon.'));
	box.appendChild(checkout);
	return box;
}

function showPrompt(title, text, linkText, href) {
	itemsContainer.innerHTML = '';
	summaryContainer.innerHTML = '';
	summaryContainer.hidden = true;
	const box = el('div', 'cart-empty');
	box.appendChild(el('h2', '', title));
	box.appendChild(el('p', '', text));
	const link = el('a', 'continue-link', linkText);
	link.href = href;
	box.appendChild(link);
	itemsContainer.appendChild(box);
}

async function renderCart() {
	let cart;
	try {
		cart = await getCart();
	} catch (err) {
		if (err.status === 401) {
			showPrompt('Please log in', 'Log in to view and edit your cart.', 'Log In', '/login');
		} else {
			showPrompt('Could not load your cart', 'Please try again later.', 'Back to books', '/#catalog');
		}
		return;
	}

	if (cart.items.length === 0) {
		showPrompt('Your cart is empty', 'Browse our catalog and add a book to get started.', 'Browse Books', '/#catalog');
		return;
	}

	itemsContainer.innerHTML = '';
	summaryContainer.innerHTML = '';
	summaryContainer.hidden = false;
	cart.items.forEach((item) => itemsContainer.appendChild(buildCartItem(item)));

	const back = el('a', 'continue-link', '← Continue Shopping');
	back.href = '/#catalog';
	itemsContainer.appendChild(back);
	summaryContainer.appendChild(buildSummary(cart.subtotal));
}

async function start() {
	// Cover images and authors aren't part of the cart API, so look them up from the catalog.
	try {
		const books = await fetchBooks();
		coversById = Object.fromEntries(books.map((b) => [b.id, { image_url: b.image_url, author: b.author }]));
	} catch {
		// The cart still works without covers.
	}
	await renderCart();
}

start();