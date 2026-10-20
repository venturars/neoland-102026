import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { describe, it } from "node:test";
import { crearAlmacenSqlite } from "../queries/sqlite.js";
import {
  DatosInvalidos,
  EmailDuplicado,
  UsuarioNoEncontrado,
} from "../logic/errores.js";
import {
  actualizarUsuario,
  buscarUsuarioPorEmail,
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
  obtenerUsuario,
} from "../logic/operaciones.js";
import { crearAlmacenMemoria } from "./almacen-memoria.js";

describe("usuarios en memoria", () => {
  it("crea un usuario con id de texto y email en minúsculas", async () => {
    const almacen = crearAlmacenMemoria();
    const usuario = await crearUsuario(almacen, {
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
    const almacen = crearAlmacenMemoria();

    await assert.rejects(
      () => crearUsuario(almacen, { nombre: "  ", email: "ana@ejemplo.com" }),
      (error) => {
        assert.ok(error instanceof DatosInvalidos);
        assert.equal(error.message, "El nombre es obligatorio");
        return true;
      },
    );

    await assert.rejects(
      () => crearUsuario(almacen, { nombre: "Ana", email: "ana" }),
      (error) => {
        assert.ok(error instanceof DatosInvalidos);
        assert.equal(error.message, "El email no es válido");
        return true;
      },
    );
  });

  it("no deja repetir el email", async () => {
    const almacen = crearAlmacenMemoria();
    await crearUsuario(almacen, { nombre: "Ana", email: "ana@ejemplo.com" });

    await assert.rejects(
      () =>
        crearUsuario(almacen, { nombre: "Otra", email: "ANA@ejemplo.com" }),
      (error) => {
        assert.ok(error instanceof EmailDuplicado);
        assert.equal(
          error.message,
          "El email ana@ejemplo.com ya está registrado",
        );
        return true;
      },
    );
  });

  it("actualiza, lista, busca y borra", async () => {
    const almacen = crearAlmacenMemoria();
    const ana = await crearUsuario(almacen, {
      nombre: "Ana",
      email: "ana@ejemplo.com",
    });

    const cambiada = await actualizarUsuario(almacen, ana.id, {
      nombre: "Ana Torres",
    });
    assert.equal(cambiada.nombre, "Ana Torres");
    assert.equal(cambiada.email, "ana@ejemplo.com");

    assert.deepEqual(await listarUsuarios(almacen), [cambiada]);
    assert.deepEqual(
      await buscarUsuarioPorEmail(almacen, "Ana@Ejemplo.com"),
      cambiada,
    );
    assert.deepEqual(await obtenerUsuario(almacen, ana.id), cambiada);
    assert.deepEqual(await eliminarUsuario(almacen, ana.id), cambiada);
    assert.deepEqual(await listarUsuarios(almacen), []);
  });

  it("exige un cambio y avisa si el usuario no existe", async () => {
    const almacen = crearAlmacenMemoria();

    await assert.rejects(
      () => actualizarUsuario(almacen, "1", {}),
      (error) => {
        assert.ok(error instanceof DatosInvalidos);
        assert.equal(error.message, "Hay que indicar un nombre o un email");
        return true;
      },
    );

    await assert.rejects(
      () => actualizarUsuario(almacen, "9", { nombre: "Ana" }),
      (error) => {
        assert.ok(error instanceof UsuarioNoEncontrado);
        assert.equal(error.message, "No existe un usuario con id 9");
        return true;
      },
    );

    await assert.rejects(
      () => eliminarUsuario(almacen, "9"),
      (error) => {
        assert.ok(error instanceof UsuarioNoEncontrado);
        assert.equal(error.message, "No existe un usuario con id 9");
        return true;
      },
    );
  });
});

describe("usuarios en SQLite", () => {
  it("crea, cambia y borra en memoria", async () => {
    const almacen = crearAlmacenSqlite(new DatabaseSync(":memory:"));
    const ana = await crearUsuario(almacen, {
      nombre: "Ana",
      email: "ana@ejemplo.com",
    });
    assert.equal(ana.id, "1");

    const cambiada = await actualizarUsuario(almacen, ana.id, {
      email: "ana.torres@ejemplo.com",
    });
    assert.deepEqual(cambiada, {
      id: "1",
      nombre: "Ana",
      email: "ana.torres@ejemplo.com",
    });

    assert.deepEqual(await eliminarUsuario(almacen, ana.id), cambiada);
    assert.equal(await buscarUsuarioPorEmail(almacen, "ana.torres@ejemplo.com"), null);
  });
});
