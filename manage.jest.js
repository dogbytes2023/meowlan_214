/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load HTML as a string for Jest to use JSDOM
const html = fs.readFileSync(path.resolve(__dirname, './yourFileName.html'), 'utf8');

describe('Manage Your Booking Page Tests', () => {
    let document;

    beforeEach(() => {
        // Load the HTML into Jest's JSDOM environment
        document = new JSDOM(html).window.document;
    });

    test('should display passenger details correctly', () => {
        const passengerName = document.querySelector('div.mb-4 p').textContent;
        expect(passengerName).toBe('Mr John Doe');  // Example name, adjust as needed

        const email = document.querySelectorAll('div.mb-4 p')[1].textContent;
        expect(email).toBe('johndoe@example.com');  // Example email, adjust as needed

        const contactNumber = document.querySelectorAll('div.mb-4 p')[2].textContent;
        expect(contactNumber).toBe('+61 123 456 789');  // Example number, adjust as needed
    });

    test('should display flight details correctly', () => {
        const fromLocation = document.querySelectorAll('div.mb-4 p')[4].textContent;
        const toLocation = document.querySelectorAll('div.mb-4 p')[5].textContent;
        const departureTime = document.querySelectorAll('div.mb-4 p')[6].textContent;
        const arrivalTime = document.querySelectorAll('div.mb-4 p')[7].textContent;
        const fareClass = document.querySelectorAll('div.mb-4 p')[8].textContent;
        const price = document.querySelectorAll('div.mb-4 p')[9].textContent;

        expect(fromLocation).toBe('SYD');
        expect(toLocation).toBe('MEL');
        expect(departureTime).toBe('21:00 PM');
        expect(arrivalTime).toBe('06:00 AM');
        expect(fareClass).toBe('Economy');
        expect(price).toBe('500 AUD');
    });

    test('should have disabled seat change button', () => {
        const changeSeatButton = document.querySelector('a.btn-warning[disabled]');
        expect(changeSeatButton).not.toBeNull();
        expect(changeSeatButton.textContent).toBe('Change Seat');
    });

    test('should display in-flight services correctly', () => {
        const inFlightServiceImages = document.querySelectorAll('.service-card img');
        const inFlightServiceDescriptions = document.querySelectorAll('.service-card p');

        expect(inFlightServiceImages[0].getAttribute('src')).toContain('in-flight meal');
        expect(inFlightServiceDescriptions[0].textContent).toBe('Delicious in-flight meals');

        expect(inFlightServiceImages[1].getAttribute('src')).toContain('entertainment');
        expect(inFlightServiceDescriptions[1].textContent).toBe('State-of-the-art entertainment system');
    });

    test('should display correct number of sections', () => {
        const cardSections = document.querySelectorAll('.card');
        expect(cardSections.length).toBe(3);  // Expecting 3 sections: Cancellation, Seat Change, In-flight Services
    });

    test('should have a contact customer service button for cancellation', () => {
        const contactButton = document.querySelector('a.btn-warning');
        expect(contactButton).not.toBeNull();
        expect(contactButton.textContent).toBe('Contact Customer Service');
    });
});
