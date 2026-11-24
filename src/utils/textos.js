/** Reemplaza {variable} en un texto de la API por su valor. */
export function insertarVariables(plantilla, variables) {
  return Object.entries(variables).reduce(
    (texto, [clave, valor]) => texto.replaceAll(`{${clave}}`, String(valor)),
    plantilla,
  );
}

/** Elige la forma singular o plural ({ uno, otro }) de un texto de la API. */
export function plural(formas, cantidad) {
  const plantilla = cantidad === 1 ? formas?.uno : formas?.otro;
  return plantilla ? insertarVariables(plantilla, { cantidad }) : "";
}
