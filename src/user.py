from __future__ import annotations

import sqlite3
from datetime import datetime

from flask_login import UserMixin


class User(UserMixin):
    def __init__(
        self,
        conn: sqlite3.Connection,
        *,
        id: int,
        name: str,
        email: str,
        password: str,
        created_at: str,
    ):
        self.id = id
        self.name = name
        self.email = email
        self.__password = password
        self.created_at = created_at
    
    @property
    def password(self):
        return self.__password

    @classmethod
    def create(cls, conn: sqlite3.Connection, *, name: str, email: str, password: str):
        cursor = conn.cursor()
        query = r"INSERT INTO USERS  (NAME, EMAIL, PASSWORD) VALUES (?, ?, ?) RETURNING *"

        result = cursor.execute(query, (name, email, password))
        data = result.fetchone()

        conn.commit()

        return User(conn, **data)

    @classmethod
    def from_email(cls, conn: sqlite3.Connection, *, email: str) -> User:
        cursor = conn.cursor()
        query = r"SELECT * FROM USERS WHERE EMAIL = ?"

        result = cursor.execute(query, (email,))
        data = result.fetchone()

        if data is None:
            raise ValueError("user not found")
        
        return User(conn, **data)
    
    @classmethod
    def get(cls, conn: sqlite3.Connection, user_id: int) -> User:
        query = "SELECT * FROM USERS WHERE ID = ?"
        cursor = conn.cursor()

        result = cursor.execute(query, (user_id,))
        data = result.fetchone()

        if data is None:
            raise ValueError("user not found")
        
        return User(conn, **data)