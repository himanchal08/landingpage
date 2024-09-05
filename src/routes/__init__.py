from __future__ import annotations

from flask import render_template
from flask_login import current_user

from src import app


@app.route("/index.html")
@app.route("/")
def index():
    return render_template("index.html", current_user=current_user)


from .login import *
from .register import *
