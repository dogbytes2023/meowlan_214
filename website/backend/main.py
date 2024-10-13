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
    form_data = request.form
    session["from"] = form_data.get("from")
    session["to"] = form_data.get("to")
    session["dep"] = form_data.get("dep")
    session["numPass"] = form_data.get("numPass")
    session["class"] = form_data.get("class")
    with open("./data/data.json", "r") as data:
        database = json.load(data)
    available_flights = []
    for flight in database["flights"]:
        if flight["from"] == session["from"] and flight["to"] == session["to"]:
             available_flights.append(flight)
    search = {"from": session["from"].upper(), "to": session["to"].upper(), "depDate": session["dep"]}
    return render_template("flights.html", flights=available_flights, search=search)


@app.route("/submit-flight", methods=["POST"])
def submit_flights():
    print(request.form)
    ticket_details = session["numPass"].split(",")
    ticket_dem = {}
    for person in ticket_details:
        ticket_dem[person.split()[1]] = int(person.split()[0])
    print(ticket_dem)
    return render_template("seats.html", ticket_dem=ticket_dem)


if __name__ == "__main__":
    app.run(port=5050, debug=True)




