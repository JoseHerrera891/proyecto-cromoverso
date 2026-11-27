// US-CRO-S1-01 · Configurar el proyecto y el sistema de diseño
import { clasesBoton } from "../utils/clasesBoton.js";
import "./Button.css";

/**
 * Botón base del sistema de diseño.
 * variante: primario | secundario | acento · tamano: p (36) | m (48) | g (60)
 */
export default function Button({
  children,
  variante = "primario",
  tamano = "m",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      className={clasesBoton(variante, tamano, className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
