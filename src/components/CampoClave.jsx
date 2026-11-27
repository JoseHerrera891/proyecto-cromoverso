// US-CRO-S2-03 · Iniciar sesión
import { forwardRef, useState } from "react";
import Icono from "./Icono.jsx";
import TextField from "./TextField.jsx";

/**
 * Campo de contraseña con botón para mostrarla u ocultarla. El botón anuncia
 * su estado con aria-pressed y con su etiqueta.
 */
// US-CRO-S2-03 · C2: botón del ojo con aria-pressed.
const CampoClave = forwardRef(function CampoClave(
  { etiquetaMostrar, etiquetaOcultar, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      ref={ref}
      type={visible ? "text" : "password"}
      autoComplete="current-password"
      accesorio={
        <button
          type="button"
          className="campo-accesorio"
          aria-pressed={visible}
          aria-label={visible ? etiquetaOcultar : etiquetaMostrar}
          onClick={() => setVisible((actual) => !actual)}
        >
          <Icono nombre={visible ? "ojoTachado" : "ojo"} />
        </button>
      }
      {...props}
    />
  );
});

export default CampoClave;
