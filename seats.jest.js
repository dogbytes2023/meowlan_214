/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load HTML as a string for Jest to use JSDOM
const html = fs.readFileSync(path.resolve(__dirname, './yourFileName.html'), 'utf8');

describe('Seat Selection Page Tests', () => {
    let document;

    beforeEach(() => {
        // Load the HTML into Jest's JSDOM environment
        document = new JSDOM(html, { runScripts: "dangerously", resources: "usable" }).window.document;
    });

    test('should render seat map with correct seat buttons', () => {
        const seatButtons = document.querySelectorAll('#economy button');
        expect(seatButtons.length).toBe(40); // 10 rows * 4 seats each = 40 seats
        expect(seatButtons[0].textContent).toBe('A1');
        expect(seatButtons[3].textContent).toBe('D1');
    });

    test('should select and deselect seats correctly', () => {
        const seatButtonA1 = document.getElementById('A1');
        const seatButtonB2 = document.getElementById('B2');

        seatButtonA1.click();
        expect(seatButtonA1.classList).toContain('selected-seat');

        seatButtonA1.click(); // Deselect the seat
        expect(seatButtonA1.classList).not.toContain('selected-seat');

        seatButtonB2.click();
        expect(seatButtonB2.classList).toContain('selected-seat');
    });

    test('should update passenger seat display when a seat is selected', () => {
        const passengerItem = document.querySelector('.passenger-item');
        const seatButtonA1 = document.getElementById('A1');

        passengerItem.click(); // Select the first passenger
        seatButtonA1.click(); // Assign seat A1 to the first passenger

        const seatDisplay = passengerItem.querySelector('.seat-display');
        expect(seatDisplay.textContent).toBe('A1');
    });

    test('should display correct legend for available and selected seats', () => {
        const availableLegend = document.querySelector('.legend-square.bg-primary');
        const selectedLegend = document.querySelector('.legend-square.bg-warning');

        expect(availableLegend).not.toBeNull();
        expect(selectedLegend).not.toBeNull();
    });

    test('should prepare correct JSON data for seat selection on form submission', () => {
        const form = document.querySelector('form');
        const seatButtonA1 = document.getElementById('A1');
        const seatButtonB2 = document.getElementById('B2');
        const adultSeatsInput = document.getElementById('adult-seats');
        const childSeatsInput = document.getElementById('child-seats');

        seatButtonA1.click(); // Select seat A1 for the first adult
        seatButtonB2.click(); // Select seat B2 for the second adult

        form.submit = jest.fn();
        form.querySelector('button[type="submit"]').click();

        expect(adultSeatsInput.value).toBe('{"0":"A1","1":"B2"}');
        expect(childSeatsInput.value).toBe('{}'); // No children selected in this example
        expect(form.submit).toHaveBeenCalled();
    });

    test('should prevent selecting already taken seats', () => {
        const seatButtonA1 = document.getElementById('A1');
        const seatButtonB1 = document.getElementById('B1');

        seatButtonA1.click(); // Select seat A1 for the first passenger
        seatButtonB1.click(); // Select seat B1 for the second passenger

        seatButtonA1.click(); // Try to reselect seat A1 for another passenger
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        expect(alertMock).toHaveBeenCalledWith("This seat is already taken by another passenger.");
        expect(seatButtonA1.classList).toContain('selected-seat');
        alertMock.mockRestore();
    });
});
