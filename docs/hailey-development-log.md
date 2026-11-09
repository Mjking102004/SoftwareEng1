
Development Log - Rowdy's Bookstore

Developer: Hailey Chagolla
Role: Scrum Master / User Accounts and Authentication
Branch: hailey
Course: CS 3773 Software Engineering

November 6, 2026 - Initial Frontend Development

1. Development Environment

- Verified the existing Git repository and hailey development branch.
- Reviewed the project's frontend, backend, PostgreSQL, and Docker configuration.
- Resolved local Windows permission issues affecting Git and VS Code.
- Started the Docker containers and confirmed the frontend was accessible.
- Successfully connected the project to GitHub and pushed changes to my branch.

2. Features Developed

Registration Page

- Created a registration form with full name, email, password, and password confirmation fields.
- Added basic required-field and email validation through HTML.
- Implemented password confirmation validation using JavaScript event listeners.
- Added feedback messages for matching and mismatched passwords.
- Added a link to the login page.

Login Page

- Created a login form with email and password fields.
- Added basic frontend validation and submission handling.
- Added a feedback message indicating that backend authentication is not connected yet.
- Added a link to the registration page.

Account Management Page

- Created a page where customers will eventually be able to view and update their account information.
- Added full name and email fields.
- Implemented basic form validation.
- Added a placeholder for order history.
- Added navigation back to the temporary bookstore homepage.

Shared Navigation

- Created a reusable navigation component using JavaScript.
- Added links for Home, Log In, Register, and My Account.
- Used DOM manipulation to generate navigation links dynamically.
- Added the shared navigation component to the new HTML pages.

Temporary Homepage

- Created home.html to test navigation between pages.
- Included a basic bookstore introduction and placeholder for the book catalog.
- Preserved the existing index.html connection test.
- Left the actual homepage, book listings, search, sorting, and Add to Cart interface for the assigned team member.

3. Files Created

frontend/src/pages/register.html
frontend/src/pages/login.html
frontend/src/pages/account.html
frontend/src/pages/home.html

frontend/src/ui/registerUI.js
frontend/src/ui/loginUI.js
frontend/src/ui/accountUI.js
frontend/src/ui/navigationUI.js

4. Testing Performed

- Built and ran the application using Docker Compose.
- Confirmed that the registration, login, and account pages loaded through Nginx.
- Tested registration with matching and mismatched passwords.
- Verified that the login form responded to submissions.
- Verified basic account form validation.
- Tested navigation between the new pages.
- Resolved a JavaScript loading issue caused by filename capitalization differences between Windows and Linux.

5. Known Limitations

- The new pages currently use basic, unstyled HTML.
- Form validation and feedback require further improvements.
- Registration does not create database records.
- Login does not authenticate users.
- Account management does not retrieve or save customer information.
- Authentication sessions, logout, and authorization are not implemented.
- Shared styling and backend integration are pending team coordination.
- The temporary homepage does not contain actual book listings.

6. Version Control

Created and pushed the following commit:

Add account pages and initial frontend validation

All eight frontend files were committed and pushed to the hailey development branch.

The changes have not been merged into main.

7. Planned Improvements

- Update registration and account forms to use separate first and last name fields.
- Improve form layouts, styling, and validation messages.
- Add more helpful error and success feedback.
- Coordinate database and API conventions with the backend and database developers.
- Implement backend registration and login functionality.
- Securely hash and store passwords.
- Connect user accounts to PostgreSQL.
- Implement authentication sessions and logout.
- Implement account information retrieval and updates.
- Perform end-to-end testing before integration.

8. Team Coordination

- Shared development progress with the team through Discord.
- Proposed a consistent UI/UX design and color scheme.
- Created a temporary homepage and shared navigation for development and testing.
- Coordinated with the homepage developer regarding reusable navigation and shared styling.
- Shared user account data requirements with the backend developer.
- Identified the need for separate first and last name fields.
- Requested confirmation of shared database tables, API endpoints, and naming conventions before backend integration.

9. Next Development Session


November 7, 2026 - Frontend Improvements

1. GitHub and Development Environment

- Connected GitHub Desktop to the existing SoftwareEng1 repository.
- Verified my development branch and previous commits.
- Created the development log to document implementation and testing.
- Fetched the latest remote repository information.
- Confirmed that main had no new commits and no Abraham development branch was visible.

2. Registration Form Improvements

