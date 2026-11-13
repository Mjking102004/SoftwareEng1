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
    searchInput.placeholder = 'Search books, authors, or ISBN...';
    searchInput.setAttribute('aria-label', 'Search books');
    searchInput.required = true;

    const searchButton = document.createElement('button');
    searchButton.type = 'submit';
    searchButton.textContent = 'Search';

    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);
    nav.appendChild(searchForm);

    // Create account and cart navigation links.
    const accountLinks = document.createElement('div');
    accountLinks.className = 'nav-actions';

    // Always show the cart, regardless of login status.
    const accountItems = [
        { text: 'Cart', href: '/cart' }
    ];

    accountItems.forEach((link) => {
        const anchor = document.createElement('a');
        anchor.textContent = link.text;
        anchor.href = link.href;

        // Cart link shows how many books are in the cart: Cart (3)
        if (link.href === '/cart') {
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

    // Update account links based on the user's login status.
    async function updateAccountLinks() {
        let user = null;

        try {
            const response = await fetch('/api/auth/me');

            if (response.ok) {
                const data = await response.json();
                user = data.user;
            } else if (response.status !== 401) {
                console.error('Unable to check login status.');
                return;
            }
        } catch (error) {
            console.error('Unable to check login status:', error);
            return;
        }

        // Choose which links to display.
        const accountNavLinks = user
            ? [
                { text: 'My Account', href: '/account' },
                ...(user.role === 'admin'
                    ? [{ text: 'Admin Dashboard', href: '/admin' }]
                    : []),
                { text: 'Log Out', href: '/login', logout: true }
            ]
            : [
                { text: 'Log In', href: '/login' },
                { text: 'Register', href: '/register' }
            ];

        // Keep the Cart link at the end.
        const cartLink = accountLinks.querySelector('a[href="/cart"]');

        accountNavLinks.forEach((link) => {
            const anchor = document.createElement('a');
            anchor.textContent = link.text;
            anchor.href = link.href;

            // Log out through the existing backend endpoint.
            if (link.logout) {
                anchor.addEventListener('click', async (event) => {
                    event.preventDefault();

                    try {
                        const response = await fetch('/api/auth/logout', {
                            method: 'POST'
                        });

                        if (!response.ok) {
                            alert('Logout failed. Please try again.');
                            return;
                        }

                        // Redirect to login after logout.
                        window.location.href = '/login';

                    } catch (error) {
                        alert('Unable to connect to the server.');
                    }
                });
            }

            accountLinks.insertBefore(anchor, cartLink);
        });
    }

    // Check the user's login status when the page loads.
    updateAccountLinks();

    // Fill in the cart count. Pages with their own cart logic
    // (cart/checkout) already load the cart.
    const path = window.location.pathname;

    if (!['/cart', '/checkout'].some((p) => path.startsWith(p))) {
        import('./cartStore.js').then((store) => store.loadCart());
    }
}