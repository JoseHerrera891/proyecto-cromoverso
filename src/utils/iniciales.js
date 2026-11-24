/** Iniciales del nombre para el avatar: «Laura Cardona» → «LC». */
export function iniciales(nombre = "") {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toLocaleUpperCase() ?? "")
    .join("");
}
