
const form = document.getElementById('register-form');
const message = document.getElementById('register-message');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword =
        document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        return;
    }

    message.textContent =
        'Form validation passed. Registration is not connected yet.';
});