// navbar toggler
const button = document.querySelector('#nav-btn');
const buttonDisplay = document.querySelector('span.nav-btn');
const navbar = document.querySelector('ul.nav-list');

button.addEventListener('click', () => {
    navbar.classList.toggle('active');
})