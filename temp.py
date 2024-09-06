import requests
from bs4 import BeautifulSoup, Tag

URL = "https://en.wikipedia.org/wiki/List_of_museums_in_India"

res = requests.get(URL)

with open("wiki.html", "w+", encoding="utf-8") as file:
    file.write(res.text)

with open("wiki.html", encoding="utf-8") as file:
    html = file.read()
 
soup = BeautifulSoup(html, features="html.parser")
tables = soup.find_all('table')
 
def get_info(table: Tag):
    tbody = table.find('tbody')
    trs = tbody.find_all('tr')[1:]
 
    def get_td(tr: Tag):
        tds = tr.find_all("td")
        if not tds:
            return
        if len(tds) != 4:
            return
 
        data = {"name": None, "address": None}
 
        data["name"] = tds[0].text
        data["address"] = f"{tds[1].text.strip()}, {tds[2].text.strip()}"
 
        return data
 
    ls = []
    for tr in trs:
        if d := get_td(tr):
            ls.append(d)
 
    return ls
 
master_ls = []
 
for table in tables:
    info = get_info(table)
    master_ls.extend(info)
 
 
import sqlite3
 
conn = sqlite3.Connection("database.sqlite")

with open('sql.sql') as file:
    conn.executescript(file.read())

 
query = "INSERT INTO MUSEUMS (NAME, ADDRESS) VALUES (?, ?)"
 
for data in master_ls:
    conn.execute(query, (data["name"], data["address"]))
    print('INSERTED', data["name"])
 
conn.commit()
conn.close()