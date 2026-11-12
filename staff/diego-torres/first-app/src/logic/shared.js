const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name) {
  const limpio = String(name ?? "").trim();
  if (limpio === "") {
    throw new Error("Name is empty");
  }
  return limpio;
}

export function validateEmail(email) {
  const normalizado = String(email ?? "")
    .trim()
    .toLowerCase();
  if (!EMAIL_SHAPE.test(normalizado) || normalizado.length > 64) {
    throw new Error("Email is invalid");
  }
  return normalizado;
}

export function validateNewUser(data) {
  const name = validateName(data?.name);
  const email = validateEmail(data?.email);
  return { name, email };
}

// La copia de salida de un usuario: solo estos cinco campos.
export function copyUser(fila) {
  return {
    id: fila.id,
    name: fila.name,
    email: fila.email,
    createdAt: fila.createdAt,
    updatedAt: fila.updatedAt,
  };
}

// Solo devuelve los campos que llegan. Lo que no llega se queda como estaba.
export function validateChanges(changes) {
  const siguiente = {};
  if (changes?.name !== undefined) {
    siguiente.name = validateName(changes.name);
  }
  if (changes?.email !== undefined) {
    siguiente.email = validateEmail(changes.email);
  }
  return siguiente;
}
