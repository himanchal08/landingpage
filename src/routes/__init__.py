from __future__ import annotations

from flask import render_template, request
from flask_login import current_user, login_required
from razorpay.errors import SignatureVerificationError

from src import RAZORPAY_KEY, app, conn, razorpay_client, csrf
from src.forms import BookingForm
from src.ticket import Ticket
from urllib.parse import unquote
from datetime import datetime


@app.route("/index.html")
@app.route("/")
def index():
    return render_template("index.html", current_user=current_user)


@app.route("/book-ticket", methods=["GET", "POST"])
@login_required
def book_ticket():
    form: BookingForm = BookingForm()
    if form.validate_on_submit():
        museum_id = form.museum.data
        number_of_tickets = form.number_of_tickets.data
        dt = form.datetime.data

        ticket = Ticket.book(
            conn=conn,
            price=number_of_tickets * 50,
            user=current_user,
            date=dt,
            museum_id=int(museum_id),
        )
        api_response = ticket.checkout(razorpay_client=razorpay_client)

        return render_template(
            "payment.html",
            amount=api_response["amount"],
            order_id=api_response["id"],
            razorpay_key=RAZORPAY_KEY,
            current_user=current_user,
        )
    
    if request.args and request.method == "GET":
        price = request.args.get('price')
        ticket = Ticket.book(
            conn=conn,
            price=int(price),
            user=current_user,
            date=datetime.utcnow(),
            museum_id=233,
        )

        api_response = ticket.checkout(razorpay_client=razorpay_client)

        return render_template(
            "payment.html",
            amount=api_response["amount"],
            order_id=api_response["id"],
            razorpay_key=RAZORPAY_KEY,
            current_user=current_user,
        )

    return render_template("book-ticket.html", current_user=current_user, form=form)


@app.route("/payment-success")
def payment_success():
    return render_template(
        "status.html", current_user=current_user, status="ok"
    )


@app.route("/payment-failure")
def payment_failure():
    return render_template(
        "status.html", current_user=current_user, status="failed"
    )


@app.route("/razorpay-webhook", methods=["POST"])
@app.route("/razorpay-webhook/", methods=["POST"])
def razorpay_webhook():
    data = request.get_json()

    try:
        razorpay_client.utility.verify_payment_signature(data)
        ticket: Ticket = Ticket.from_razorpay_order_id(conn, data["razorpay_order_id"])
        ticket.update()
    except SignatureVerificationError:
        return {"status": "error"}, 400

    return {"status": "ok"}, 200

csrf.exempt(razorpay_webhook)


from .login import *  # noqa
from .register import *  # noqa
