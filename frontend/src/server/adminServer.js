//get all books for the admin dashboard
export async function fetchBooks() {
    const response = await fetch('/api/admin/books');
    return response.json();
}