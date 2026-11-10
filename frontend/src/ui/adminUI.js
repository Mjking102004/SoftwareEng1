import {fetchBooks, createBook, deleteBook, fetchCategories} from '../server/adminServer.js';

const booksContainer = document.getElementById('admin-books');
const addBookForm = document.getElementById('add-book-form');
const bookMessage = document.getElementById('book-message');
const categorySelect = document.getElementById('book-category');

//build a table froma list of rows and the columns to show
function createTable(rows, columns, actions){
    const table = document.createElement('table');
    table.className = "admin-table";

    const headerRow = table.createTHead().insertRow();
    columns.forEach((column) => {
        const th = document.createElement('th');
        th.textContent = column.label;
        headerRow.appendChild(th);
    });

    if(actions){
        headerRow.appendChild(document.createElement('th'));
    }

    const body = table.createTBody();
    rows.forEach((row) => {
        const tr = body.insertRow();
        columns.forEach((column) => {
            tr.insertCell().textContent = row[column.key] ?? '';
        });

        if(actions){
            tr.insertCell().appendChild(actions(row));
        }

    });

    return table;
}

//create the delete button for a book row
function createBookActions(book){
    const button = document.createElement('button');
    button.className = 'admin-delete';
    button.textContent = 'Delete';

    button.addEventListener('click', async (event) => {
        if(!confirm(`Delete "${book.title}"?`)) return;

        const result = await deleteBook(book.book_id);
        bookMessage.textContent = result.error || `Deleted "${book.title}".`;
        renderBooks();
    });

    return button;
}

//show all books in the books card
async function renderBooks(){
    const books = await fetchBooks();

    if (books.length === 0){
        booksContainer.textContent = 'No books found.';
        return;
    }

    booksContainer.replaceChildren(createTable(books, [
        {label: "ID", key: "book_id"},
        {label: "Title", key: "title"},
        {label: "Author", key: "author"},
        {label: "Category", key: "category"},
        {label: "Price", key: "price"},
        {label: "Quantity", key: "quantity"}
    ], createBookActions));
}

//fill the category dropdown
async function renderCategories(){
    const categories = await fetchCategories();

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.category_id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

renderBooks();
renderCategories();

//add a book when the form is submitted
addBookForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const book = Object.fromEntries(new FormData(addBookForm));
    const result = await createBook(book);

    if (result.error) {
        bookMessage.textContent = result.error;
        return;
    }

    bookMessage.textContent = `Added "${result.title}".`;
    addBookForm.reset();
    renderBooks();
});