import sqlite3

from flask import Flask
from flask_login import LoginManager
from flask_wtf import CSRFProtect

from .utils import sqlite_row_factory

app = Flask(__name__)

conn = sqlite3.connect("database.sqlite", check_same_thread=False)
login_manager = LoginManager(app)

app.secret_key = f"SUPER SECRET KEY"
csrf = CSRFProtect(app)

login_manager.init_app(app)

with open("sql.sql") as f:
    conn.executescript(f.read())

conn.row_factory = sqlite_row_factory

from .login_manager import *
from .routes import *

