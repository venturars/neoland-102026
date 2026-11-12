from db.connect_db import connect_db
from storage.read_query import read_query


def update_user(user_id: int, name: str, email: str, age: int, gender: str) -> int:
    query = read_query("update_user")

    connection = connect_db()
    cursor = connection.execute(query, {"id": user_id, "name": name, "email": email, "age": age, "gender": gender})
    connection.commit()
    connection.close()

    return cursor.rowcount
