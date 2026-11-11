const form = document.getElementById('account-form');
const message = document.getElementById('account-message');
const accountDetails = document.querySelector('.account-details');

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');

const accountStatus = document.getElementById('account-status');
const accountWelcome = document.getElementById('account-welcome');
const accountMemberSince = document.getElementById('account-member-since');
const logoutButton = document.getElementById('logout-button');

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

    return showFeedback(
        firstName,
        'first-name-feedback',
        isValid,
        'Please enter a valid first name.'
    );
}

// Validate the last name.
function checkLastName() {
    const value = lastName.value.trim();
    const isValid = namePattern.test(value);

    return showFeedback(
        lastName,
        'last-name-feedback',
        isValid,
        'Please enter a valid last name.'
    );
}

// Validate the email address.
function checkEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = email.value.trim();

    const isValid = value !== '' &&
                    email.checkValidity() &&
                    emailPattern.test(value);

    return showFeedback(
        email,
        'email-feedback',
        isValid,
        'Please enter a valid email address.'
    );
}

// Validate fields when the user leaves them.
firstName.addEventListener('blur', checkFirstName);
lastName.addEventListener('blur', checkLastName);
email.addEventListener('blur', checkEmail);


// Load account information for the logged-in user.
async function loadAccount() {
    // Keep private account details hidden until verified.
    accountDetails.hidden = true;
    logoutButton.hidden = true;
    accountWelcome.hidden = true;
    accountMemberSince.hidden = true;

    accountStatus.textContent = 'Loading account information...';

    try {
        const response = await fetch('/api/auth/me');

        if (!response.ok) {
            accountStatus.textContent =
                response.status === 401
                    ? 'Please log in to view your account.'
                    : 'Unable to load account information.';

            return;
        }

        const data = await response.json();
        const user = data.user;

        // Fill the form with the user's saved information.
        firstName.value = user.first_name;
        lastName.value = user.last_name;
        email.value = user.email;

        // Update the account overview.
        accountStatus.textContent = 'Account information loaded.';

        accountWelcome.textContent =
            `Welcome, ${user.first_name}!`;
        accountWelcome.hidden = false;

        if (user.created_at) {
            const memberDate = new Date(user.created_at);

            accountMemberSince.textContent =
                `Member since: ${memberDate.toLocaleDateString()}`;

            accountMemberSince.hidden = false;
        }

        // Show account controls after authentication succeeds.
        accountDetails.hidden = false;
        logoutButton.hidden = false;

    } catch (error) {
        accountStatus.textContent =
            'Unable to connect to the server.';

        accountDetails.hidden = true;
        logoutButton.hidden = true;
    }
}


// Validate and save account changes.
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const results = [
        checkFirstName(),
        checkLastName(),
        checkEmail()
    ];

    if (!results.every(Boolean)) {
        message.textContent =
            'Please correct the highlighted fields.';
        return;
    }

    try {
        const response = await fetch('/api/auth/me', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName.value.trim(),
                last_name: lastName.value.trim(),
                email: email.value.trim()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent =
                data.error || 'Unable to update account.';
            return;
        }

        message.textContent =
            'Account updated successfully!';

        // Reload saved account information from the backend.
        await loadAccount();

    } catch (error) {
        message.textContent =
            'Unable to connect to the server. Please try again.';
    }
});


// Log out the current user.
logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });

        if (!response.ok) {
            message.textContent =
                'Logout failed. Please try again.';
            return;
        }

        // Return to login after logging out.
        window.location.href = '/login';

    } catch (error) {
        message.textContent =
            'Unable to connect to the server. Please try again.';
    }
});


// Load account information when the page opens.
loadAccount();