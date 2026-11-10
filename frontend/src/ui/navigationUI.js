import { refreshCartBadge } from './cartStore.js';

const header = document.getElementById('site-header');

if (header) {
    // Create the main navigation.
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.setAttribute('aria-label', 'Main navigation');

    // Create the bookstore logo and name.
    const logo = document.createElement('a');
    logo.className = 'logo';
    logo.href = '/';

    const logoImage = document.createElement('img');
    logoImage.src = '/UTSA-Roadrunners-Logo.png';
    logoImage.alt = '';

    const logoText = document.createElement('span');
    logoText.textContent = "Rowdy's Bookstore";

    logo.appendChild(logoImage);
    logo.appendChild(logoText);
    nav.appendChild(logo);

    // Create the main page links.
    const navLinks = document.createElement('div');
    navLinks.className = 'nav-links';

    const links = [
        { text: 'Home', href: '/' },
        { text: 'Browse Books', href: '/#catalog' }
    ];

    links.forEach((link) => {
        const anchor = document.createElement('a');
        anchor.textContent = link.text;
        anchor.href = link.href;

        navLinks.appendChild(anchor);
    });

    nav.appendChild(navLinks);

    // Create the bookstore search bar.
    const searchForm = document.createElement('form');
    searchForm.className = 'nav-search';
    searchForm.method = 'get';
    searchForm.action = '/#catalog';
    searchForm.setAttribute('role', 'search');

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.name = 'q';
    searchInput.placeholder = 'Search by title, author, or description...';
    searchInput.setAttribute('aria-label', 'Search books');
    searchInput.required = true;
    searchInput.value = new URLSearchParams(window.location.search).get('q') || '';

    const searchButton = document.createElement('button');
    searchButton.type = 'submit';
    searchButton.textContent = 'Search';

    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);
    nav.appendChild(searchForm);

    // Create account and cart navigation links.
    const accountLinks = document.createElement('div');
    accountLinks.className = 'nav-actions';

    const accountItems = [
        { text: 'Log In', href: '/login' },
        { text: 'Register', href: '/register' },
        { text: 'My Account', href: '/account' },
        { text: 'Cart', href: '/cart' }
    ];

    accountItems.forEach((link) => {
        const anchor = document.createElement('a');
        anchor.textContent = link.text;
        anchor.href = link.href;
        // Show the number of items in the cart next to the Cart link.
        if (link.text === 'Cart') {
            anchor.textContent = 'Cart (';
            const count = document.createElement('span');
            count.id = 'cart-count';
            count.textContent = '0';
            anchor.appendChild(count);
            anchor.appendChild(document.createTextNode(')'));
        }

        accountLinks.appendChild(anchor);
    });

    nav.appendChild(accountLinks);

    // Add the completed navigation to the page.
    header.appendChild(nav);
    refreshCartBadge();
}