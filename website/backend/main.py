from flask import Flask, render_template, request, redirect, session
import uuid
import json

app = Flask(__name__)
app.secret_key = "sigmaAlphaChad"


@app.route("/")
def home():
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
    
    return render_template("index.html")

@app.route("/flights", methods=["POST"])
def flights():
    # Debugging form data
    print(request.form)

    # Retrieve existing passenger data directly from the session
    adults = int(request.form.get("numAdult", 0))  # Safely retrieve adult count
    children = int(request.form.get("numChild", 0))  # Safely retrieve child count
    
    # Create ticket_dem dictionary using session data
    ticket_dem = {
        'adults': adults,
        'child': children,
        'infant': int(request.form.get("numInf", 0))  # Add infants if applicable
    }

    # Save ticket_dem in the session
    session["ticket_dem"] = ticket_dem

    print(ticket_dem)  # For debugging

    # Collect other form data and save it in the session
    session["from"] = request.form.get("from")
    session["to"] = request.form.get("to")
    session["dep"] = request.form.get("dep")
    session["class"] = request.form.get("class")

    # Load flight data
    with open("./data/flights.json", "r") as data:
        database = json.load(data)

    available_flights = []
    
    for flight in database.get("flights", []):  
        if flight.get("from") == session["from"] and flight.get("to") == session["to"]:
            available_flights.append(flight)

    search = {
        "from": session["from"].upper(),
        "to": session["to"].upper(),
        "depDate": session["dep"]
    }

    return render_template("flights.html", flights=available_flights, search=search)

@app.route("/submit-flight", methods=["POST"])
def submit_flights():
    # Retrieve ticket_dem from the session
    ticket_dem = session.get("ticket_dem", {'adults': 0, 'child': 0, 'infant': 0})

    print(ticket_dem)

    # Render the seats template with the retrieved ticket_dem
    return render_template("seats.html", ticket_dem=ticket_dem)



@app.route("/submitSeats", methods=["POST"])
def submit_seats():
    adult_seats = json.loads(request.form.get('adult-seats', '{}'))
    child_seats = json.loads(request.form.get('child-seats', '{}'))

    # Store seat selections in session
    session['adult_seats'] = adult_seats
    session['child_seats'] = child_seats

    # Process seat selections (e.g., update database, generate booking, etc.)
    # This is where you'd add your business logic for handling the seat selections

    # For now, let's just print the selections
    print("Adult Seats:", adult_seats)
    print("Child Seats:", child_seats)

    # Redirect to a confirmation page or the next step in your booking process
    return render_template("inflight.html", adult_seats=adult_seats, child_seats=child_seats)


@app.route("/inflight", methods=["POST"])
def inflight_services():
    # Retrieve ticket_dem from the session
    ticket_dem = session.get("ticket_dem", {'adults': 0, 'child': 0, 'infant': 0})

    print(ticket_dem)

    # Get meal and drink types from the form
    meal_type = request.form.get("meal_type")
    beverage_type = request.form.get("beverage_type")

    # Create a dictionary to store meal and drink types
    services = {
        "meals": meal_type,
        "drink": beverage_type
    }

    # Store the services dictionary in the session
    session["services"] = services

    # Retrieve the services from the session (for debugging)
    print(session.get("services"))

    return render_template("details.html", ticket_dem=ticket_dem, services=session.get("services"))

@app.route("/payment", methods=["POST"])
def payment():
    return render_template("payment.html", ticket_dem=ticket_dem, services=session.get("services"))



@app.route("/manage", methods=["POST"])
def manage():
    ticketno = request.form.get("ticketno")
    email = request.form.get("email")
    

    print(email, ticketno)



    return render_template("manage.html")



if __name__ == "__main__":
    app.run(port=5050, debug=True)

