/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load HTML as a string for Jest to use JSDOM
const html = fs.readFileSync(path.resolve(__dirname, './yourFileName.html'), 'utf8');

describe('Flight Booking Form Tests', () => {
    let document;

    beforeEach(() => {
        // Load the HTML into Jest's JSDOM environment
        document = new JSDOM(html).window.document;
    });

    test('should have the correct initial fare type and price', () => {
        const fareTypeElement = document.getElementById('selected-fare');
        const farePriceElement = document.getElementById('selected-price');
        expect(fareTypeElement.textContent).toBe('Economy');
        expect(farePriceElement.textContent).toBe('500');
    });

    test('should update fare type and price when a different fare is selected', () => {
        const economyRadio = document.getElementById('fare-1-1');
        const premiumRadio = document.getElementById('fare-1-2');
        const fareTypeElement = document.getElementById('selected-fare');
        const farePriceElement = document.getElementById('selected-price');

        // Simulate selecting Premium Economy
        premiumRadio.checked = true;
        const event = new Event('change');
        premiumRadio.dispatchEvent(event);

        expect(fareTypeElement.textContent).toBe('Premium Economy');
        expect(farePriceElement.textContent).toBe('700');
    });

    test('should disable Next button initially', () => {
        const nextButton = document.getElementById('nextButton');
        expect(nextButton.disabled).toBe(true);
    });

    test('should enable Next button after selecting and confirming flight', () => {
        const economyRadio = document.getElementById('fare-1-1');
        const confirmRadio = document.getElementById('confirm-flight-1');
        const nextButton = document.getElementById('nextButton');

        // Simulate selecting Economy
        economyRadio.checked = true;
        const fareChangeEvent = new Event('change');
        economyRadio.dispatchEvent(fareChangeEvent);

        // Simulate confirming the selected flight
        confirmRadio.checked = true;
        const confirmEvent = new Event('change');
        confirmRadio.dispatchEvent(confirmEvent);

        expect(nextButton.disabled).toBe(false);
    });
});
