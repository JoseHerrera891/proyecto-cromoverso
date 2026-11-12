export function obtenerTituloPagina(pathname, textos) {
  const nav = textos?.navbar;
  const seccion = pathname.split("/").filter(Boolean)[0] || "inicio";

  if (seccion === "ingresar") return nav?.botones?.ingresar;
  if (seccion === "registro") return nav?.botones?.crearCuenta;
  if (seccion === "cromos") return nav?.buscador?.aria;

  return nav?.enlaces?.[seccion] ?? nav?.enlaces?.inicio;
}
