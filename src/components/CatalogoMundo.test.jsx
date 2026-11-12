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
          descripcion: "Metrópoli tecnológica que nunca duerme.",
          totalCromos: 20,
          numeros: { desde: 1, hasta: 20 },
          figura: "rayo",
          color: "#7C4DFF",
          cromos: [
            { rareza: "legendaria", tipo: "heroe" },
            { rareza: "rara", tipo: "aliado" },
          ],
        },
        mundos: [
          {
            id: "neon",
            nombre: "Ciudad Neón",
            totalCromos: 20,
            color: "#7C4DFF",
          },
        ],
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
            mundo: "neon",
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
          encabezado: {
            rango: "Mundo {numero} de 6 · cromos {desde} a {hasta}.",
          },
          mundos: {
            titulo: "Mundos",
            cromos: "{cantidad} cromos",
            aria: { paginaActual: "Página actual" },
          },
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
          orden: {
            etiqueta: "Orden: {orden}",
            opciones: { numero: "número" },
          },
          tarjeta: { tipo: "{mundo} · {tipo}" },
        },
      },
      estados: {},
      navbar: { buscador: { aria: "Buscar cromos", placeholder: "Buscar" } },
    };

    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/mundos/neon?rareza=legendaria"]}>
        <CatalogoMundo id="neon" textos={textos} />
      </MemoryRouter>,
    );

    expect(markup).toContain('<h1 id="catalogo-titulo">Ciudad Neón</h1>');
    expect(markup).toContain("20 cromos");
    expect(markup).toContain("Metrópoli tecnológica que nunca duerme.");
    expect(markup).toContain("Mundos");
    expect(markup).toContain("Página actual");
    expect(markup).toContain("Orden: número");
    expect(markup).toContain("Filtrar por rareza");
    expect(markup).toContain('value="legendaria" selected');
    expect(markup).toContain("Filtrar por tipo");
    expect(markup).toContain('class="catalogo-opcion catalogo-opcion--tipo"');
    expect(markup).toContain('name="tipo" value="heroe"');
    expect(markup).toContain("1 cromos");
    expect(markup).toContain("Quitar filtros");
    expect(markup).toContain('href="/cromos/CV-001"');
    expect(markup).toContain("Ciudad Neón · Héroe");
    expect(markup).toContain("Voltia");
    expect(markup).toContain('src="/images/cromos/CV-001.png"');
    expect(markup).toContain('alt="Ilustración de Voltia"');
    expect(markup).toContain(
      'class="etiqueta etiqueta--legendaria catalogo-cromo-rareza"',
    );
    expect(markup).toContain('aria-label="Legendaria"');
    expect(markup).toContain('aria-label="Filtrar por rareza"');
    expect(markup).toContain('class="icono icono--rareza-corona"');
    expect(markup).toContain("1 cromos");
    expect(markup).toContain("Legendaria");
  });
});
