import { fetchBooks } from '../server/bookServer.js';
import { addToCart, formatPrice } from './cartStore.js';

const sortSelect = document.getElementById('sort-books');
const bookList = document.getElementById('book-list');
const statusLine = document.getElementById('catalog-status');

// The search text comes from the shared navbar
const searchText = (new URLSearchParams(window.location.search).get('q') || '').trim();

let allBooks = [];

function stockText(book) {
  if (book.quantity <= 0) return 'Out of stock';
  if (book.quantity <= 5) return 'Only ' + book.quantity + ' left';
  return 'In stock (' + book.quantity + ' available)';
}

function buildPrice(book) {
  const price = document.createElement('p');
  price.classList.add('book-price');
  if (book.sales_price !== null) {
    const original = document.createElement('span');
    original.classList.add('original-price');
    original.textContent = formatPrice(book.price);
    price.appendChild(original);
    price.appendChild(document.createTextNode(formatPrice(book.sales_price)));
  } else {
    price.textContent = formatPrice(book.price);
  }
  return price;
}

function buildCard(book) {
  const card = document.createElement('div');
  card.classList.add('book-card');
  const detailsUrl = '/book?id=' + book.id;

  const imageLink = document.createElement('a');
  imageLink.href = detailsUrl;
  if (book.image_url) {
    const image = document.createElement('img');
    image.src = book.image_url;
    image.alt = book.title + ' cover';
    image.onerror = () => image.removeAttribute('src');
    imageLink.appendChild(image);
  } else {
    const placeholder = document.createElement('div');
    placeholder.classList.add('cover-placeholder');
    placeholder.textContent = 'No cover available';
    imageLink.appendChild(placeholder);
  }

  const title = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = detailsUrl;
  titleLink.textContent = book.title;
  title.appendChild(titleLink);

  const author = document.createElement('p');
  author.textContent = 'By ' + book.author;

  const description = document.createElement('p');
  description.classList.add('book-description');
  description.textContent = book.description;

  const quantity = document.createElement('p');
  quantity.classList.add('book-stock');
  quantity.textContent = stockText(book);

  const button = document.createElement('button');
  button.classList.add('add-to-cart');
  button.type = 'button';
  button.textContent = book.quantity > 0 ? 'Add to Cart' : 'Out of Stock';
  button.disabled = book.quantity <= 0;

  button.addEventListener('click', async () => {
    button.disabled = true;
    const result = await addToCart(book.id, 1);
    if (result.ok) {
      button.textContent = 'Added!';
      button.classList.add('added');
    } else if (result.status === 401) {
      button.textContent = 'Log in to add books';
      setTimeout(() => { window.location.href = '/login'; }, 1200);
      return;
    } else {
      button.textContent = result.message;
    }
    setTimeout(() => {
      button.classList.remove('added');
      button.textContent = 'Add to Cart';
      button.disabled = false;
    }, 1200);
  });

  card.append(imageLink, title, author, description, buildPrice(book), quantity, button);
  return card;
}

function renderBooks(bookArray) {
  bookList.innerHTML = '';
  if (bookArray.length === 0) {
    bookList.textContent = 'No Books Found';
    return;
  }
  bookArray.forEach((book) => bookList.appendChild(buildCard(book)));
}

function showBooks() {
  const needle = searchText.toLowerCase();
  const results = allBooks.filter((book) =>
    book.title.toLowerCase().includes(needle) ||
    book.author.toLowerCase().includes(needle) ||
    book.description.toLowerCase().includes(needle)
  );

  const sortValue = sortSelect.value;
  if (sortValue === 'price-low') {
    results.sort((a, b) => a.effective_price - b.effective_price);
  } else if (sortValue === 'price-high') {
    results.sort((a, b) => b.effective_price - a.effective_price);
  } else if (sortValue === 'availability') {
    results.sort((a, b) => b.quantity - a.quantity);
  }

  if (statusLine) {
    statusLine.textContent = searchText
      ? results.length + ' result(s) for "' + searchText + '"'
      : '';
  }
  renderBooks(results);
}

async function loadCatalog() {
  bookList.textContent = 'Loading books...';
  try {
    allBooks = await fetchBooks();
  } catch (err) {
    bookList.textContent = 'Could not load books. Please try again later.';
    return;
  }
  showBooks();
}

sortSelect.addEventListener('change', showBooks);
loadCatalog();