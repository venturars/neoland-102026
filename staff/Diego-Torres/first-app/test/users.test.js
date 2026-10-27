import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { describe, it } from "node:test";
import { createSqliteStore } from "../queries/users.js";
import {
  updateUser,
  findUserByEmail,
  findUserByName,
  usersGenderCount,
  createUser,
  deleteUser,
  listUsers,
  findUserById,
} from "../logic/index.js";
import { createMemoryStore } from "./memory-store.js";

describe("usuarios en memoria", () => {
  it("crea un usuario con id de texto y email en minúsculas", async () => {
    const almacen = createMemoryStore();
    const usuario = await createUser(almacen, {
      nombre: "  Ana  ",
      email: "Ana@Ejemplo.com",
    });

    assert.deepEqual(usuario, {
      id: "1",
      nombre: "Ana",
      email: "ana@ejemplo.com",
    });
  });

  it("rechaza nombre vacío y email mal formado", async () => {
    const almacen = createMemoryStore();

    await assert.rejects(
      () => createUser(almacen, { nombre: "  ", email: "ana@ejemplo.com" }),
      (error) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "Name is required");
        return true;
      },
    );

    await assert.rejects(
      () => createUser(almacen, { nombre: "Ana", email: "ana" }),
      (error) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "Email is invalid");
        return true;
      },
    );
  });

  it("no deja repetir el email", async () => {
    const almacen = createMemoryStore();
    await createUser(almacen, { nombre: "Ana", email: "ana@ejemplo.com" });

    await assert.rejects(
      () =>
        createUser(almacen, { nombre: "Otra", email: "ANA@ejemplo.com" }),
      (error) => {
        assert.ok(error instanceof Error);
        assert.equal(
          error.message,
          "Email ana@ejemplo.com is already registered",
        );
        return true;
      },
    );
  });

  it("actualiza, lista, busca y borra", async () => {
    const almacen = createMemoryStore();
    const ana = await createUser(almacen, {
      nombre: "Ana",
      email: "ana@ejemplo.com",
    });

    const cambiada = await updateUser(almacen, ana.id, {
      nombre: "Ana Torres",
    });
    assert.equal(cambiada.nombre, "Ana Torres");
    assert.equal(cambiada.email, "ana@ejemplo.com");

    assert.deepEqual(await listUsers(almacen), [cambiada]);
    assert.deepEqual(
      await findUserByEmail(almacen, "Ana@Ejemplo.com"),
      cambiada,
    );
    assert.deepEqual(await findUserById(almacen, ana.id), cambiada);
    assert.deepEqual(await deleteUser(almacen, ana.id), cambiada);
    assert.deepEqual(await listUsers(almacen), []);
  });

  it("exige un cambio y avisa si el usuario no existe", async () => {
    const almacen = createMemoryStore();

    await assert.rejects(
      () => updateUser(almacen, "1", {}),
      (error) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "A name or an email is required");
        return true;
      },
    );

    await assert.rejects(
      () => updateUser(almacen, "9", { nombre: "Ana" }),
      (error) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "There is no user with id 9");
        return true;
      },
    );

    await assert.rejects(
      () => deleteUser(almacen, "9"),
      (error) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "There is no user with id 9");
        return true;
      },
    );
  });

  it("busca por nombre y, sin usuarios, no clasifica", async () => {
    const vacio = createMemoryStore();
    assert.deepEqual(await usersGenderCount(vacio), {
      women: 0,
      men: 0,
      genderUndefined: 0,
    });

    const almacen = createMemoryStore();
    const ana = await createUser(almacen, {
      nombre: "Ana",
      email: "ana@ejemplo.com",
    });
    assert.deepEqual(await findUserByName(almacen, "  Ana "), [ana]);
    assert.deepEqual(await findUserByName(almacen, "Nadie"), []);
  });
});

describe("usuarios en SQLite", () => {
  it("crea, cambia y borra en memoria", async () => {
    const almacen = createSqliteStore(new DatabaseSync(":memory:"));
    const ana = await createUser(almacen, {
      nombre: "Ana",
      email: "ana@ejemplo.com",
    });
    assert.equal(ana.id, "1");

    const cambiada = await updateUser(almacen, ana.id, {
      email: "ana.torres@ejemplo.com",
    });
    assert.deepEqual(cambiada, {
      id: "1",
      nombre: "Ana",
      email: "ana.torres@ejemplo.com",
    });

    assert.deepEqual(await deleteUser(almacen, ana.id), cambiada);
    assert.equal(await findUserByEmail(almacen, "ana.torres@ejemplo.com"), null);
  });
});
