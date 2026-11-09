/*import { fetchItems, createItem } from '../server/indexServer.js';

const input = document.getElementById('item-input');
const button = document.getElementById('submit-btn');
const list = document.getElementById('item-list');

async function renderList() {
  const items = await fetchItems();
  list.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.id}: ${item.temp_text}`;
    list.appendChild(li);
  });
}

button.addEventListener('click', async () => {
  if (!input.value.trim()) return;
  await createItem(input.value.trim());
  input.value = '';
  await renderList();
});

renderList();-> */
const books =[{
  id:1, title:"The Great Gatsby", author: "F. Scott Fitzgerald", 
  description: "A classic novel about wealth, love, and the American dream.",
  price: 14.99, sales_price: 11.99, quantity: 8, image_url: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg"
},{
  id:2, title:"1984", author: "George Orwell",
  description: "A dystopian novel about government surveillance and control.",
  price: 12.99, sales_price: 9.99, quantity: 3, image_url: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg"
},{
  id:3, title:"The Hobit", author: "J.R.R. Tolkien",
  description: "An adventure through middle earth",
  price: 20.99, sales_price: 14.99, quantity: 8, image_url: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg"
}];

const searchInput = document.getElementById('search-inpu');
const sortSelect = document.getElementById('sort-books');
const bookList = document.getElementById('cart-count');

let cartItems = 0;

function renderBooks(bookArray){
  bookList.innerHTML = '';
  if(bookArray.length ==0){
    bookList.textContent = 'No Books Found';
    return;
  }
  bookArray.forEach((book) => {
    const card = document.createElement('div');
    card.classList.add("book-card");
    const image = document.createElement('img');
    image.src = book.image_url;
    image.alt = book.title + 'cover';
    image.onerror = () => {
      image.alt = 'Book cover unavailable';
      image.removeAttribute('src');
    };
    const title = document.createElement('h3');
    title.textContent = book.title;
    const author = document.createElement('p')
    author.textContent = 'By' + book.author;
    const description = document.createElement('p');
    description.textContent = book.description;
    const price = document.createElement('p');
    price.classList.add('book-price');
    if (book.sales_price !== null){
      price.textContent ='$'+book.price.toFixed(2);
    }else{
      price.textContent = '$' + book.price.toFixed(2);
    }
    const quantity = document.createElement('p');
    quantity.textContent = 'Available: ' + book.quantity;
    const button = document.createElement('button');
    button.classList.add('add-to-cart');
    button.textContent = book.quantity > 0 ? 'Add to Cart': 'Out of Stock';
    button.disabled = book.quantity <= 0;

    button.addEventListener('clivk', ()=>{
      cartItems++;
      cartCount.textContent = cartItems;
      button.textContent = 'Added!';
    });
    card.appendChild(image)
    card.appendChild(title)
    card.appendChild(author)
    card.appendChild(description)
    card.appendChild(price)
    card.appendChild(quantity);
    card.appendChild(button)
    bookList.appendChild(card);
  });
}
function searchBooks(){
  const filterBooks = books.filter((books) =>{
    return(
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText) ||
      book.description.toLowerCase().includes(searchText)
    );
  });
  sortBooks(filterBooks);
}

function sortBooks(bookArray){
  const sortValue = sortSelect.nodeValue;

  if(sortValue == 'price-low'){
    bookArray.sort((a,b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
  }else if (sortValue == 'price-high'){
    bookArray.sort((a,b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
  }else if(sortValue == 'availability'){
    bookArray.sort((a, b) => b.quantity - a.quantity);
  }
  renderBooks(bookArray);
}
searchInput.addEventListener('input', searchBooks);
searchInput.addEventListener('change', searchBooks);

renderBooks(books)