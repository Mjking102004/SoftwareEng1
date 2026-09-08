export async function fetchItems() {
  const response = await fetch('/api/items');
  return response.json();
}

export async function createItem(text) {
  const response = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return response.json();
}
