export const UPDATE =
  "UPDATE users\nSET name = :name, email = :email, updatedAt = datetime('now', 'localtime')\nWHERE id = :id\nRETURNING *\n";
