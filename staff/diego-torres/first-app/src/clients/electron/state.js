// Estado que comparten todas las funciones del cliente de escritorio.
// Solo vive en memoria. Al cerrar la ventana se pierde.
export const STATE = {
  // Usuario abierto en la ficha, o null si no hay ninguno.
  currentUser: null,
  // true mientras hay una operación en curso, para ignorar otras acciones.
  isBusy: false,
};
