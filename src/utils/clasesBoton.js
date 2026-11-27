// US-CRO-S1-01 · Configurar el proyecto y el sistema de diseño
/**
 * Clases del botón base para usarlas también en enlaces (<Link>) que deben
 * verse como botones.
 * variante: primario | secundario | acento · tamano: p (36) | m (48) | g (60)
 */
export function clasesBoton(variante = "primario", tamano = "m", extra = "") {
  return ["boton", `boton--${variante}`, `boton--${tamano}`, extra]
    .filter(Boolean)
    .join(" ");
}
