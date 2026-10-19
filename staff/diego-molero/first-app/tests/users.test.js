import assert from "node:assert/strict";
import test from "node:test";
import { createUser } from "../logic/create-user.js";
import { deleteUser } from "../logic/delete-user.js";
import { listUsers } from "../logic/list-users.js";
import { updateUser } from "../logic/update-user.js";
import { createMemoryUserRepository } from "./helpers/memory-user-repository.js";

// Estas pruebas ejercitan las reglas sin importar la aplicación ni SQLite.
const validInput = { name: "Lucía", email: "lucia@example.com" };

test("crear normaliza los datos, conserva UTF-8 y permite listar y eliminar", () => {
  const repository = createMemoryUserRepository();
  assert.deepEqual(listUsers(repository), { ok: true, users: [] });

  const result = createUser(repository, { name: "  Lucía García  ", email: "  LUCIA@EXAMPLE.COM  " });
  assert.equal(result.ok, true);
  assert.equal(result.user.name, "Lucía García");
  assert.equal(result.user.email, "lucia@example.com");
  assert.deepEqual(listUsers(repository).users, [result.user]);
  assert.deepEqual(deleteUser(repository, result.user.id), { ok: true });
  assert.deepEqual(listUsers(repository).users, []);
  assert.deepEqual(deleteUser(repository, result.user.id), { ok: false, error: "USER_NOT_FOUND" });
});

for (const [label, input, error] of [
  ["sin entrada", undefined, "INVALID_INPUT"],
  ["entrada nula", null, "INVALID_INPUT"],
  ["una lista", [], "INVALID_INPUT"],
  ["un texto", "Lucía", "INVALID_INPUT"],
  ["campos desconocidos", { ...validInput, role: "admin" }, "INVALID_INPUT"],
  ["sin nombre", { email: validInput.email }, "INVALID_NAME"],
  ["nombre vacío", { ...validInput, name: "   " }, "INVALID_NAME"],
  ["nombre numérico", { ...validInput, name: 10 }, "INVALID_NAME"],
  ["nombre nulo", { ...validInput, name: null }, "INVALID_NAME"],
  ["sin correo", { name: validInput.name }, "INVALID_EMAIL"],
  ["correo numérico", { ...validInput, email: 10 }, "INVALID_EMAIL"],
  ["correo nulo", { ...validInput, email: null }, "INVALID_EMAIL"],
  ["correo vacío", { ...validInput, email: "" }, "INVALID_EMAIL"],
  ["correo sin @", { ...validInput, email: "incorrecto" }, "INVALID_EMAIL"],
  ["correo sin parte local", { ...validInput, email: "@example.com" }, "INVALID_EMAIL"],
  ["correo sin dominio", { ...validInput, email: "lucia@" }, "INVALID_EMAIL"],
  ["correo con varios @", { ...validInput, email: "lucia@@example.com" }, "INVALID_EMAIL"],
  ["correo con espacios", { ...validInput, email: "lu cia@example.com" }, "INVALID_EMAIL"],
  ["correo con salto de línea", { ...validInput, email: "lu\ncia@example.com" }, "INVALID_EMAIL"],
  ["correo de 65 caracteres", { ...validInput, email: `${"a".repeat(53)}@example.com` }, "INVALID_EMAIL"],
]) {
  test(`crear rechaza ${label} sin guardar datos`, () => {
    const repository = createMemoryUserRepository();
    assert.deepEqual(createUser(repository, input), { ok: false, error });
    assert.deepEqual(listUsers(repository).users, []);
  });
}

test("el límite de correo admite 64 caracteres", () => {
  const repository = createMemoryUserRepository();
  const result = createUser(repository, { ...validInput, email: `${"a".repeat(52)}@example.com` });
  assert.equal(result.ok, true);
  assert.equal(result.user.email.length, 64);
});

test("crear rechaza correos repetidos tras normalizar mayúsculas y espacios", () => {
  const repository = createMemoryUserRepository();
  createUser(repository, validInput);
  assert.deepEqual(createUser(repository, { name: "Otra persona", email: " LUCIA@example.com " }), {
    ok: false,
    error: "EMAIL_ALREADY_USED",
  });
  assert.equal(listUsers(repository).users.length, 1);
});

test("actualizar solo el nombre conserva correo, identificador y fecha de creación", () => {
  const repository = createMemoryUserRepository();
  const { user } = createUser(repository, validInput);
  const result = updateUser(repository, user.id, { name: "  Lucía García  " });
  assert.equal(result.ok, true);
  assert.equal(result.user.name, "Lucía García");
  assert.equal(result.user.email, user.email);
  assert.equal(result.user.id, user.id);
  assert.equal(result.user.createdAt, user.createdAt);
});

