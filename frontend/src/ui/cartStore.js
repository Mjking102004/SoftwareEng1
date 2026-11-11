// cartStore.js
// Shared cart helpers used by the homepage, the book details page, the cart page
import { getCart, addItem, CartError } from '../server/cartServer.js';

export const TAX_RATE = 0.0825; // 8.25% sales tax

export function formatPrice(amount) {
	return '$' + Number(amount).toFixed(2);
}

// Shows number of items next to "Cart"
export async function refreshCartBadge() {
	const badge = document.getElementById('cart-count');
	if (!badge) return;
	try {
		const cart = await getCart();
		badge.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
	} catch {
		badge.textContent = '0';
	}
}

// Always resolves to { ok, status, message } so the pages can show feedback.
export async function addToCart(bookId, quantity = 1) {
	try {
		await addItem(bookId, quantity);
		refreshCartBadge();
		return { ok: true, status: 201, message: 'Added to cart.' };
	} catch (err) {
		if (err instanceof CartError) {
			if (err.status === 401) {
				return { ok: false, status: 401, message: 'Please log in to add books to your cart.' };
			}
			if (err.status === 409) {
				return { ok: false, status: 409, message: 'No more copies available.' };
			}
			return { ok: false, status: err.status, message: err.message };
		}
		return { ok: false, status: 0, message: 'Could not reach the server.' };
	}
}