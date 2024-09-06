from __future__ import annotations

import sqlite3
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    import razorpay

    from .museum import Museum
    from .user import User


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
        self.conn = conn
        self.id = id
        self.user_id = user_id
        self.price = price
        self.museum_id: int = museum_id
        self.date = date

        self._museum: Museum | None = None

    @property
    def user(self) -> User:
        from .user import User

        return User.get(self.conn, self.user_id)

    @property
    def museum(self) -> Museum:
        from .museum import Museum

        if self._museum:
            return self._museum

        museum = Museum.get(self.conn, self.museum_id)
        self._museum = museum
        return self._museum

    @classmethod
    def book(
        cls,
        conn: sqlite3.Connection,
        *,
        price: float,
        user: User,
        date: datetime,
        museum_id: int,
    ) -> Ticket:
        query = r"INSERT INTO TICKETS (USER_ID, MUSEUM_ID, DATE, PRICE) VALUES (?, ?, ?, ?) RETURNING *"
        cur = conn.cursor()

        result = cur.execute(query, (user.id, museum_id, date, price))
        data = result.fetchone()

        conn.commit()

        return Ticket(conn, **data)

    def checkout(self, razorpay_client: razorpay.Client):
        notes = {
            "museum_id": self.museum_id,
            "museum_name": self.museum.name,
            "museum_address": self.museum.address,
            "ticket_id": self.id,
            "user_id": self.user.id,
            "user_name": self.user.name,
            "user_email": self.user.email,
        }
        final_payload = {
            "amount": int(self.price * 100),
            "currency": "INR",
            "notes": notes,
        }
        api_response = razorpay_client.order.create(final_payload)

        order_id = api_response["id"]
        query = "INSERT INTO RAZORPAY_ORDERS (ORDER_ID, TICKET_ID, USER_ID) VALUES (?, ?, ?)"
        cur = self.conn.cursor()
        cur.execute(query, (order_id, self.id, self.user_id))
        self.conn.commit()

        assert self.__check_api_response(
            full_paylaod=final_payload, api_response=api_response
        )

        return api_response

    def __check_api_response(self, *, full_paylaod: dict, api_response: dict) -> bool:
        amount_correct = full_paylaod["amount"] == api_response["amount"]
        currency_correct = full_paylaod["currency"] == api_response["currency"] == "INR"
        notes_correct = full_paylaod["notes"] == api_response["notes"]
        status_correct = api_response["status"] == "created"

        return amount_correct and currency_correct and notes_correct and status_correct

    def update(self):
        query = "UPDATE RAZORPAY_ORDERS SET ORDER_STATUS = 'PAID' WHERE TICKET_ID = ? AND ORDER_STATUS = ?"

        cur = self.conn.cursor()
        cur.execute(query, (self.id, "UNPAID"))

        self.conn.commit()

    @classmethod
    def from_razorpay_order_id(cls, conn: sqlite3.Connection, order_id: str) -> Ticket:
        query = r"SELECT * FROM TICKETS WHERE ID = (SELECT TICKET_ID FROM RAZORPAY_ORDERS WHERE ORDER_ID = ?)"

        cur = conn.cursor()
        result = cur.execute(query, (order_id,))

        data = result.fetchone()

        return Ticket(conn, **data)
