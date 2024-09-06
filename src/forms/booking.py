from __future__ import annotations

import json

from flask_wtf import FlaskForm
from wtforms import DateTimeField, IntegerField, SelectField, SubmitField
from wtforms.validators import DataRequired

from src.museum import Museum

with open("src/static/states.json") as file:
    STATES: dict[str, list[str]] = json.load(file)

CITIES = [city for cities in STATES.values() for city in cities]


class BookingForm(FlaskForm):
    from src import conn

    state = SelectField(
        "Select State",
        choices=[
            (state, state)
            for state in STATES
            if state != "" and "district" not in state.lower()
        ],
    )
    city = SelectField("Select City", choices=CITIES)
    museum = SelectField(
        "Select Museum",
        choices=[(museum.id, museum.name) for museum in Museum.all(conn)],
    )
    number_of_tickets = IntegerField("Number of Tickets", validators=[DataRequired()])
    datetime = DateTimeField(
        "Date and Time", format="%d-%M-%Y", validators=[DataRequired()]
    )
    phone = IntegerField("Phone Number", validators=[DataRequired()])

    submit = SubmitField("Book Now")
