// Emblemas exportados de Figma («Imágenes para exportar» › mundos), uno por
// id de mundo de la API.
const archivos = import.meta.glob("../assets/mundos/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const EMBLEMAS = Object.fromEntries(
  Object.entries(archivos).map(([ruta, url]) => [
    ruta.match(/\/([\w-]+)\.svg$/)[1],
    url,
  ]),
);

export function emblemaDeMundo(id) {
  return EMBLEMAS[id] ?? null;
}
