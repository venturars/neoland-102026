import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  actualizarUsuario,
  crearAlmacenMemoria,
  crearUsuario,
  DatosInvalidos,
  eliminarUsuario,
  EmailDuplicado,
  listarUsuarios,
  obtenerUsuario,
  UsuarioNoEncontrado,
} from "../src/index.js";

function almacenVacio() {
  return crearAlmacenMemoria();
}

describe("crear usuario", () => {
  it("guarda nombre y email normalizados", async () => {
    const usuario = await crearUsuario(almacenVacio(), {
      nombre: "  Ana Ruiz ",
      email: " Ana@Ejemplo.com ",
    });

    assert.equal(usuario.nombre, "Ana Ruiz");
    assert.equal(usuario.email, "ana@ejemplo.com");
    assert.ok(usuario.id);
  });

  it("rechaza datos vacíos y un email repetido", async () => {
    const almacen = almacenVacio();
    await assert.rejects(
      () => crearUsuario(almacen, { nombre: " ", email: "ana@ejemplo.com" }),
      DatosInvalidos,
    );
    await crearUsuario(almacen, { nombre: "Ana", email: "ana@ejemplo.com" });
    await assert.rejects(
      () => crearUsuario(almacen, { nombre: "Otra Ana", email: "ANA@ejemplo.com" }),
      EmailDuplicado,
    );
  });
});

describe("actualizar usuario", () => {
  it("cambia el nombre y conserva el id", async () => {
    const almacen = almacenVacio();
    const ana = await crearUsuario(almacen, { nombre: "Ana", email: "ana@ejemplo.com" });

    const actualizada = await actualizarUsuario(almacen, ana.id, { nombre: "Ana López" });

    assert.equal(actualizada.id, ana.id);
    assert.equal(actualizada.nombre, "Ana López");
    assert.equal(actualizada.email, "ana@ejemplo.com");
  });

  it("no deja usar el email de otra persona", async () => {
    const almacen = almacenVacio();
    const ana = await crearUsuario(almacen, { nombre: "Ana", email: "ana@ejemplo.com" });
    await crearUsuario(almacen, { nombre: "Luis", email: "luis@ejemplo.com" });

    await assert.rejects(
      () => actualizarUsuario(almacen, ana.id, { email: "luis@ejemplo.com" }),
      EmailDuplicado,
    );
  });

  it("falla si el usuario no existe", async () => {
    await assert.rejects(
      () => actualizarUsuario(almacenVacio(), "999", { nombre: "Nadie" }),
      UsuarioNoEncontrado,
    );
  });
});

describe("eliminar y consultar", () => {
  it("elimina un usuario existente y listar ya no lo devuelve", async () => {
    const almacen = almacenVacio();
    const ana = await crearUsuario(almacen, { nombre: "Ana", email: "ana@ejemplo.com" });
    await crearUsuario(almacen, { nombre: "Luis", email: "luis@ejemplo.com" });

    const borrada = await eliminarUsuario(almacen, ana.id);
    const quedan = await listarUsuarios(almacen);

    assert.equal(borrada.id, ana.id);
    assert.deepEqual(quedan.map((usuario) => usuario.nombre), ["Luis"]);
    await assert.rejects(() => obtenerUsuario(almacen, ana.id), UsuarioNoEncontrado);
  });

  it("no elimina un id desconocido", async () => {
    await assert.rejects(() => eliminarUsuario(almacenVacio(), "999"), UsuarioNoEncontrado);
  });
});
