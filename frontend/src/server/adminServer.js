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
        method: 'PUT',
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