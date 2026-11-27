// US-CRO-S2-01 · Detalle de un cromo
// Arte exportado de Figma («Imágenes para exportar» › cromos). Cada archivo se
// llama como el id del cromo en la API. Los cromos sin arte se dibujan en SVG
// con ilustracion.colorBase e ilustracion.figura.
const archivos = import.meta.glob("../assets/cromos/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const ARTE = {};
for (const [ruta, url] of Object.entries(archivos)) {
  const [, id, doble] = ruta.match(/\/(CV-\d+)(@2x)?\.webp$/) ?? [];
  if (!id) continue;
  ARTE[id] = { ...ARTE[id], [doble ? "x2" : "x1"]: url };
}

export function arteDeCromo(id) {
  const arte = ARTE[String(id).toUpperCase()];
  if (!arte?.x1) return null;
  return {
    src: arte.x1,
    srcSet: arte.x2 ? `${arte.x1} 1x, ${arte.x2} 2x` : undefined,
  };
}
