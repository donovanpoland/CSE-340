// Add class for showing navigation on hamburger button click
const navButton = document.querySelector('#ham-btn');
const navBar = document.querySelector('#nav-bar');

if (navButton && navBar) {
    navButton.addEventListener('click', () => {
        navButton.classList.toggle('show');
        navBar.classList.toggle('show');
    });

    // Listen for window resize and remove show class
    window.addEventListener("resize", () => {
        navButton.classList.remove('show');
        navBar.classList.remove('show');
    });
}
