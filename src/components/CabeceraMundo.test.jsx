import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CabeceraMundo from "./CabeceraMundo.jsx";

const pagina = {
  migas: { inicio: "Inicio" },
  encabezado: { rango: "Mundo {numero} de 6 · cromos {desde} a {hasta}." },
};
const general = { acciones: { volver: "Volver", buscar: "Buscar" } };
const mundo = {
  id: "coral",
  nombre: "Abismo Coral",
  tema: "Un océano profundo",
  color: "#00A3A3",
  numeros: { desde: 21, hasta: 40 },
};

describe("CabeceraMundo", () => {
  it("shows the world name, its range and theme from the API", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <CabeceraMundo
          mundo={mundo}
          posicion={2}
          pagina={pagina}
          general={general}
          buscadorAbierto={false}
          onAlternarBuscador={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(markup).toContain('<h1 id="catalogo-titulo">Abismo Coral</h1>');
    expect(markup).toContain("Mundo 2 de 6 · cromos 021 a 040.");
    expect(markup).toContain("Un océano profundo");
    expect(markup).toContain('aria-current="page">Abismo Coral');
    expect(markup).toContain("--color-mundo:#00A3A3");
  });

  it("labels the mobile back and search buttons with API texts", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <CabeceraMundo
          mundo={mundo}
          posicion={2}
          pagina={pagina}
          general={general}
          buscadorAbierto
          onAlternarBuscador={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(markup).toContain('aria-label="Volver"');
    expect(markup).toContain('aria-label="Buscar"');
    expect(markup).toContain('aria-expanded="true"');
  });
});
