from db.connect_db import connect_db
from storage.read_query import read_query


def select_users() -> list[dict]:
    query = read_query("select_users")

    connection = connect_db()
    rows = connection.execute(query).fetchall()
    connection.close()

    users = []
    for row in rows:
        users.append(dict(row))
    return users
