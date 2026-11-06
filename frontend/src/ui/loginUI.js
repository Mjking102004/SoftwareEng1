
const form = document.getElementById('login-form');
const message = document.getElementById('login-message');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        message.textContent = 'Please enter your email and password.';
        return;
    }

    message.textContent =
        'Login form is ready. Backend authentication is not connected yet.';
});
