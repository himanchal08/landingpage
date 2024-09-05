from __future__ import annotations

from flask import render_template
from flask_login import current_user

from src import app
from src.forms import BookingForm


@app.route("/index.html")
@app.route("/")
def index():
    return render_template("index.html", current_user=current_user)


@app.route("/book-ticket")
def book_ticket():
    form: BookingForm = BookingForm()
    return render_template("book-ticket.html", current_user=current_user, form=form)


from .login import *
from .register import *
