from __future__ import annotations

import json

from flask_wtf import FlaskForm
from wtforms import DateTimeField, IntegerField, SelectField, SubmitField
from wtforms.validators import DataRequired, Length

with open("src/static/states.json") as file:
    STATES: dict[str, list[str]] = json.load(file)

CITIES = [city for cities in STATES.values() for city in cities]

with open("src/static/museums.json") as file:
    MUSEUMS: dict[str, list[str]] = json.load(file)

class BookingForm(FlaskForm):
    state = SelectField(
        "Select State",
        choices=[
            (state, state)
            for state in STATES
            if state != "" and "district" not in state.lower()
        ],
    )
    city = SelectField("Select City", choices=CITIES)
    museum = SelectField("Select Museum", choices=MUSEUMS)
    number_of_tickets = IntegerField(
        "Number of Tickets", validators=[DataRequired(), Length(min=1)]
    )
    datetime = DateTimeField(
        "Date and Time", format="%Y-%m-%d %H:%M", validators=[DataRequired()]
    )
    phone = IntegerField("Phone Number", validators=[DataRequired()])

    submit = SubmitField("Book Now")

    def validate_city(self, city: SelectField):
        assert city.data

        if city.data not in STATES[self.state.data]:
            raise ValueError("Invalid city")

        return True

    def validate_museum(self, museum: SelectField):
        assert museum.data

        query = "SELECT NAME FROM MUSEUMS WHERE CITY = ?"
        result = self.conn.execute(query, (self.city.data,))
        rows = result.fetchall()

        museums = [row[0] for row in rows]

        if museum.data not in museums:
            raise ValueError("Invalid museum")

        return True
