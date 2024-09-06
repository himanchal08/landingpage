from __future__ import annotations

import os
import sqlite3

import razorpay
from dotenv import load_dotenv
from flask import Flask
from flask_login import LoginManager
from flask_wtf import CSRFProtect

from .utils import sqlite_row_factory

app = Flask(__name__)

load_dotenv()
conn = sqlite3.connect("database.sqlite", check_same_thread=False)
login_manager = LoginManager(app)

app.secret_key = "SUPER SECRET KEY"
RAZORPAY_KEY = os.getenv("KEY_ID")
RAZORPAY_SECRET = os.getenv("KEY_SECRET")
csrf = CSRFProtect(app)

login_manager.init_app(app)

with open("sql.sql") as f:
    conn.executescript(f.read())

conn.row_factory = sqlite_row_factory
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY, RAZORPAY_SECRET))
razorpay_client.set_app_details({"title": "FitCoders App", "version": "1.0"})

from .login_manager import *  # noqa
from .routes import *  # noqa
