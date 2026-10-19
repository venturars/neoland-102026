import { DatosInvalidos } from "./src/dominio/errores.js";
import { validarCambios, validarUsuarioNuevo } from "./src/dominio/usuario.js";

function probar(titulo, accion) {
  try {
    console.log(titulo, accion());
  } catch (error) {
    if (error instanceof DatosInvalidos) {
      console.log(titulo, error.message);
      return;
    }
    throw error;
  }
}

probar("usuario nuevo:", () =>
  validarUsuarioNuevo({ nombre: "  Ana Ruiz ", email: " Ana@Ejemplo.com " }),
);

probar("nombre vacío:", () =>
  validarUsuarioNuevo({ nombre: " ", email: "ana@ejemplo.com" }),
);

probar("email inválido:", () =>
  validarUsuarioNuevo({ nombre: "Ana Ruiz", email: "ana" }),
);

const ana = validarUsuarioNuevo({ nombre: "Ana Ruiz", email: "ana@ejemplo.com" });

probar("cambiar solo el nombre:", () => validarCambios(ana, { nombre: "Ana López" }));
probar("cambiar solo el email:", () => validarCambios(ana, { email: " ANA.LOPEZ@ejemplo.com " }));
probar("cambio vacío:", () => validarCambios(ana, {}));
