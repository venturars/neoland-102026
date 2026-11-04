// Estado que comparten todas las funciones del cliente web.
// Solo vive en memoria. Al recargar la página se vuelve a la selección.
export const STATE = {
  // Usuario con el que se está trabajando, o null si no hay ninguno.
  selectedUser: null,
  // true mientras hay una operación en curso, para ignorar otras acciones.
  isBusy: false,
};
