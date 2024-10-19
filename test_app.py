import pytest
import json
from flask import session
from main import app  # Assuming your file is named main.py


@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'sigmaAlphaChad'
    with app.test_client() as client:
        with app.app_context():
            yield client


def test_home(client):
    """Test if the home route sets a session ID and renders the index template."""
    response = client.get('/')
    assert response.status_code == 200
    assert 'session_id' in session
    assert b'<h1>Welcome to FlyDream</h1>' in response.data  # Assuming this is a unique heading in index.html


def test_flights_post(client, monkeypatch):
    """Test the flights route with POST data and session storage."""

    # Mock the flight data to avoid file access
    def mock_json_load(file):
        return {
            "flights": [
                {"from": "SYD", "to": "MEL", "flight_no": "FL123"},
                {"from": "SYD", "to": "BNE", "flight_no": "FL456"}
            ]
        }

    monkeypatch.setattr(json, "load", mock_json_load)

    # Set up form data for the POST request
    form_data = {
        "numAdult": "2",
        "numChild": "1",
        "from": "SYD",
        "to": "MEL",
        "dep": "2024-11-01",
        "class": "economy"
    }

    response = client.post('/flights', data=form_data)
    assert response.status_code == 200
    assert session["ticket_dem"] == {"adults": 2, "child": 1, "infant": 0}
    assert session["from"] == "SYD"
    assert session["to"] == "MEL"
    assert session["dep"] == "2024-11-01"
    assert b'<h2>Available Flights</h2>' in response.data  # Assuming this is a heading in flights.html


def test_submit_flights(client):
    """Test if the submit-flight route renders the seats.html page correctly."""
    # Simulate session data
    with client.session_transaction() as session_data:
        session_data['ticket_dem'] = {'adults': 2, 'child': 1, 'infant': 0}

    response = client.post('/submit-flight')
    assert response.status_code == 200
    assert b'<h1>Select Your Seats</h1>' in response.data  # Assuming this is a heading in seats.html


def test_manage_flights(client, monkeypatch):
    """Test the manage route where customer is found in the database."""

    def mock_json_load(file):
        return [
            {"email": "test@example.com", "name": "John Doe", "ticketno": "123456", "first_name": "John", "last_name": "Doe", "title": "Mr"}
        ]

    monkeypatch.setattr(json, "load", mock_json_load)

    # Set up form data for the POST request
    form_data = {
        "ticketno": "123456",
        "email": "test@example.com"
    }

    response = client.post('/manage', data=form_data)
    assert response.status_code == 200
    assert b'<h2>Manage Your Booking</h2>' in response.data  # Assuming this is a heading in manage.html


def test_inflight_services(client):
    """Test if the inflight services route renders the details.html page correctly."""
    # Simulate session data
    with client.session_transaction() as session_data:
        session_data['ticket_dem'] = {'adults': 2, 'child': 1, 'infant': 0}

    # Send the POST request
    response = client.post('/inflight', data={'meal_type': 'vegan', 'beverage_type': 'water'})
    
    assert response.status_code == 200
    assert b'<h2>Flight Services</h2>' in response.data  # Assuming this is a heading in details.html
    assert session['services'] == {'meals': 'vegan', 'drink': 'water'}  # Check session updates


def test_payment(client):
    """Test if the payment route processes passenger data and renders the payment.html page."""
    # Simulate session data
    with client.session_transaction() as session_data:
        session_data['adult_seats'] = {"0": "1A"}
        session_data['child_seats'] = {"0": "2B"}
        session_data['services'] = {"meals": "vegan", "drink": "water"}

    # Set up form data
    form_data = {
        "adultTitle0": "Mr",
        "adultFirstName0": "John",
        "adultLastName0": "Doe",
        "adultDOB0": "1990-01-01",
        "adultEmail0": "john.doe@example.com",
        "adultPhone0": "123456789",
        "childTitle0": "Miss",
        "childFirstName0": "Jane",
        "childLastName0": "Doe",
        "childDOB0": "2010-05-10"
    }

    response = client.post('/payment', data=form_data)
    assert response.status_code == 200
    assert b'<h2>Payment Details</h2>' in response.data  # Assuming this is a heading in payment.html
    passengers = session.get('passengers')
    assert passengers[0]['first_name'] == "John"
    assert passengers[1]['first_name'] == "Jane"
