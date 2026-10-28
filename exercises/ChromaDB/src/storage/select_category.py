from db.connect_db import connect_db
from storage.read_query import read_query


def select_category(category_id: int) -> dict | None:
    query = read_query("select_category")

    connection = connect_db()
    row = connection.execute(query, {"id": category_id}).fetchone()
    connection.close()

    if row is None:
        return None
    return dict(row)
