
const form = document.getElementById('account-form');
const message = document.getElementById('account-message');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!firstName || !lastName || !email) {
        message.textContent = 'Please complete all fields.';
        return;
    }

    message.textContent =
        'Form validation passed. Changes have not been saved.';
});