import { fetchBook } from '../server/bookServer.js';
import { addToCart, formatPrice } from './cartStore.js';

const container = document.getElementById('book-detail');
const bookId = new URLSearchParams(window.location.search).get('id');

function el(tag, className, text) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text !== undefined) node.textContent = text;
	return node;
}

function showMessage(text) {
	container.innerHTML = '';
	const box = el('div', 'cart-empty');
	box.appendChild(el('h2', '', text));
	const link = el('a', 'continue-link', '← Back to all books');
	link.href = '/#catalog';
	box.appendChild(link);
	container.appendChild(box);
}

function buildPrice(book) {
	const price = el('p', 'book-price');
	if (book.sales_price !== null) {
		price.appendChild(el('span', 'original-price', formatPrice(book.price)));
		price.appendChild(document.createTextNode(formatPrice(book.sales_price)));
	} else {
		price.textContent = formatPrice(book.price);
	}
	return price;
}

function stockText(book) {
	if (book.quantity <= 0) return 'Out of stock';
	if (book.quantity <= 5) return 'Only ' + book.quantity + ' left in stock';
	return 'In stock (' + book.quantity + ' available)';
}

function renderBook(book) {
	document.title = book.title + " | Rowdy's Bookstore";
	container.innerHTML = '';

	const cover = el('div', 'book-detail-cover');
	if (book.image_url) {
		const image = document.createElement('img');
		image.src = book.image_url;
		image.alt = book.title + ' cover';
		image.onerror = () => image.removeAttribute('src');
		cover.appendChild(image);
	} else {
		cover.appendChild(el('div', 'cover-placeholder', 'No cover available'));
	}

	const info = el('div', 'book-detail-info');
	info.appendChild(el('h1', '', book.title));
	info.appendChild(el('p', 'book-detail-author', 'By ' + book.author));
	if (book.category) info.appendChild(el('p', 'book-detail-category', 'Category: ' + book.category));
	info.appendChild(buildPrice(book));
	info.appendChild(el('p', 'book-stock', stockText(book)));
	info.appendChild(el('p', 'book-detail-description', book.description || 'No description available.'));

	const message = el('p', 'detail-message');
	message.setAttribute('role', 'status');
	message.setAttribute('aria-live', 'polite');

	const actions = el('div', 'book-detail-actions');
	const qtyLabel = el('label', '', 'Quantity ');
	const qtyInput = document.createElement('input');
	qtyInput.type = 'number';
	qtyInput.min = '1';
	qtyInput.max = String(Math.max(book.quantity, 1));
	qtyInput.value = '1';
	qtyInput.disabled = book.quantity <= 0;
	qtyLabel.appendChild(qtyInput);

	const button = el('button', 'add-to-cart', book.quantity > 0 ? 'Add to Cart' : 'Out of Stock');
	button.type = 'button';
	button.disabled = book.quantity <= 0;

	button.addEventListener('click', async () => {
		const quantity = Math.floor(Number(qtyInput.value));
		if (!Number.isInteger(quantity) || quantity < 1 || quantity > book.quantity) {
			message.textContent = 'Enter a quantity between 1 and ' + book.quantity + '.';
			return;
		}
		button.disabled = true;
		const result = await addToCart(book.id, quantity);
		if (result.ok) {
			message.textContent = 'Added ' + quantity + ' to your cart.';
		} else if (result.status === 401) {
			message.textContent = 'Please log in to add books to your cart. Redirecting...';
			setTimeout(() => { window.location.href = '/login'; }, 1200);
			return;
		} else {
			message.textContent = result.message;
		}
		button.disabled = false;
	});

	actions.append(qtyLabel, button);
	info.append(actions, message);

	const back = el('a', 'continue-link', '← Back to all books');
	back.href = '/#catalog';
	info.appendChild(back);

	container.append(cover, info);
}

async function loadBook() {
	if (!bookId || !/^\d+$/.test(bookId)) {
		showMessage('Book not found');
		return;
	}
	container.textContent = 'Loading...';
	try {
		const book = await fetchBook(bookId);
		if (!book) showMessage('Book not found');
		else renderBook(book);
	} catch {
		showMessage('Could not load this book. Please try again later.');
	}
}

loadBook();