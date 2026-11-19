//get all books for the admin dashboard
export async function fetchBooks() {
    const response = await fetch('/api/admin/books');
    return response.json();
}

//add a new book
export async function createBook(book){
    const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(book),
    });
    return response.json();
}

//update a book
export async function updateBook(id, book){
    const response = await fetch(`/api/admin/books/${id}`, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(book),
    });
    return response.json();
}

//delete book
export async function deleteBook(id){
    const response = await fetch(`/api/admin/books/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

//get all categories
export async function fetchCategories(){
    const response = await fetch('/api/admin/categories');
    return response.json();
}

//get all discount codes
export async function fetchDiscounts(){
    const response = await fetch('/api/admin/discounts');
    return response.json();
}

//create a discount code
export async function createDiscount(discount){
    const response = await fetch('/api/admin/discounts', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(discount),
    });
    return response.json();
}

//turn a discount code on or off
export async function setDiscountActive(id, active){
    const response = await fetch(`/api/admin/discounts/${id}`, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({active}),
    });
    return response.json();
}

//get all sales
export async function fetchSales(){
    const response = await fetch('/api/admin/sales');
    return response.json();
}

//create a sale for a book
export async function createSale(sale){
    const response = await fetch('/api/admin/sales', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sale),
    });
    return response.json();
}

//turn a sale on or off
export async function setSaleActive(id, active){
    const response = await fetch(`/api/admin/sales/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({active}),
    });
    return response.json();
}

//get all users
export async function fetchUsers(){
    const response = await fetch('/api/admin/users');
    return response.json();
}

//change a user's role (customer or admin)
export async function setUserRole(id, role){
    const response = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({role}),
    });
    return response.json();
}

//get all orders
export async function fetchOrders(){
    const response = await fetch('/api/admin/orders');
    return response.json();
}

//change an order's status
export async function setOrderStatus(id, status){
    const response = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status}),
    });
    return response.json();
}