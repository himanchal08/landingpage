import sqlite3
import json

conn = sqlite3.connect("database.sqlite")

query = "SELECT NAME FROM MUSEUMS"

cursor = conn.execute(query)

museums = [row[0].strip() for row in cursor.fetchall()]
print(json.dumps(museums, indent=4))