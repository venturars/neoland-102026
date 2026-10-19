import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createApp } from "../app.js";
import { openDatabase } from "../db/connection.js";
import { createSqliteUserRepository } from "../repositories/sqlite-user-repository.js";

// Las pruebas de integración usan bases aisladas y nunca db/users.sqlite.
test("SQLite permite el ciclo completo con textos UTF-8 y consultas parametrizadas", (t) => {
  const app = createApp({ databasePath: ":memory:" });
  t.after(() => app.close());
  const name = "Lucía O'Connor'); DROP TABLE users; --";
  const created = app.createUser({ name, email: " LUCIA@EXAMPLE.COM " });
  assert.equal(created.ok, true);
  assert.equal(created.user.name, name);
  assert.equal(created.user.email, "lucia@example.com");
  assert.equal(Object.getPrototypeOf(created.user), Object.prototype);
  assert.match(created.user.createdAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

  const updated = app.updateUser(created.user.id, { name: "Lucía García" });
  assert.equal(updated.ok, true);
  assert.equal(updated.user.email, created.user.email);
  assert.equal(updated.user.createdAt, created.user.createdAt);
  assert.equal(app.listUsers().users.length, 1);
  assert.deepEqual(app.deleteUser(created.user.id), { ok: true });
  assert.deepEqual(app.listUsers(), { ok: true, users: [] });
  assert.deepEqual(app.deleteUser(created.user.id), { ok: false, error: "USER_NOT_FOUND" });
});

test("una base de archivo conserva los cambios entre aperturas y permite inicializar de nuevo", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "diego-first-app-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const databasePath = join(directory, "users.sqlite");
  let saved;

  const first = createApp({ databasePath });
  try {
    const created = first.createUser({ name: "Lucía", email: "lucia@example.com" });
    assert.equal(created.ok, true);
    const updated = first.updateUser(created.user.id, { name: "Lucía García" });
    assert.equal(updated.ok, true);
    saved = updated.user;
  } finally {
    first.close();
  }

  const second = createApp({ databasePath });
  try {
    assert.deepEqual(second.listUsers().users, [saved]);
    assert.deepEqual(second.findUserByEmail("  LUCIA@EXAMPLE.COM  "), { ok: true, user: saved });
    assert.deepEqual(second.deleteUser(saved.id), { ok: true });
  } finally {
    second.close();
  }

  const third = createApp({ databasePath });
  try {
    assert.deepEqual(third.listUsers().users, []);
    assert.deepEqual(third.findUserByEmail("lucia@example.com"), {
      ok: false,
      error: "USER_NOT_FOUND",
    });
  } finally {
    third.close();
  }
});

test("SQLite rechaza correos duplicados al crear y actualizar, conservando los datos", (t) => {
  const app = createApp({ databasePath: ":memory:" });
  t.after(() => app.close());
  const first = app.createUser({ name: "Lucía", email: "lucia@example.com" });
  app.createUser({ name: "Diego", email: "diego@example.com" });
  assert.deepEqual(app.createUser({ name: "Otra persona", email: " LUCIA@example.com " }), {
    ok: false,
    error: "EMAIL_ALREADY_USED",
  });
  assert.deepEqual(app.updateUser(first.user.id, { email: " DIEGO@example.com " }), {
    ok: false,
    error: "EMAIL_ALREADY_USED",
  });
  assert.deepEqual(app.listUsers().users[0], first.user);
  assert.equal(app.updateUser(first.user.id, { email: " LUCIA@example.com " }).ok, true);
});

test("la restricción UNIQUE del repositorio se traduce también sin la comprobación previa", (t) => {
  const db = openDatabase(":memory:");
  t.after(() => db.close());
  const repository = createSqliteUserRepository(db);
  repository.insert({ name: "Lucía", email: "lucia@example.com" });
  const second = repository.insert({ name: "Diego", email: "diego@example.com" });
  assert.throws(() => repository.insert({ name: "Otra", email: "lucia@example.com" }),
    { code: "EMAIL_ALREADY_USED" });
  assert.throws(() => repository.update({ ...second, email: "lucia@example.com" }),
    { code: "EMAIL_ALREADY_USED" });
  assert.equal(repository.findAll().length, 2);
  assert.equal(repository.findById(second.id).email, "diego@example.com");
});

test("actualizar renueva updatedAt en UTC y conserva createdAt", (t) => {
  const db = openDatabase(":memory:");
  t.after(() => db.close());
  const repository = createSqliteUserRepository(db);
  const user = repository.insert({ name: "Lucía", email: "lucia@example.com" });
  const previousDate = "2000-01-01T00:00:00.000Z";
  db.prepare("UPDATE users SET createdAt = :date, updatedAt = :date WHERE id = :id")
    .run({ date: previousDate, id: user.id });

  const updated = repository.update({ id: user.id, name: "Lucía García", email: user.email });
  assert.equal(updated.createdAt, previousDate);
  assert.notEqual(updated.updatedAt, previousDate);
  assert.match(updated.updatedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
});

test("buscar y modificar un usuario inexistente no inventa registros", (t) => {
  const db = openDatabase(":memory:");
  t.after(() => db.close());
  const repository = createSqliteUserRepository(db);
  assert.equal(repository.findById(99), undefined);
  assert.equal(repository.findByEmail("nadie@example.com"), undefined);
  assert.equal(repository.update({ id: 99, name: "Nadie", email: "nadie@example.com" }), undefined);
  assert.equal(repository.remove(99), false);
  assert.deepEqual(repository.findAll(), []);
});

// Verifica la nueva operación a través de app.js y una base SQLite real aislada.
test("buscar por correo en SQLite no modifica datos y refleja actualizaciones y borrados", (t) => {
  const app = createApp({ databasePath: ":memory:" });
  t.after(() => app.close());
  app.createUser({ name: "Diego", email: "diego@example.com" });
  const created = app.createUser({ name: "Lucía O'Connor", email: "o'connor@example.com" });
  assert.equal(created.ok, true);
  const before = app.listUsers();

  const found = app.findUserByEmail("  O'CONNOR@EXAMPLE.COM  ");
  assert.deepEqual(found, created);
  found.user.name = "Cambio en el cliente";
  assert.deepEqual(app.findUserByEmail("o'connor@example.com"), created);
  assert.deepEqual(app.findUserByEmail("sin-arroba"), { ok: false, error: "INVALID_EMAIL" });
  assert.deepEqual(app.findUserByEmail(null), { ok: false, error: "INVALID_EMAIL" });
  assert.deepEqual(app.findUserByEmail("missing'OR'1'='1@example.com"), {
    ok: false,
    error: "USER_NOT_FOUND",
  });
  assert.deepEqual(app.listUsers(), before);

  const updated = app.updateUser(created.user.id, { email: "nuevo@example.com" });
  assert.equal(updated.ok, true);
  assert.deepEqual(app.findUserByEmail("o'connor@example.com"), {
    ok: false,
    error: "USER_NOT_FOUND",
  });
  assert.deepEqual(app.findUserByEmail(" NUEVO@example.com "), updated);
  assert.deepEqual(app.deleteUser(created.user.id), { ok: true });
  assert.deepEqual(app.findUserByEmail("nuevo@example.com"), {
    ok: false,
    error: "USER_NOT_FOUND",
  });
});
