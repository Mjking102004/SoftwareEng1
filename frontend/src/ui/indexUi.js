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

renderList();*/
import { addToCart, getCartItemQuantity } from './cartStore.js';

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

const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-books');
const bookList = document.getElementById('book-list');

function renderBooks(bookArray){
  bookList.innerHTML = '';
  if(bookArray.length == 0){
    bookList.textContent = 'No Books Found';
    return;
  }
  bookArray.forEach((book) => {
    const card = document.createElement('div');
    card.classList.add("book-card");
    const image = document.createElement('img');
    image.src = book.image_url;
    image.alt = book.title + ' cover';
    image.onerror = () => {
      image.alt = 'Book cover unavailable';
      image.removeAttribute('src');
    };
    const title = document.createElement('h3');
    title.textContent = book.title;
    const author = document.createElement('p')
    author.textContent = 'By ' + book.author;
    const description = document.createElement('p');
    description.textContent = book.description;
    const price = document.createElement('p');
    price.classList.add('book-price');
    if (book.sales_price != null){
      const original = document.createElement('span');
      original.classList.add('original-price');
      original.textContent = '$' + book.price.toFixed(2);
      price.appendChild(original);
      price.appendChild(document.createTextNode('$' + book.sales_price.toFixed(2)));
    }else{
      price.textContent = '$' + book.price.toFixed(2);
    }
    const quantity = document.createElement('p');
    quantity.textContent = 'Available: ' + book.quantity;
    const button = document.createElement('button');
    button.classList.add('add-to-cart');

    // Disable the button when out of stock or when the cart already holds all copies.
    function refreshButton(){
      const inCart = getCartItemQuantity(book.id);
      if (book.quantity <= 0){
        button.textContent = 'Out of Stock';
        button.disabled = true;
      }else if (inCart >= book.quantity){
        button.textContent = 'Max in Cart';
        button.disabled = true;
      }else{
        button.textContent = inCart > 0 ? 'Add Another (' + inCart + ' in cart)' : 'Add to Cart';
        button.disabled = false;
      }
    }
    refreshButton();

    button.addEventListener('click', ()=>{
      const result = addToCart(book);
      if (!result.ok){
        button.textContent = result.message;
        setTimeout(refreshButton, 1500);
        return;
      }
      button.textContent = 'Added!';
      button.classList.add('added');
      setTimeout(() => {
        button.classList.remove('added');
        refreshButton();
      }, 1000);
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
  const searchText = searchInput.value.toLowerCase();
  const filterBooks = books.filter((book) =>{
    return(
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText) ||
      book.description.toLowerCase().includes(searchText)
    );
  });
  sortBooks(filterBooks);
}

function sortBooks(bookArray){
  const sortValue = sortSelect.value;

  if(sortValue == 'price-low'){
    bookArray.sort((a,b) => (a.sales_price ?? a.price) - (b.sales_price ?? b.price));
  }else if (sortValue == 'price-high'){
    bookArray.sort((a,b) => (b.sales_price ?? b.price) - (a.sales_price ?? a.price));
  }else if(sortValue == 'availability'){
    bookArray.sort((a, b) => b.quantity - a.quantity);
  }
  renderBooks(bookArray);
}
searchInput.addEventListener('input', searchBooks);
sortSelect.addEventListener('change', searchBooks);


renderBooks(books)