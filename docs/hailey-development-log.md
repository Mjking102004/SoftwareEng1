
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

November 7, 2026 - Planned Work

- Configure GitHub Desktop to manage the existing local repository.
- Create and commit this development log.
- Update registration and account management forms.
- Improve basic styling and frontend validation.
- Test updated features through Docker.
- Push new changes to the hailey branch.
- Review team database and API decisions before backend development.

These tasks are planned and should not be considered completed until implemented and verified.