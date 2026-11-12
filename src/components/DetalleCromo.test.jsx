import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useDetalleCromo } from "../hooks/useDetalleCromo.js";
import DetalleCromo from "./DetalleCromo.jsx";

vi.mock("../hooks/useDetalleCromo.js", () => ({
  useDetalleCromo: vi.fn(),
}));

const textos = {
  paginas: {
    detalleCromo: {
      encabezado: {
        ubicacion: "{id} · {mundo}, posición {posicion}",
        tipos: { heroe: "Héroe" },
      },
      poder: { titulo: "Poder" },
      navegacion: { anterior: "Cromo anterior", siguiente: "Cromo siguiente" },
      atributos: {
        titulo: "Atributos",
        total: "Total {total}",
        escala: "Escala de 10 a 99.",
        nombres: {
          fuerza: "Fuerza",
          velocidad: "Velocidad",
          mente: "Mente",
          energia: "Energía",
        },
      },
      noEncontrado: {
        titulo: "Cromo no encontrado",
        texto: "Revisa el número.",
        botones: { volver: "Volver a los mundos" },
      },
    },
  },
  estados: { cargando: "Cargando…", error: { texto: "Error" } },
};

describe("DetalleCromo", () => {
  it("muestra la información principal y vuelve al catálogo del mundo", () => {
    useDetalleCromo.mockReturnValue({
      cromo: {
        id: "CV-001",
        nombre: "Voltia",
        mundo: "neon",
        mundoNombre: "Ciudad Neón",
        posicion: 1,
        tipo: "heroe",
        poder: "Descarga eléctrica",
        descripcion: "Cuida la ciudad.",
        atributos: { fuerza: 98, velocidad: 87, mente: 75, energia: 80 },
        anterior: { id: "CV-000" },
        siguiente: { id: "CV-002" },
        ilustracion: { colorBase: "#7C4DFF" },
      },
      cargando: false,
      error: false,
    });

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <DetalleCromo id="CV-001" textos={textos} />
      </MemoryRouter>,
    );

    expect(markup).toContain("<h1>Voltia</h1>");
    expect(markup).toContain("CV-001 · Ciudad Neón, posición 1");
    expect(markup).toContain("Descarga eléctrica");
    expect(markup).toContain('href="/mundos/neon"');
    expect(markup).toContain("Fuerza");
    expect(markup).toContain('aria-valuenow="98"');
    expect(markup).toContain("Escala de 10 a 99.");
    expect(markup).toContain("Total 340");
    expect(markup).toContain('href="/cromos/CV-000"');
    expect(markup).toContain("Cromo anterior");
    expect(markup).toContain('href="/cromos/CV-002"');
    expect(markup).toContain("Cromo siguiente");
  });

  it("muestra el estado localizado cuando el cromo no existe", () => {
    useDetalleCromo.mockReturnValue({
      cromo: null,
      cargando: false,
      error: true,
      noEncontrado: true,
    });

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <DetalleCromo id="invalid" textos={textos} />
      </MemoryRouter>,
    );

    expect(markup).toContain("Cromo no encontrado");
    expect(markup).toContain("Volver a los mundos");
    expect(markup).toContain('href="/"');
  });
});
