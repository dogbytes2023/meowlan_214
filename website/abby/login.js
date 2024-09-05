// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login-form');

    // Fade-in effect for the login form
    setTimeout(() => {
        loginForm.style.opacity = 1;
        loginForm.style.transform = 'translateY(0)';
    }, 500); // Start after 500ms delay

    // Add focus animation to input fields
    const inputFields = document.querySelectorAll('.form-control');
    inputFields.forEach((input) => {
        input.addEventListener('focus', function () {
            this.style.borderColor = '#007bff'; // Highlight input on focus
            this.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)';
        });

        input.addEventListener('blur', function () {
            this.style.borderColor = '#ccc'; // Reset border color
            this.style.boxShadow = 'none';
        });
    });

    // Button animation on click
    const loginButton = document.querySelector('.btn-primary');
    loginButton.addEventListener('click', function () {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});
