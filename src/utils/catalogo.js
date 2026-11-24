/** Rarezas de la más escasa a la más común, como en Figma. */
export function ordenarRarezas(rarezas) {
  return [...rarezas].sort(
    (a, b) => (a.probabilidad ?? 0) - (b.probabilidad ?? 0),
  );
}

/** Cuenta los cromos por el valor de un campo (rareza, tipo…). */
export function contarPor(cromos, campo) {
  return cromos.reduce((cuenta, cromo) => {
    cuenta[cromo[campo]] = (cuenta[cromo[campo]] ?? 0) + 1;
    return cuenta;
  }, {});
}
