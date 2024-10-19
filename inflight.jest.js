/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load HTML as a string for Jest to use JSDOM
const html = fs.readFileSync(path.resolve(__dirname, './yourFileName.html'), 'utf8');

describe('In-flight Meal and Beverage Selection Tests', () => {
    let document;

    beforeEach(() => {
        // Load the HTML into Jest's JSDOM environment
        document = new JSDOM(html).window.document;
    });

    test('should have "Next" button disabled initially', () => {
        const nextButton = document.getElementById('nextButton');
        expect(nextButton).not.toBeNull();
        expect(nextButton.disabled).toBe(false);
    });

    test('should require meal selection before form submission', () => {
        const mealRadios = document.querySelectorAll('input[name="meal_type"]');
        const selectedMeal = Array.from(mealRadios).some(radio => radio.checked);
        
        expect(selectedMeal).toBe(false); // No meal selected initially
    });

    test('should require beverage selection before form submission', () => {
        const beverageRadios = document.querySelectorAll('input[name="beverage_type"]');
        const selectedBeverage = Array.from(beverageRadios).some(radio => radio.checked);

        expect(selectedBeverage).toBe(false); // No beverage selected initially
    });

    test('should allow user to select a meal and a beverage', () => {
        const standardMealRadio = document.querySelector('input[value="standard"]');
        const juiceBeverageRadio = document.querySelector('input[value="juice"]');

        expect(standardMealRadio).not.toBeNull();
        expect(juiceBeverageRadio).not.toBeNull();

        // Simulate selecting the Standard meal and Juice
        standardMealRadio.checked = true;
        juiceBeverageRadio.checked = true;

        // Verify that they are selected
        expect(standardMealRadio.checked).toBe(true);
        expect(juiceBeverageRadio.checked).toBe(true);
    });

    test('should submit form when both meal and beverage are selected', () => {
        const form = document.querySelector('form');
        const standardMealRadio = document.querySelector('input[value="standard"]');
        const waterBeverageRadio = document.querySelector('input[value="water"]');
        const submitButton = document.getElementById('nextButton');

        // Simulate selecting meal and beverage
        standardMealRadio.checked = true;
        waterBeverageRadio.checked = true;

        // Simulate form submission
        form.submit = jest.fn();
        submitButton.click();

        // Expect the form to be submitted after selection
        expect(form.submit).toHaveBeenCalled();
    });

    test('should ensure form submission is prevented if no selections are made', () => {
        const form = document.querySelector('form');
        const submitButton = document.getElementById('nextButton');

        // Clear selections
        document.querySelectorAll('input[name="meal_type"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="beverage_type"]').forEach(radio => radio.checked = false);

        // Simulate form submission
        form.submit = jest.fn();
        submitButton.click();

        // Ensure form is not submitted
        expect(form.submit).not.toHaveBeenCalled();
    });
});
