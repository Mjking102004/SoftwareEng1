// bookServer.js
// so convert everything the UI does math or formatting on into numbers.
function normalizeBook(raw) {
	const price = Number(raw.price);
	const salePrice = raw.sale_price == null ? null : Number(raw.sale_price);
	return {
		id: raw.book_id,
		title: raw.title,
		author: raw.author,
		description: raw.description || '',
		category: raw.category || '',
		image_url: raw.image_url || '',
		quantity: Number(raw.quantity) || 0,
		price,
		sales_price: salePrice,
		effective_price: salePrice ?? price,// actual price paid
	};
}

async function readJson(response) {
	try {
		return await response.json();
	} catch {
		return {};
	}
}

export async function fetchBooks() {
	const response = await fetch('/api/books');
	const data = await readJson(response);
	if (!response.ok) throw new Error(data.error || 'Could not load books.');
	return data.books.map(normalizeBook);
}

export async function fetchBook(id) {
	const response = await fetch('/api/books/' + encodeURIComponent(id));
	const data = await readJson(response);
	if (response.status === 404) return null;
	if (!response.ok) throw new Error(data.error || 'Could not load this book.');
	return normalizeBook(data.book);
}