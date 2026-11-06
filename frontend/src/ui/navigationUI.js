const header = document.getElementById('site-header');

const nav = document.createElement('nav');
nav.setAttribute('aria-label', 'Main navigation');

const links = [
    { text: "Home", href: "/home" },
    { text: "Log In", href: "/login" },
    { text: "Register", href: "/register" },
    { text: "My Account", href: "/account" }
];

links.forEach((link) => {
    const anchor = document.createElement('a');
    anchor.textContent = link.text;
    anchor.href = link.href;
    nav.appendChild(anchor);
});

header.appendChild(nav);