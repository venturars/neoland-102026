from db.connect_db import connect_db
from storage.read_query import read_query


def insert_user(name: str, email: str, age: int, gender: str) -> int:
    query = read_query("insert_user")

    connection = connect_db()
    cursor = connection.execute(
        query, {"name": name, "email": email, "age": age, "gender": gender}
    )
    connection.commit()
    connection.close()

    return cursor.lastrowid
