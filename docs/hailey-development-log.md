
Development Log - Rowdy's Bookstore

Developer:Hailey Chagolla
Role: Scrum Master / User Accounts and Authentication
Branch:hailey
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

8. Final Frontend Adjustments

Footer and Shared Styling
- Added matching footers to the registration, login, and account pages.
- Updated the shared footer CSS to keep the footer at the bottom of shorter pages.
- Removed duplicate account-specific CSS rules to avoid conflicting styles.
- Preserved the existing shared navigation and bookstore color scheme.

Email Validation
- Updated email validation across registration, login, and account management.
- Added a regular expression requiring an email domain containing a period.
- Preserved existing field-level validation, error messages, and visual feedback.
- Confirmed that email validation checks formatting only and does not verify email ownership.

Account Management Redesign
- Improved the account page layout with separate Account Overview and Personal Information sections.
- Added a profile heading and avatar placeholder.
- Preserved editable first name, last name, and email fields.
- Removed the unused order history placeholder to focus on assigned account-management requirements.
- Prepared hidden welcome-message and membership-date elements for future backend integration.
- Kept existing form validation and submission behavior unchanged.

Testing and Remaining Work
- Rebuilt the frontend using Docker Compose.
- Verified the updated footer positioning and account-page layout in the browser.
- Tested updated email validation.
- Backend registration, login, account retrieval, account updates, authentication, and logout remain pending.
- Server-side validation, password hashing, and duplicate-email handling will be implemented during Sprint 2.
- Account Overview will display actual customer information once backend integration is complete.

November 10, 2026 - Sprint 2

Developer:Hailey Chagolla
Role: Scrum Master / Frontend and Authentication
Branch:hailey
Commit: 606b38b

Development Work:
- Connected registration and login pages to the backend API.
- Integrated account retrieval and profile updates.
- Implemented logout functionality and session handling.
- Updated registerUI.js, loginUI.js, accountUI.js, and account.html.
- Verified that account information is retrieved from and saved to the database.

Testing Performed:
- Successfully registered a new user.
- Tested login with registered credentials.
- Verified that sessions remain active as expected.
- Retrieved account information from the backend.
- Updated account information and confirmed changes persisted.
- Tested logout and confirmed account information is hidden when logged out.
- Confirmed authentication functionality worked locally.

Code Review and Team Coordination:
- Reviewed Abraham's latest branch (commit a2b5017).
- Identified issues in homepage navigation, search, and cart functionality.
- Confirmed cartStore.js was empty despite being imported by other files.
- Identified JavaScript errors in cartUi.js.
- Created a troubleshooting and testing checklist for Abraham and Kenneth.
- Requested coordination between Abraham and Kenneth to avoid duplicate cart implementations.
- Recommended holding off on merging until issues are fixed and tested.

Version Control:
- Committed authentication changes as 606b38b.
- Successfully pushed changes to origin/hailey.
- Verified the local branch was clean and synchronized.
- Did not modify or merge Abraham's branch.

Current Status:
- Assigned Sprint 2 authentication functionality completed and tested.
- Changes pushed to GitHub; awaiting team review and integration.
- Other team members are addressing remaining integration issues.

Next Steps:
- Coordinate with Kingston on merging completed work.
- Retest authentication after the team's branches are integrated.
- Assist with final integration testing and demo preparation.

November 12, 2026 - Team Integration and Code Review

Developer:Hailey Chagolla  
Role: Scrum Master / Frontend and Authentication  
Branch:hailey

1. Repository and Integration Review
- Fetched the latest remote branches and reviewed recent commits in main.
- Confirmed that Abraham's latest pushed homepage changes had been incorporated into main, including integration with Kenneth's shared cart functionality.
- Reviewed Kingston's additional homepage fixes, including the correction to the catalog status element.
- Inspected the shared navigation and identified remaining authentication-aware navigation improvements.

2. Team Member Code Review
- Reviewed Jonathan's new sampleData.sql file containing sample categories, books, discounts, and sales.
- Confirmed that Jonathan's latest sample-data commit had not yet been merged into main.
- Reviewed Elian's book-editing changes in the admin frontend and backend.
- Identified an API method mismatch: Elian's frontend uses PUT, while the current backend defines PATCH /api/admin/books/:id`.
- Confirmed that the current backend already includes administrator authentication and role-based protection for admin routes.

