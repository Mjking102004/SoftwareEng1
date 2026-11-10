import {fetchBooks, createBook, updateBook, deleteBook, fetchCategories} from '../server/adminServer.js';

const booksContainer = document.getElementById('admin-books');
const addBookForm = document.getElementById('add-book-form');
const bookMessage = document.getElementById('book-message');
const categorySelect = document.getElementById('book-category');
const bookSubmit = document.getElementById('book-submit');
const bookCancel = document.getElementById('book-cancel');
let editingBookId = null;

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

//create the edit and delete buttons for a book row
function createBookActions(book){
    const actions = document.createElement("div");
    actions.className = "admin-actions";

    const editButton = document.createElement('button');
    editButton.className = "admin-edit";
    editButton.textContent = "Edit";
    editButton.addEventListener('click',() => startEditingBook(book));

    const button = document.createElement('button');
    button.className = 'admin-delete';
    button.textContent = 'Delete';

    button.addEventListener('click', async (event) => {
        if(!confirm(`Delete "${book.title}"?`)) return;

        const result = await deleteBook(book.book_id);
        bookMessage.textContent = result.error || `Deleted "${book.title}".`;
        renderBooks();
    });

    actions.append(editButton, button);
    return actions;
}

//fill the form with a book's details to edit it
function startEditingBook(book){
    editingBookId = book.book_id;

    document.getElementById('book-title').value = book.title;
    document.getElementById('book-author').value = book.author;
    document.getElementById('book-price').value = book.price;
    document.getElementById('book-quantity').value = book.quantity;
    document.getElementById('book-category').value = book.category_id ?? "";
    document.getElementById('book-image').value = book.image_url ?? "";
    document.getElementById('book-description').value = book.description ?? "";

    bookSubmit.textContent = "Save Changes";
    bookCancel.hidden = false;
    bookMessage.textContent = `Editing "${book.title}"`;
    addBookForm.closest(".admin-card").scrollIntoView({behavior: 'smooth'});
}

//go back to adding new books
function stopEditingBook(){
    editingBookId = null;
    addBookForm.reset();
    bookSubmit.textContent = "Add Book";
    bookCancel.hidden = true;
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
    const result = editingBookId
        ? await updateBook(editingBookId, book)
        : await createBook(book);

    if (result.error) {
        bookMessage.textContent = result.error;
        return;
    }

    bookMessage.textContent = `${editingBookId ? 'Updated' : 'Added'} "${result.title}".`;
    stopEditingBook();
    renderBooks();
});

//cancel editing
bookCancel.addEventListener('click', (event) => {
    stopEditingBook();
    bookMessage.textContent = '';
});