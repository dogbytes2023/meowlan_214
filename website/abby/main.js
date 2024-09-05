// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Promotion Section Dynamic Update (Optional)
    const promotionSection = document.querySelector('.promotion-section');
    if (promotionSection) {
        // Example: Updating content dynamically
        promotionSection.querySelector('p').textContent = 'Join our latest workshops and enjoy exclusive discounts!';
        
        // Example: Adding a button dynamically
        const joinButton = document.createElement('button');
        joinButton.textContent = 'Join Now';
        joinButton.classList.add('btn', 'btn-primary');
        promotionSection.appendChild(joinButton);

        // Button click event (Optional)
        joinButton.addEventListener('click', function () {
            alert('Thank you for joining our workshop!');
        });
    }

    // Highlight Active Navigation Link
    const currentPage = window.location.pathname.split('/').pop(); // Get current page name
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active'); // Add 'active' class to the current page link
        }
    });

    // Carousel Control (if using a custom carousel, not Bootstrap's built-in one)
    const carouselItems = document.querySelectorAll('.promotion-item');
    let currentIndex = 0;

    function showCarouselItem(index) {
        carouselItems.forEach((item, i) => {
            item.style.display = i === index ? 'block' : 'none';
        });
    }

    function nextCarouselItem() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        showCarouselItem(currentIndex);
    }

    function prevCarouselItem() {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        showCarouselItem(currentIndex);
    }

    // Set initial carousel item
    if (carouselItems.length > 0) {
        showCarouselItem(currentIndex);
        // Auto-slide carousel every 5 seconds
        setInterval(nextCarouselItem, 5000);
    }

    // If using buttons to navigate the carousel
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');

    if (nextButton) {
        nextButton.addEventListener('click', nextCarouselItem);
    }

    if (prevButton) {
        prevButton.addEventListener('click', prevCarouselItem);
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });
    }
});