3. Team Coordination
- Shared integration findings with the team through Discord.
- Recommended prioritizing the remaining merges into main, followed by combined application testing.
- Confirmed plans to update the shared navbar based on login status and administrator permissions.
- Coordinated remaining work in preparation for the final project submission.

---

November 13, 2026 - Navigation, Authentication, and UI Improvements

Developer:Hailey Chagolla  
Role: Scrum Master / Frontend and Authentication  
Branch:hailey

1. GitHub and Development Environment
- Fetched the latest remote repository updates.
- Updated the local hailey branch with origin/main using a successful fast-forward merge.
- Incorporated the latest integrated homepage, cart, checkout, and backend changes into the local development branch.
- Rebuilt and ran the application using Docker Compose.

2. Dynamic Navigation
- Updated navigationUI.js to check the current authentication session through GET /api/auth/me.
- Implemented dynamic navigation links based on the user's login status.
- Configured logged-out users to see Log In, Register, and Cart.
- Configured authenticated customers to see My Account, Log Out, and Cart.
- Added an Admin Dashboard link that appears only when the authenticated user's role is admin.
- Connected navbar logout functionality to the existing POST /api/auth/logout endpoint.
- Preserved the shared navbar, search functionality, and Kenneth's cart counter.

3. Login and Registration Improvements
- Updated loginUI.js to redirect users to the bookstore homepage after successful login.
- Updated registerUI.js to redirect users to the homepage after successful account registration.
- Preserved the backend's automatic session creation during registration.
- Improved the duplicate-account error message to direct existing users to log in.
- Preserved existing form validation and unsuccessful-submission handling.

4. My Account UI Improvements
- Reviewed the existing shared stylesheet and account page structure.
- Created frontend/src/account.css for targeted My Account styling without relocating existing shared CSS.
- Improved the appearance of the account page's Log Out button and Back to Bookstore link.
- Updated account.html to position Back to Bookstore on the left and Log Out on the right beneath the Personal Information card.
- Preserved the Account Overview, profile editing form, and existing account functionality.
- Kept the shared navbar layout largely unchanged to avoid unnecessary changes to other team members' pages.

5. Testing Performed
- Verified that logged-out visitors see Log In, Register, and Cart in the navbar.
- Logged in with an existing customer account and confirmed that My Account and Log Out appear while Log In and Register are hidden.
- Verified that the account page retrieves the authenticated user's information.
- Tested logout and confirmed that the guest navigation is restored.
- Successfully registered a new account and confirmed automatic redirection to the homepage with an active session.
- Verified that the frontend serves the updated registration JavaScript.
- Rebuilt and visually reviewed the My Account page after its styling improvements.
- Confirmed that the Admin Dashboard link appears for an authenticated administrator and opens the admin page.

6. Administrator Demo Setup
- Registered a dedicated demonstration administrator account through the normal registration page.
- Confirmed that the backend initially created the account with the customer role.
- Updated the new account to the admin role directly in the local PostgreSQL database.
- Confirmed that the navbar recognizes the administrator role and displays Admin Dashboard.
- Verified that the dashboard page opens and displays its administrative sections.
- Administrator account provisioning was performed locally and is not part of the Git repository.

7. Current Status and Remaining Work
- Dynamic navigation has been tested for guests, customers, and administrators.
- Login, registration, logout, and account retrieval are functioning in local testing.
- The administrator dashboard opens, but its complete management functionality has not been tested.
- The local catalog currently displays no books; sample data integration remains a separate team task.
- Final code changes still need to be reviewed, committed, pushed, and merged into main.
- The team will need to provision an administrator account in the database used for the final demonstration.

8. Next Steps
- Review modified files and confirm that only intended changes are included.
- Commit and push completed frontend improvements from my branch.
- Coordinate merging the changes into main.
- Verify the final integrated application after the remaining team changes are merged.
- Assist with final demonstration preparation and testing.