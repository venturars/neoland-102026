from db.connect_db import connect_db
from storage.read_query import read_query


def select_user_by_email(email: str) -> dict | None:
    query = read_query("select_user_by_email")

    connection = connect_db()
    row = connection.execute(query, {"email": email}).fetchone()
    connection.close()

    if row is None:
        return None
    return dict(row)
