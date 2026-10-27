import { readFileSync } from "node:fs";
import Table from "cli-table3";
import { createUsersTable } from "../../queries/users.js";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserByEmail } from "../../logic/find-user-by-email.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { findUserByName } from "../../logic/find-user-by-name.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { usersGenderCount } from "../../logic/users-gender-count.js";

// Presentation belongs to this client; returned values stay unchanged.
function showTable(rows, fields) {
  const table = new Table({ head: fields, style: { head: ["cyan"] } });
  for (const row of rows) {
    table.push(fields.map((field) => row[field]));
  }
  console.log(table.toString());
}

const { operation, args } = JSON.parse(readFileSync(0, "utf8"));

try {
  let result;
  switch (operation) {
    case "create-users-table":
      createUsersTable();
      console.log("Tabla de usuarios disponible.");
      break;
    case "create-user":
      result = createUser(args[0]);
      break;
    case "list-users":
      result = listUsers();
      break;
    case "find-user-by-email":
      result = findUserByEmail(args[0]);
      break;
    case "find-user-by-id":
      result = findUserById(args[0]);
      break;
    case "find-user-by-name":
      result = findUserByName(args[0]);
      break;
    case "update-user":
      result = updateUser(args[0], args[1]);
      break;
    case "delete-user":
      deleteUser(args[0]);
      console.log("Contacto eliminado. La operación no devuelve datos.");
      break;
    case "users-gender-count":
      result = await usersGenderCount();
      break;
    default:
      throw new Error("Operación desconocida.");
  }

  if (result !== undefined) {
    if (operation === "users-gender-count") {
      showTable([result], ["women", "men", "genderUndefined"]);
    } else {
      const users = Array.isArray(result) ? result : [result];
      showTable(users, ["id", "name", "email", "createdAt", "updatedAt"]);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
