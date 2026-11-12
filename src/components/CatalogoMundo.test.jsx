import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useCatalogoMundo } from "../hooks/useCatalogoMundo.js";
import CatalogoMundo from "./CatalogoMundo.jsx";

vi.mock("../hooks/useCatalogoMundo.js", () => ({
  useCatalogoMundo: vi.fn(),
}));

describe("CatalogoMundo", () => {
  it("muestra el nombre, total y filtros localizados del mundo", () => {
    useCatalogoMundo.mockReturnValue({
      datos: {
        mundo: {
          id: "neon",
          nombre: "Ciudad Neón",
          descripcion: "Una ciudad tecnológica.",
          totalCromos: 20,
          color: "#7C4DFF",
        },
        rarezas: [
          {
            id: "legendaria",
            nombre: "Legendaria",
            icono: "corona",
            color: "#c9a227",
          },
        ],
        cromos: [
          {
            id: "CV-001",
            numero: 1,
            nombre: "Voltia",
            rareza: "legendaria",
            tipo: "heroe",
            ilustracion: { colorBase: "#7C4DFF" },
          },
        ],
        paginacion: { total: 20 },
      },
      cargando: false,
      error: false,
      recargar: vi.fn(),
    });
    const textos = {
      paginas: {
        albumMundo: {
          migas: { inicio: "Inicio" },
          mundos: { cromos: "{cantidad} cromos" },
          tarjeta: { tipo: "{mundo} · {tipo}" },
          filtros: {
            rareza: { titulo: "Filtrar por rareza", todas: "Todas" },
            tipo: {
              titulo: "Filtrar por tipo",
              todos: "Todos",
              opciones: {
                heroe: "Héroe",
                aliado: "Aliado",
                villano: "Villano",
              },
            },
          },
          vacio: {
            titulo: "Sin resultados",
            texto: "Prueba otros filtros",
            botones: { limpiar: "Quitar filtros" },
          },
        },
      },
      estados: {},
    };

    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/mundos/neon?rareza=legendaria"]}>
        <CatalogoMundo id="neon" textos={textos} />
      </MemoryRouter>,
    );

    expect(markup).toContain('<h1 id="catalogo-titulo">Ciudad Neón</h1>');
    expect(markup).toContain("20 cromos");
    expect(markup).toContain("Filtrar por rareza");
    expect(markup).toContain('value="legendaria" selected');
    expect(markup).toContain("Filtrar por tipo");
    expect(markup).toContain("Quitar filtros");
    expect(markup).toContain('href="/cromos/CV-001"');
    expect(markup).toContain("Voltia");
    expect(markup).toContain("Ciudad Neón · Héroe");
    expect(markup).toContain("♛");
    expect(markup).toContain("Legendaria");
  });
});
