
const form = document.getElementById('register-form');
const message = document.getElementById('register-message');

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');

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

// Validate the first name.
function checkFirstName() {
    const isValid = firstName.value.trim().length > 0;

    return showFeedback(firstName, 'first-name-feedback',
        isValid, 'Please enter your first name.');
}

// Validate the last name.
function checkLastName() {
    const isValid = lastName.value.trim().length > 0;

    return showFeedback(lastName, 'last-name-feedback',
        isValid, 'Please enter your last name.');
}

// Validate the email address.
function checkEmail() {
    const isValid = email.value.trim() !== '' &&
                    email.checkValidity();

    return showFeedback(email, 'email-feedback',
        isValid, 'Please enter a valid email address.');
}

// Validate the password length.
function checkPassword() {
    const isValid = password.value.length >= 8;

    return showFeedback(password, 'password-feedback',
        isValid, 'Password must be at least 8 characters.');
}

// Validate the confirmation password.
function checkConfirmPassword() {
    const isValid = confirmPassword.value !== '' &&
                    password.value === confirmPassword.value;

    return showFeedback(confirmPassword, 'confirm-password-feedback',
        isValid, 'Passwords do not match.');
}

// Validate each field when the user leaves it.
firstName.addEventListener('blur', checkFirstName);
lastName.addEventListener('blur', checkLastName);
email.addEventListener('blur', checkEmail);
password.addEventListener('blur', checkPassword);
confirmPassword.addEventListener('blur', checkConfirmPassword);

// Validate the entire form before submission.
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const results = [
        checkFirstName(),
        checkLastName(),
        checkEmail(),
        checkPassword(),
        checkConfirmPassword()
    ];

    if (results.every(Boolean)) {
        message.textContent =
            'Form validation passed. Registration is not connected yet.';
    } else {
        message.textContent =
            'Please correct the highlighted fields.';
    }
});