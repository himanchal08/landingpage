from __future__ import annotations

import sqlite3
from typing import TYPE_CHECKING

from datetime import datetime

if TYPE_CHECKING:
    from .user import User
    from .museum import Museum

class Ticket:
    def __init__(
        self,
        conn: sqlite3.Connection,
        *,
        id: int,
        user_id: int,
        price: float,
        museum_id: int,
        date: str | None = None,
    ):
        self.id = id
        self.user_id = user_id
        self.float = float
        self.museum_id: int
        self.date = date
    
    @property
    def user(self) -> User:
        from .user import User

        return User.get(conn, self.user_id)
    
    @property
    def museum(self) -> Museum:
        from .museum import Museum

        return Museum.get(conn, self.museum_id)
    
    @classmethod
    def book(cls, conn: sqlite3.Connection, *, price: float, user: User, date: datetime, museum_id: int) -> Ticket:
        query = r"INSERT INTO TICKETS (USER_ID, MUSEUM_ID, DATE, PRICE) VALUES (?, ?, ?, ?) RETURNING *"
        cur = conn.cursor()

        result = cur.execute(query, (user.id, museum_id, datetime, price))
        data = result.fetchone()

        conn.commit()

        return Ticket(conn, **data)
        