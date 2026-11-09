
const form = document.getElementById('account-form');
const message = document.getElementById('account-message');

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');

// Allow letters, spaces, apostrophes, periods, and hyphens.
// Supports accented letters as well.
const namePattern = /^[\p{L}\p{M}]+(?:[ .'\u2019-][\p{L}\p{M}]+)*$/u;

// Display feedback for each field.
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
    const value = firstName.value.trim();
    const isValid = namePattern.test(value);

    return showFeedback(firstName, 'first-name-feedback',
        isValid, 'Please enter a valid first name.');
}

// Validate the last name.
function checkLastName() {
    const value = lastName.value.trim();
    const isValid = namePattern.test(value);

    return showFeedback(lastName, 'last-name-feedback',
        isValid, 'Please enter a valid last name.');
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

// Validate when the user leaves each field.
firstName.addEventListener('blur', checkFirstName);
lastName.addEventListener('blur', checkLastName);
email.addEventListener('blur', checkEmail);

// Validate the entire form before submission.
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const results = [
        checkFirstName(),
        checkLastName(),
        checkEmail()
    ];

    if (results.every(Boolean)) {
        message.textContent =
            'Form validation passed. Changes have not been saved.';
    } else {
        message.textContent =
            'Please correct the highlighted fields.';
    }
});