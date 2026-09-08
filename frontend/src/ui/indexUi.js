import { fetchItems, createItem } from '../server/indexServer.js';

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

renderList();
