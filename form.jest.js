/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load HTML as string for Jest to use JSDOM
const html = fs.readFileSync(path.resolve(__dirname, './yourFileName.html'), 'utf8');

describe('HTML form interaction tests', () => {
    let document;

    beforeEach(() => {
        // Load the HTML into Jest's JSDOM environment
        document = new JSDOM(html).window.document;
    });

    test('should have a submit button with correct text', () => {
        const button = document.getElementById('nextButton');
        expect(button).not.toBeNull();
        expect(button.textContent).toBe('Next');
    });

    test('should disable infant form fields initially', () => {
        const infantTitle = document.getElementById('infantTitle');
        expect(infantTitle.disabled).toBe(true);
    });

    test('should enable infant form fields when adult form is filled', () => {
        // Simulate filling the adult form
        document.getElementById('adultTitle').value = 'Mr';
        document.getElementById('adultFirstName').value = 'John';
        document.getElementById('adultLastName').value = 'Doe';

        // Simulate the change event that would trigger enabling infant form
        const event = new Event('change');
        document.getElementById('adultForm').dispatchEvent(event);

        // Now the infant form fields should be enabled
        const infantTitle = document.getElementById('infantTitle');
        expect(infantTitle.disabled).toBe(false);
    });

    test('should update accompanying adult dropdown when adult form is filled', () => {
        // Simulate filling the adult form
        document.getElementById('adultTitle').value = 'Mr';
        document.getElementById('adultFirstName').value = 'John';
        document.getElementById('adultLastName').value = 'Doe';

        // Trigger change event to update accompanying dropdown
        const event = new Event('change');
        document.getElementById('adultForm').dispatchEvent(event);

        const accompanyingDropdown = document.getElementById('infantAccompanying');
        expect(accompanyingDropdown.options.length).toBe(2);  // Select + one option
        expect(accompanyingDropdown.options[1].text).toBe('Mr John Doe');
    });
});
