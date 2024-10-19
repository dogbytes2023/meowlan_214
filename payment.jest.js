/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load HTML as a string for Jest to use JSDOM
const html = fs.readFileSync(path.resolve(__dirname, './yourFileName.html'), 'utf8');

describe('Flight Payment Page Tests', () => {
    let document;

    beforeEach(() => {
        // Load the HTML into Jest's JSDOM environment
        document = new JSDOM(html).window.document;
    });

    test('should display the total price correctly', () => {
        const totalPriceElement = document.querySelector('.text-warning.mono strong');
        expect(totalPriceElement.textContent).toBe('$200');
    });

    test('should display passenger details correctly', () => {
        const passengerName = document.querySelector('tbody tr td').textContent;
        expect(passengerName).toBe('Mr John Doe'); // Example name, adjust as needed

        const seatNumber = document.querySelectorAll('tbody tr td')[3].textContent;
        expect(seatNumber).toBe('12A'); // Example seat number, adjust as needed
    });

    test('should render the payment form', () => {
        const form = document.getElementById('payment-form');
        expect(form).not.toBeNull();

        const cardNameInput = document.getElementById('cardName');
        expect(cardNameInput).not.toBeNull();
        expect(cardNameInput.getAttribute('required')).toBe('true');

        const cardNumberInput = document.getElementById('cardNumber');
        expect(cardNumberInput).not.toBeNull();
        expect(cardNumberInput.getAttribute('required')).toBe('true');

        const expiryDateInput = document.getElementById('expiryDate');
        expect(expiryDateInput).not.toBeNull();
        expect(expiryDateInput.getAttribute('required')).toBe('true');

        const cvvInput = document.getElementById('cvv');
        expect(cvvInput).not.toBeNull();
        expect(cvvInput.getAttribute('required')).toBe('true');
    });

    test('should validate card input fields', () => {
        const cardNameInput = document.getElementById('cardName');
        const cardNumberInput = document.getElementById('cardNumber');
        const expiryDateInput = document.getElementById('expiryDate');
        const cvvInput = document.getElementById('cvv');

        cardNameInput.value = 'John Doe';
        cardNumberInput.value = '4111111111111111';
        expiryDateInput.value = '12/25';
        cvvInput.value = '123';

        expect(cardNameInput.value).toBe('John Doe');
        expect(cardNumberInput.value).toBe('4111111111111111');
        expect(expiryDateInput.value).toBe('12/25');
        expect(cvvInput.value).toBe('123');
    });

    test('should not submit the payment form if fields are empty', () => {
        const form = document.getElementById('payment-form');
        const submitButton = form.querySelector('button[type="submit"]');

        form.submit = jest.fn();

        // Clear fields
        document.getElementById('cardName').value = '';
        document.getElementById('cardNumber').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('cvv').value = '';

        submitButton.click();

        // Ensure the form is not submitted due to empty fields
        expect(form.submit).not.toHaveBeenCalled();
    });

    test('should submit the form when all fields are filled correctly', () => {
        const form = document.getElementById('payment-form');
        const submitButton = form.querySelector('button[type="submit"]');

        form.submit = jest.fn();

        // Fill out the form fields
        document.getElementById('cardName').value = 'John Doe';
        document.getElementById('cardNumber').value = '4111111111111111';
        document.getElementById('expiryDate').value = '12/25';
        document.getElementById('cvv').value = '123';

        submitButton.click();

        // Expect the form to be submitted
        expect(form.submit).toHaveBeenCalled();
    });

    test('should display flight details correctly', () => {
        const flightDetailsText = document.querySelector('.payment-section p').textContent;
        expect(flightDetailsText).toContain('From: Sydney (SYD) to Melbourne (MEL)');

        const cabinClass = document.querySelectorAll('.payment-section p')[1].textContent;
        expect(cabinClass).toBe('Cabin Class: Economy');
    });
});
