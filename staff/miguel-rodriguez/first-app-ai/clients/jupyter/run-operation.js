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
    const cells = fields.map((field) => row[field]);
    table.push(cells);
  }
  const renderedTable = table.toString();
  console.log(renderedTable);
}

const inputText = readFileSync(0, "utf8");
const request = JSON.parse(inputText);
const { operation, args } = request;

try {
  let result;
  switch (operation) {
    case "create-users-table":
      createUsersTable();
      console.log("Tabla de usuarios disponible.");
      break;
    case "create-user": {
      const contactInput = args[0];
      result = createUser(contactInput);
      break;
    }
    case "list-users":
      result = listUsers();
      break;
    case "find-user-by-email": {
      const email = args[0];
      result = findUserByEmail(email);
      break;
    }
    case "find-user-by-id": {
      const id = args[0];
      result = findUserById(id);
      break;
    }
    case "find-user-by-name": {
      const name = args[0];
      result = findUserByName(name);
      break;
    }
    case "update-user": {
      const id = args[0];
      const changes = args[1];
      result = updateUser(id, changes);
      break;
    }
    case "delete-user": {
      const id = args[0];
      deleteUser(id);
      console.log("Contacto eliminado. La operación no devuelve datos.");
      break;
    }
    case "users-gender-count":
      result = await usersGenderCount();
      break;
    default:
      throw new Error("Operación desconocida.");
  }

  const resultHasData = result !== undefined;
  if (resultHasData) {
    const operationIsClassifier = operation === "users-gender-count";
    if (operationIsClassifier) {
      showTable([result], ["women", "men", "genderUndefined"]);
    } else {
      const resultIsList = Array.isArray(result);
      let users;
      if (resultIsList) {
        users = result;
      } else {
        users = [result];
      }
      showTable(users, ["id", "name", "email", "createdAt", "updatedAt"]);
    }
  }
} catch (error) {
  const message = error.message;
  console.error(message);
  process.exitCode = 1;
}