test("actualizar solo el correo conserva el nombre y permite mantener el correo propio", () => {
  const repository = createMemoryUserRepository();
  const { user } = createUser(repository, validInput);
  const result = updateUser(repository, user.id, { email: " NUEVO@example.com " });
  assert.equal(result.user.name, user.name);
  assert.equal(result.user.email, "nuevo@example.com");
  assert.equal(updateUser(repository, user.id, { email: " NUEVO@EXAMPLE.COM " }).ok, true);
});

test("actualizar rechaza el correo de otro usuario y conserva los datos anteriores", () => {
  const repository = createMemoryUserRepository();
  const { user } = createUser(repository, validInput);
  createUser(repository, { name: "Diego", email: "diego@example.com" });
  assert.deepEqual(updateUser(repository, user.id, { email: " DIEGO@EXAMPLE.COM " }), {
    ok: false,
    error: "EMAIL_ALREADY_USED",
  });
  assert.deepEqual(repository.findById(user.id), user);
});

for (const [label, changes, error] of [
  ["sin entrada", undefined, "INVALID_INPUT"],
  ["entrada nula", null, "INVALID_INPUT"],
  ["una lista", [], "INVALID_INPUT"],
  ["campos desconocidos", { name: "Nuevo", id: 99 }, "INVALID_INPUT"],
  ["sin campos", {}, "EMPTY_CHANGES"],
  ["sin valores definidos", { name: undefined }, "EMPTY_CHANGES"],
  ["nombre vacío", { name: "  " }, "INVALID_NAME"],
  ["nombre nulo", { name: null }, "INVALID_NAME"],
  ["nombre numérico", { name: 42 }, "INVALID_NAME"],
  ["correo vacío", { email: "" }, "INVALID_EMAIL"],
  ["correo nulo", { email: null }, "INVALID_EMAIL"],
  ["correo numérico", { email: 42 }, "INVALID_EMAIL"],
  ["correo mal formado", { email: "sin-arroba" }, "INVALID_EMAIL"],
  ["correo demasiado largo", { email: `${"a".repeat(53)}@example.com` }, "INVALID_EMAIL"],
]) {
  test(`actualizar rechaza ${label} sin modificar al usuario`, () => {
    const repository = createMemoryUserRepository();
    const { user } = createUser(repository, validInput);
    assert.deepEqual(updateUser(repository, user.id, changes), { ok: false, error });
    assert.deepEqual(repository.findById(user.id), user);
  });
}

test("actualizar un usuario inexistente devuelve un error de negocio", () => {
  assert.deepEqual(updateUser(createMemoryUserRepository(), 99, { name: "Nuevo" }), {
    ok: false,
    error: "USER_NOT_FOUND",
  });
});

for (const id of [undefined, null, "1", 0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
  test(`actualizar y eliminar rechazan el identificador ${String(id)}`, () => {
    const repository = createMemoryUserRepository();
    const { user } = createUser(repository, validInput);
    assert.deepEqual(updateUser(repository, id, { name: "Nuevo" }), { ok: false, error: "INVALID_ID" });
    assert.deepEqual(deleteUser(repository, id), { ok: false, error: "INVALID_ID" });
    assert.deepEqual(repository.findAll(), [user]);
  });
}

test("un conflicto al guardar se devuelve como EMAIL_ALREADY_USED", () => {
  const repository = createMemoryUserRepository();
  const { user } = createUser(repository, validInput);
  const conflict = Object.assign(new Error("Correo ocupado"), { code: "EMAIL_ALREADY_USED" });
  const conflictingRepository = {
    ...repository,
    insert() { throw conflict; },
    update() { throw conflict; },
  };
  assert.deepEqual(createUser(conflictingRepository, { name: "Diego", email: "diego@example.com" }), {
    ok: false,
    error: "EMAIL_ALREADY_USED",
  });
  assert.deepEqual(updateUser(conflictingRepository, user.id, { name: "Nuevo" }), {
    ok: false,
    error: "EMAIL_ALREADY_USED",
  });
});

test("los fallos técnicos se propagan para que el cliente pueda gestionarlos", () => {
  const repository = createMemoryUserRepository();
  const { user } = createUser(repository, validInput);
  const failure = new Error("Almacenamiento no disponible");
  const failingRepository = {
    ...repository,
    insert() { throw failure; },
    update() { throw failure; },
  };
  assert.throws(() => createUser(failingRepository, { name: "Diego", email: "diego@example.com" }),
    (error) => error === failure);
  assert.throws(() => updateUser(failingRepository, user.id, { name: "Nuevo" }),
    (error) => error === failure);
});

test("actualizar controla que el usuario desaparezca entre consultar y guardar", () => {
  const repository = createMemoryUserRepository();
  const { user } = createUser(repository, validInput);
  assert.deepEqual(updateUser({ ...repository, update: () => undefined }, user.id, { name: "Nuevo" }), {
    ok: false,
    error: "USER_NOT_FOUND",
  });
});
