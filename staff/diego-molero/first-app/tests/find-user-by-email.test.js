import assert from "node:assert/strict";
import test from "node:test";
import { createUser } from "../logic/create-user.js";
import { findUserByEmail } from "../logic/find-user-by-email.js";
import { createMemoryUserRepository } from "./helpers/memory-user-repository.js";

// Prueba el contrato de búsqueda sin abrir SQLite ni importar la aplicación.
test("buscar normaliza el correo y devuelve solo los cinco campos públicos", () => {
  const expected = {
    id: 1,
    name: "Lucía García",
    email: "lucia@example.com",
    createdAt: "2026-10-19T10:00:00.000Z",
    updatedAt: "2026-10-19T10:00:00.000Z",
  };
  const stored = Object.assign(Object.create(null), expected, { internalField: "privado" });
  const repository = {
    findByEmail(email) {
      assert.equal(email, "lucia@example.com");
      return stored;
    },
  };

  const result = findUserByEmail(repository, "  LUCIA@EXAMPLE.COM  ");
  assert.deepEqual(result, { ok: true, user: expected });
  assert.equal(Object.getPrototypeOf(result.user), Object.prototype);
  result.user.name = "Cambio en el cliente";
  assert.equal(stored.name, expected.name);
});

for (const [label, email] of [
  ["sin entrada", undefined],
  ["entrada nula", null],
  ["entrada numérica", 42],
  ["entrada booleana", false],
  ["una lista", ["lucia@example.com"]],
  ["un objeto", { email: "lucia@example.com" }],
  ["correo vacío", ""],
  ["solo espacios", "   "],
  ["correo sin @", "sin-arroba"],
  ["sin parte local", "@example.com"],
  ["sin dominio", "lucia@"],
  ["varios @", "lucia@@example.com"],
  ["espacios interiores", "lu cia@example.com"],
  ["un salto de línea interior", "lu\ncia@example.com"],
  ["un tabulador interior", "lucia@exam\tple.com"],
  ["65 caracteres", `${"a".repeat(53)}@example.com`],
]) {
  test(`buscar rechaza ${label} antes de consultar el repositorio`, () => {
    const repository = {
      findByEmail() {
        assert.fail("Una entrada inválida no debe consultar el repositorio.");
      },
    };
    assert.deepEqual(findUserByEmail(repository, email), { ok: false, error: "INVALID_EMAIL" });
  });
}

test("buscar admite 64 caracteres después de recortar y normalizar", () => {
  const repository = createMemoryUserRepository();
  const email = `${"a".repeat(52)}@example.com`;
  const created = createUser(repository, { name: "Lucía", email });
  assert.equal(created.ok, true);
  assert.deepEqual(findUserByEmail(repository, `  ${email.toUpperCase()}  `), created);
});

test("un correo válido inexistente devuelve USER_NOT_FOUND sin crear datos", () => {
  const repository = createMemoryUserRepository();
  assert.deepEqual(findUserByEmail(repository, "nadie@example.com"), {
    ok: false,
    error: "USER_NOT_FOUND",
  });
  assert.deepEqual(repository.findAll(), []);
});

test("buscar devuelve el usuario correspondiente y conserva todos los registros", () => {
  const repository = createMemoryUserRepository();
  createUser(repository, { name: "Diego", email: "diego@example.com" });
  const created = createUser(repository, { name: "Lucía", email: "lucia@example.com" });
  const before = repository.findAll();

  assert.deepEqual(findUserByEmail(repository, " LUCIA@example.com "), created);
  assert.deepEqual(repository.findAll(), before);
});

test("un fallo técnico al buscar se propaga y no se presenta como usuario inexistente", () => {
  const failure = new Error("Almacenamiento no disponible");
  const repository = {
    findByEmail() {
      throw failure;
    },
  };
  assert.throws(() => findUserByEmail(repository, "lucia@example.com"),
    (error) => error === failure);
});
