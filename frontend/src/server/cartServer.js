// cart talks to the cart API (/api/cart). The cart belongs to the logged-in user,
export class CartError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

async function request(path, options = {}) {
	const response = await fetch('/api/cart' + path, {
		method: options.method || 'GET',
		headers: { 'Content-Type': 'application/json' },
		body: options.body ? JSON.stringify(options.body) : undefined,
	});
	let data = {};
	try {
		data = await response.json();
	} catch {
		//
	}
	if (!response.ok) throw new CartError(response.status, data.error || 'Cart request failed.');
	return normalizeCart(data);
}

// convert strings to numbers
function normalizeCart(data) {
	const items = (data.items || []).map((item) => ({
		book_id: item.book_id,
		title: item.title,
		quantity: item.quantity,
		available_quantity: item.available_quantity,
		price: Number(item.price),
		sale_price: item.sale_price == null ? null : Number(item.sale_price),
		effective_price: Number(item.effective_price),
	}));
	return { items, subtotal: Number(data.subtotal) || 0 };
}

export const getCart = () => request('');
export const addItem = (bookId, quantity = 1) =>
	request('/items', { method: 'POST', body: { book_id: bookId, quantity } });
export const setQuantity = (bookId, quantity) =>
	request('/items/' + bookId, { method: 'PATCH', body: { quantity } });
export const removeItem = (bookId) =>
	request('/items/' + bookId, { method: 'DELETE' });