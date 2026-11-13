
const form = document.getElementById('login-form');
const message = document.getElementById('login-message');

const email = document.getElementById('email');
const password = document.getElementById('password');

// Display validation feedback for an input.
function showFeedback(input, feedbackId, isValid, errorMessage) {
    const group = input.closest('.form-group');
    const feedback = document.getElementById(feedbackId);

    group.classList.remove('has-error', 'has-success');

    if (isValid) {
        group.classList.add('has-success');
        feedback.textContent = '';
    } else {
        group.classList.add('has-error');
        feedback.textContent = errorMessage;
    }

    input.setAttribute('aria-invalid', String(!isValid));

    return isValid;
}

 // Validate the email address.
function checkEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = email.value.trim();

    const isValid = value !== '' &&
                    email.checkValidity() &&
                    emailPattern.test(value);

    return showFeedback(email, 'email-feedback',
        isValid, 'Please enter a valid email address.');
}

// Check that a password was entered.
function checkPassword() {
    const isValid = password.value.length > 0;

    return showFeedback(password, 'password-feedback',
        isValid, 'Please enter your password.');
}

// Validate fields when the user leaves them.
email.addEventListener('blur', checkEmail);
password.addEventListener('blur', checkPassword);


// Validate the form and send login credentials to the backend.
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const results = [
        checkEmail(),
        checkPassword()
    ];

    if (!results.every(Boolean)) {
        message.textContent = 'Please correct the highlighted fields.';
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value.trim(),
                password: password.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.error || 'Login failed.';
            return;
        }

        // Redirect to the account page after successful login.
        window.location.replace('/');

    } catch (error) {
        message.textContent =
            'Unable to connect to the server. Please try again.';
    }
});