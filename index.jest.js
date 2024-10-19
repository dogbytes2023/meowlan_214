/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load HTML as a string for Jest to use JSDOM
const html = fs.readFileSync(path.resolve(__dirname, './yourFileName.html'), 'utf8');

describe('Flight Booking Tests', () => {
    let document;

    beforeEach(() => {
        // Load the HTML into Jest's JSDOM environment
        document = new JSDOM(html).window.document;
    });

    test('should initialize passenger counts correctly', () => {
        const passengerInput = document.getElementById('passengerInput');
        const adultCount = document.getElementById('adultCount').textContent;
        const childrenCount = document.getElementById('childrenCount').textContent;
        const infantCount = document.getElementById('infantCount').textContent;

        expect(passengerInput.value).toBe('0 adults, 0 child, 0 infant ');
        expect(adultCount).toBe('0');
        expect(childrenCount).toBe('0');
        expect(infantCount).toBe('0');
    });

    test('should show passenger dropdown when clicked', () => {
        const passengerInput = document.getElementById('passengerInput');
        const passengerDropdown = document.getElementById('passengerDropdown');

        // Initially the dropdown should be hidden
        expect(passengerDropdown.classList).toContain('d-none');

        // Simulate clicking on the passenger input
        passengerInput.click();

        // After click, dropdown should be visible
        expect(passengerDropdown.classList).not.toContain('d-none');
    });

    test('should hide passenger dropdown when clicking outside', () => {
        const passengerInput = document.getElementById('passengerInput');
        const passengerDropdown = document.getElementById('passengerDropdown');

        // Simulate clicking on the passenger input to show the dropdown
        passengerInput.click();
        expect(passengerDropdown.classList).not.toContain('d-none');

        // Simulate clicking outside the dropdown
        const event = new MouseEvent('click', { bubbles: true });
        document.dispatchEvent(event);

        // The dropdown should be hidden
        expect(passengerDropdown.classList).toContain('d-none');
    });

    test('should increase and update passenger count correctly', () => {
        const adultCount = document.getElementById('adultCount');
        const passengerInput = document.getElementById('passengerInput');

        // Simulate increasing the adult count
        const increaseButton = document.querySelector('.passenger-controls .btn-warning');
        increaseButton.click();

        // The adult count should be updated to 1
        expect(adultCount.textContent).toBe('1');

        // The passenger input should reflect the updated count
        expect(passengerInput.value).toBe('1 adults, 0 child, 0 infant ');
    });

    test('should handle departure date changes and set minimum return date correctly', () => {
        const departureDateInput = document.getElementById('departDate');
        const returnDateInput = document.getElementById('returnDate');

        // Set departure date
        departureDateInput.value = '2024-10-10';
        const event = new Event('change');
        departureDateInput.dispatchEvent(event);

        // Expect return date to have a minimum value of one day after departure
        expect(returnDateInput.getAttribute('min')).toBe('2024-10-11');
    });
});