- Replaced the Full Name field with separate First Name and Last Name fields.
- Organized form inputs using reusable form-group containers.
- Added individual feedback elements for each input.
- Implemented field-by-field validation using JavaScript event listeners.
- Added validation for required names, email format, password length, and   password confirmation.
- Added success and error classes to form groups for future CSS styling.
- Preserved the existing frontend-only registration behavior.

3. Login Form Improvements

- Organized form inputs using reusable form-group containers.
- Added individual feedback elements for email and password.
- Implemented field-by-field validation using blur and submit events.
- Added email format and nonempty password validation.
- Preserved frontend-only login behavior pending backend authentication.

4. Account Management Improvements

- Replaced Full Name with separate First Name and Last Name fields.
- Standardized the account form structure using form-group containers.
- Updated accountUI.js to reference the new fields.
- Preserved the account update and order history placeholders.
- Full field-by-field account validation remains planned.

5. Testing

- Rebuilt and started the application using Docker Compose.
- Confirmed that the registration, login, and account pages loaded.
- Tested registration input validation and password confirmation.
- Tested login validation with invalid email and password inputs.
- Confirmed that the account form and navigation remained functional.
- Verified that frontend validation does not create accounts or authenticate users.

6. Team Coordination and Design

- Shared development progress with the team.
- Decided to postpone individual page styling until Abraham's shared layout and CSS are available.
- Confirmed that only main and hailey branches were visible in the remote repository.
- Continued waiting for the team's finalized database schema and API conventions.

7. Remaining Work

- Add field-by-field validation to the account management form.
- Review and integrate shared CSS and navigation.
- Connect registration and login to the Express backend.
- Implement server-side validation, password hashing, and authentication.
- Connect account management to PostgreSQL.
- Complete integration and end-to-end testing.



November 8, 2026 - Frontend Integration and UI Improvements

1. Shared Styling

- Imported the shared stylesheet from Abraham's development branch.
- Corrected invalid CSS properties and removed duplicated rules.
- Updated the navbar styling using the bookstore's navy and orange color scheme.
- Added reusable styling for registration, login, and account management pages.
- Improved form spacing and reduced unnecessary vertical scrolling.
- Placed First Name and Last Name fields side by side on larger screens.
- Added responsive styling for smaller screens.

2. Reusable Navigation

- Expanded navigationUI.js to create a shared navigation bar.
- Integrated the UTSA Roadrunners logo and bookstore name.
- Added Home, Browse Books, Login, Register, My Account, and Cart links.
- Added a navigation search bar that submits a search query.
- Improved navbar spacing, alignment, and responsiveness.
- Centralized navigation generation instead of hardcoding it on individual pages.

3. Homepage Integration

- Imported Abraham's bookstore homepage into index.html.
- Replaced the hardcoded homepage navigation with navigationUI.js.
- Preserved the homepage introduction, book catalog container, and sorting dropdown.
- Removed the duplicate homepage search input in favor of the shared navigation search bar.
- Removed the original connection test from the homepage.
- Updated the Back to Bookstore link to point to the main homepage.
- Retired the temporary home.html page after verifying the new homepage.

4. Form Validation and Layout

- Improved the account management validation to display individual feedback messages.
- Added validation on blur when users leave input fields.
- Added custom error messages underneath invalid fields.
- Improved red and green input border visibility.
- Disabled the browser's default form validation popups where custom validation is used.
- Preserved existing registration and login validation functionality.
- Maintained separate first and last name fields across registration and account management.

5. Testing

- Rebuilt and ran the frontend through Docker Compose.
- Verified that the main bookstore homepage loads correctly.
- Tested the shared navigation and page links.
- Verified the Roadrunners logo displays correctly.
- Tested registration, login, and account form validation.
- Confirmed that validation errors display underneath the appropriate inputs.
- Confirmed that the updated form layouts display correctly.
- Verified that navigation and validation continue working after homepage integration.

6. Current Limitations

- Registration and login are not connected to backend authentication.
- Account management does not retrieve or save customer information.
- The homepage book catalog is not connected to bookstore inventory.
- Search submits a query but does not filter actual books yet.
- Sorting and cart functionality still require integration.
- Navigation does not yet change based on authentication status.
- The backend database connection test code remains available in the repository history.

7. Next Steps

- Coordinate remaining homepage and catalog functionality with Abraham.
- Confirm Jonathan's database schema implementation.
- Coordinate authentication routes and controllers with Kingston.
- Implement backend registration, login, and account management.
- Connect the frontend forms to the backend APIs.
- Complete integration testing with the team's other features.