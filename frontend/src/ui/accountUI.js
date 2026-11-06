
const form = document.getElementById('account-form');
const message = document.getElementById('account-message');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!fullName || !email) {
        message.textContent = 'Please complete all fields.';
        return;
    }

    message.textContent =
        'Form validation passed. Changes have not been saved.';
});