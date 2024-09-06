import sqlite3

conn = sqlite3.connect("database.sqlite")

query = "DELETE FROM RAZORPAY_ORDERS"

cursor = conn.execute(query)

conn.commit()
conn.close()
