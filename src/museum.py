from __future__ import annotations


import sqlite3


class Museum:
    def __init__(
        self,
        conn: sqlite3.Connection,
        *,
        id: int,
        name: str,
        address: str,
        seats: int = -1,
    ):
        self.id = id
        self.name = name
        self.address = address
        self.seats = seats
    
    @classmethod
    def get(cls, conn: sqlite3.Connection, museum_id: int) -> Museum:
        cursor = conn.cursor()
        query = r"SELECT * FROM MUSEUMS WHERE ID = ?"

        result = cursor.execute(query, (museum_id,))
        data = result.fetchone()

        return Museum(conn, **data)
