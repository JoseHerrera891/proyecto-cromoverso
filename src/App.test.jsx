import { describe, expect, it } from "vitest";
import { obtenerTituloPagina } from "./utils/tituloPagina.js";

const textos = {
  navbar: {
    enlaces: { inicio: "Inicio", mundos: "Mundos", ranking: "Ranking" },
    botones: { ingresar: "Iniciar sesión", crearCuenta: "Crear cuenta" },
    buscador: { aria: "Buscar cromos" },
  },
};

describe("obtenerTituloPagina", () => {
  it.each([
    ["/", "Inicio"],
    ["/mundos", "Mundos"],
    ["/mundos/neon", "Mundos"],
    ["/ingresar", "Iniciar sesión"],
    ["/registro", "Crear cuenta"],
    ["/cromos", "Buscar cromos"],
    ["/ruta-desconocida", "Inicio"],
  ])("muestra el título adecuado para %s", (pathname, titulo) => {
    expect(obtenerTituloPagina(pathname, textos)).toBe(titulo);
  });
});
