from db.connect_db import connect_db
from storage.read_query import read_query


def delete_user(user_id: int) -> int:
    query = read_query("delete_user")

    connection = connect_db()
    cursor = connection.execute(query, {"id": user_id})
    connection.commit()
    connection.close()

    return cursor.rowcount
