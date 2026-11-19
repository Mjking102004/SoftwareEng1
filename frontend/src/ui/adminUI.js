import {fetchBooks, createBook, updateBook, deleteBook, fetchCategories, fetchDiscounts,
        createDiscount, setDiscountActive, fetchSales, createSale, setSaleActive, fetchUsers,
        setUserRole} from '../server/adminServer.js';

const booksContainer = document.getElementById('admin-books');
const addBookForm = document.getElementById('add-book-form');
const bookMessage = document.getElementById('book-message');
const categorySelect = document.getElementById('book-category');
const bookSubmit = document.getElementById('book-submit');
const bookCancel = document.getElementById('book-cancel');
let editingBookId = null;
const discountsContainer = document.getElementById('admin-discounts');
const addDiscountForm = document.getElementById('add-discount-form');
const discountMessage = document.getElementById('discount-message');
const salesContainer = document.getElementById('admin-sales');
const addSaleForm = document.getElementById('add-sale-form');
const saleMessage = document.getElementById('sale-message');
const saleBookSelect = document.getElementById('sale-book');
const usersContainer = document.getElementById('admin-users');
const userMessage = document.getElementById('user-message');

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

    const editButton = document.createElement("button");
    editButton.className = "admin-edit";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => startEditingBook(book));

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

    document.getElementById("book-title").value = book.title;
    document.getElementById("book-author").value = book.author;
    document.getElementById("book-price").value = book.price;
    document.getElementById("book-quantity").value = book.quantity;
    document.getElementById("book-category").value = book.category_id ?? "";
    document.getElementById("book-image").value = book.image_url ?? "";
    document.getElementById("book-description").value = book.description ?? "";

    bookSubmit.textContent = "Save Changes";
    bookCancel.hidden = false;
    bookMessage.textContent = `Editing "${book.title}".`;
    addBookForm.closest('.admin-card').scrollIntoView({behavior: 'smooth'});
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

    bookMessage.textContent = `${editingBookId ? "Updated" : "Added"} "${result.title}".`;
    stopEditingBook();
    renderBooks();
});

//cancel editing
bookCancel.addEventListener('click', () => {
    stopEditingBook();
    bookMessage.textContent = '';
});


//create the on/off button for a discount row
function createDiscountActions(discount){
    const button = document.createElement('button');
    button.className = 'admin-edit';
    button.textContent = discount.active ? 'Deactivate' : 'Activate';

    button.addEventListener('click', async () => {
        const result = await setDiscountActive(discount.discount_id, !discount.active);
        discountMessage.textContent = result.error ||
            `${result.code} is now ${result.active ? 'active' : 'inactive'}.`;
        renderDiscounts();
    });

    return button;
}

//show all discount codes in the discount codes card
async function renderDiscounts(){
    const data = await fetchDiscounts();
    const discounts = data.discounts || [];

    if (discounts.length === 0){
        discountsContainer.textContent = 'No discount codes yet.';
        return;
    }

    const rows = discounts.map((discount) => ({
        ...discount,
        percent: `${discount.discount_percent}%`,
        status: discount.active ? 'Active' : 'Inactive'
    }));

    discountsContainer.replaceChildren(createTable(rows, [
        {label: "ID", key: "discount_id"},
        {label: "Code", key: "code"},
        {label: "Percent Off", key: "percent"},
        {label: "Status", key: "status"}
    ], createDiscountActions));
}

//add a discount code when the form is submitted
addDiscountForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const discount = Object.fromEntries(new FormData(addDiscountForm));
    const result = await createDiscount(discount);

    if (result.error){
        discountMessage.textContent = result.error;
        return;
    }

    discountMessage.textContent = `Added ${result.code} (${result.discount_percent}% off).`;
    addDiscountForm.reset();
    renderDiscounts();
});
renderDiscounts();


//create the on/off button for a sale row
function createSaleActions(sale){
    const button = document.createElement('button');
    button.className = 'admin-edit';
    button.textContent = sale.active ? 'End Sale' : 'Restart Sale';

    button.addEventListener('click', async () => {
        const result = await setSaleActive(sale.sale_id, !sale.active);
        saleMessage.textContent = result.error ||
            `Sale on "${sale.title}" is now ${result.active ? 'active' : 'ended'}.`;
        renderSales();
    });

    return button;
}

//show all sales, with each book's title and reg price
async function renderSales(){
    const [salesData, books] = await Promise.all([fetchSales(), fetchBooks()]);
    const sales = salesData.sales || [];

    //fill the book dropdown
    saleBookSelect.replaceChildren();
    books.forEach((book) => {
        const option = document.createElement('option');
        option.value = book.book_id;
        option.textContent = `${book.title} ($${book.price})`;
        saleBookSelect.appendChild(option);
    });

    if (sales.length === 0){
        salesContainer.textContent = 'No sales yet.';
        return;
    }

    const rows = sales.map((sale) => {
        const book = books.find((b) => b.book_id === sale.book_id);
        return {
            ...sale,
            title: book ? book.title : `Book #${sale.book_id}`,
            regular: book ? `$${book.price}` : '',
            price: `$${sale.sale_price}`,
            status: sale.active ? 'Active' : 'Ended'
        };
    });

    salesContainer.replaceChildren(createTable(rows, [
        {label: "ID", key: "sale_id"},
        {label: "Book", key: "title"},
        {label: "Regular Price", key: "regular"},
        {label: "Sale Price", key: "price"},
        {label: "Status", key: "status"}
    ], createSaleActions));
}

//add a sale when the form is submitted
addSaleForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const sale = Object.fromEntries(new FormData(addSaleForm));
    const result = await createSale(sale);

    if (result.error){
        saleMessage.textContent = result.error;
        return;
    }

    saleMessage.textContent = `Added a sale at $${result.sale_price}.`;
    addSaleForm.reset();
    renderSales();
});

//ceate the role button for a user row
function createUserActions(user){
    const button = document.createElement("button");
    button.className = 'admin-edit';
    const newRole = user.role === "admin" ? 'customer' : 'admin';
    button.textContent = newRole === "admin" ? "Make Admin" : "Make Customer";

    button.addEventListener('click', async () => {
        if(!confirm(`Change ${user.email} to ${newRole}?`)) return;
        const result = await setUserRole(user.user_id, newRole);
        userMessage.textContent = result.error || `${result.user.email} is now ${result.user.role === "admin" ? 'an Admin' : 'a customer'}.`;
        renderUsers();
    });

    return button;
}

//show all users in the users card
async function renderUsers(){
    const data = await fetchUsers();
    const users = data.users || [];

    if(users.length === 0){
        usersContainer.textContent = 'No users yet.';
        return;
    }

    const rows = users.map((user) => ({
        ...user,
        name: `${user.first_name} ${user.last_name}`,
        joined: new Date(user.created_at).toLocaleDateString()
    }));

    usersContainer.replaceChildren(createTable(rows, [
        {label: "ID", key: "user_id"},
        {label: "Name", key: "name"},
        {label: "Email", key: "email"},
        {label: "Role", key: "role"},
        {label: "Joined", key: "joined"},
    ], createUserActions));
}

renderUsers();
renderSales();