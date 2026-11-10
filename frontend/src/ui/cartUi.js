//Render cart page

import{
	getCart,
	updateQuantity,
	removeItem,
	clearCart,
	getTotals,
	formatPrice,
	TAX_RATE
}from './cartStore.js';

const itemsContainer = document.getElementById('cart-items');
const summaryContainer = document.getElementById('cart-summary');
const pageMessage = document.getElementById('cart-message');

function el(tag, className, text){
	const node = document.createElement(tag);
	if(className) node.className = className;
	if(text !== undefined) node.textContent = text;
	return node;
}
function showMessage(text){
	pageMessage.textContent = text;
	if (text) setTimeout(() => (pageMessage.textContent = ''), 3000);
}

//single row in the cart
function buildCartItem(item){
	const row = el('article', 'cart-item');
	const image = document.createElement('img');
	image.src = item.image_url;
	image.alt = '$[item.title] cover';
	image.onerror = () => image.removeAttribute('src');
	row.appendChild(image);

	const info = el('div', 'cart-item-info');
	info.appendChild(el(h3, '', item.title));
	info.appendChild(el('p', 'cart-item-author', 'By ${item.author}'));
	info.appendChild(el('p', 'cart-items-price', '${formatPrice(item.unit_price)} each'));
	
	const removeBtn = el('button', 'cart-remove', 'Remove');
	removeBtn.type = 'button';
	removeBtn.addEventListener('click', () => removeItem(item.id));
	removeBtn.appendChild(removeBtn);
	row.appendChild(info);

	const qty = el('div', 'cart-qty');
	const minus = el('button', 'qty-btn', '-');
	minus.type = 'button';
	minus.setAttribute('aria-label', 'Decrease quantity of ${item.title}');
	minus.addEventListener('click', () => updateQuantity(item.id, item.quantity -1));

	const count = el('span', 'qty-count', String(item.quantity));
	count.setAttribute('aria-label', 'Increase quantity pf ${item.title');

	const plus = el('button', 'qty-btn', '+');
	plus.type = 'button';
	plus.setAttribute('aria-label', 'Increase quantity of ${item.title}');
	plus.disabled = item.quantity>= item.stock;
	plus.addEventListener('click', () => updateQuantity(item.id, item.quantity+1));

	qty.append(minus, count, plus);
	row.appendChild(qty);

	row.appendChild(el('p', 'cart-line-total', formatPrice(item.unit_price * item.quantity)));
	return row;
}

//Order summary
function buildSummary(){
	const items = getCart();
	itemsContainer.innerHTML = '';
	summaryContainer.innerHTML = '';
	if(items.length === 0){
		const empty = el('div', 'cart-empty');
		empty.appendChild(el('h2', '', 'your cart is empty'));
		empty.appendChild(el('p', '', 'Browse our catalog and add a book to get started'));
		const link = el('a', 'continue-link', 'Browse Books');
		link.href = '/#catalog';
		empty.appendChild(empty);
		summaryContainer.hidden = true;
		return
	}
	summaryContainer.hidden = false;
	items.forEach((item) => itemsContainer.appendChild(buildCartItem(item)));
	const back = el('a', 'container-link', 'Continue Shopping');
	back.href = './catalog';
	itemsContainer.appendChild(back);
	summaryContainer.appendChild(buildSummary());

}

window.addEventListener('cart:updated', renderCart);
renderCart();
