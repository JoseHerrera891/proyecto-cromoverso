import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FiltrosCatalogo from "./FiltrosCatalogo.jsx";
import { ordenarRarezas } from "../utils/catalogo.js";

const pagina = {
  mundos: {
    titulo: "Mundos",
    cromos: "{cantidad} cromos",
    aria: { paginaActual: "Página actual" },
  },
  filtros: {
    rareza: { titulo: "Filtrar por rareza" },
    tipo: {
      titulo: "Filtrar por tipo",
      opciones: { heroe: "Héroe", aliado: "Aliado", villano: "Villano" },
    },
    cantidad: { uno: "{cantidad} cromo", otro: "{cantidad} cromos" },
  },
  vacio: { botones: { limpiar: "Quitar filtros" } },
};

const rarezas = [
  { id: "comun", nombre: "Común", icono: "circulo", probabilidad: 0.7 },
  { id: "rara", nombre: "Rara", icono: "rombo", probabilidad: 0.2 },
  { id: "epica", nombre: "Épica", icono: "estrella", probabilidad: 0.08 },
  {
    id: "legendaria",
    nombre: "Legendaria",
    icono: "corona",
    probabilidad: 0.02,
  },
];

const mundo = {
  id: "neon",
  porRareza: { comun: 10, rara: 5, epica: 3, legendaria: 1 },
  cromos: [{ tipo: "heroe" }, { tipo: "heroe" }, { tipo: "aliado" }],
};

const mundos = [
  { id: "neon", nombre: "Ciudad Neón", totalCromos: 20, color: "#7C4DFF" },
  { id: "coral", nombre: "Abismo Coral", totalCromos: 20, color: "#00A3A3" },
];

function renderizar(filtros = { rareza: "", tipo: "" }) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <FiltrosCatalogo
        mundo={mundo}
        mundos={mundos}
        rarezas={rarezas}
        pagina={pagina}
        filtros={filtros}
        enlaceFiltro={(nombre, valor) =>
          nombre && valor ? `/mundos/neon?${nombre}=${valor}` : "/mundos/neon"
        }
      />
    </MemoryRouter>,
  );
}

describe("FiltrosCatalogo", () => {
  it("orders rarities from legendary to common", () => {
    expect(ordenarRarezas(rarezas).map(({ id }) => id)).toEqual([
      "legendaria",
      "epica",
      "rara",
      "comun",
    ]);
  });

  it("lists the worlds and marks the current page", () => {
    const markup = renderizar();

    expect(markup).toContain('href="/mundos/coral"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("Página actual");
    expect(markup.match(/20 cromos/g)).toHaveLength(2);
  });

  it("shows each rarity with icon and word, and singular or plural counts", () => {
    const markup = renderizar();

    expect(markup).toContain("icono--rareza-corona");
    expect(markup).toContain("Legendaria");
    expect(markup).toContain("1 cromo<");
    expect(markup).toContain("10 cromos");
    expect(markup).toContain('href="/mundos/neon?rareza=legendaria"');
    expect(markup).toContain('href="/mundos/neon?tipo=heroe"');
    expect(markup).toContain("2 cromos");
    expect(markup).not.toContain("Quitar filtros");
  });

  it("marks the active filter, toggles it off and offers to clear", () => {
    const markup = renderizar({ rareza: "rara", tipo: "" });

    expect(markup).toContain('aria-current="true"');
    expect(markup).toMatch(
      /<a(?=[^>]*aria-current="true")(?=[^>]*href="\/mundos\/neon")[^>]*>/,
    );
    expect(markup).toContain("Quitar filtros");
  });
});
