from __future__ import annotations

import sqlite3

from flask_wtf import FlaskForm
from wtforms import EmailField, PasswordField, SubmitField, StringField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError

from src.user import User


class RegisterForm(FlaskForm):
    def __init__(self, connection: sqlite3.Connection, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.conn = connection

    name = StringField("", validators=[DataRequired()])
    email = EmailField("", validators=[DataRequired(), Email()])
    password = PasswordField("", validators=[DataRequired(), Length(min=8)])
    confirm_password = PasswordField(
        "", validators=[DataRequired(), EqualTo("password")]
    )

    submit = SubmitField("Register")

    def validate_email(self, email: EmailField):
        assert email.data

        str_email = email.data.lower()

        try:
            if User.from_email(self.conn, email=str_email):
                raise ValidationError("Email already registered")
        except ValueError:
            return True

        return True