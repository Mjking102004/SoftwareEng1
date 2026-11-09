import {fetchBooks} from '../server/adminServer.js';

const booksContainer = document.getElementById('admin-books');

//build a table froma list of rows and the columns to show
function createTable(rows, columns){
    const table = document.createElement('table');
    table.className = "admin-table";

    const headerRow = table.createTHead().insertRow();
    columns.forEach((column) => {
        const th = document.createElement('th');
        th.textContent = column.label;
        headerRow.appendChild(th);
    });

    const body = table.createTBody();
    rows.forEach((row) => {
        const tr = body.insertRow();
        columns.forEach((column) => {
            tr.insertCell().textContent = row[column.key] ?? '';
        });
    });

    return table;
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
    ]));
}

renderBooks();