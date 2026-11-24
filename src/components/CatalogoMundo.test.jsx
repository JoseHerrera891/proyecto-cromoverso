import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useCatalogoMundo } from "../hooks/useCatalogoMundo.js";
import CatalogoMundo from "./CatalogoMundo.jsx";

vi.mock("../hooks/useCatalogoMundo.js", () => ({
  useCatalogoMundo: vi.fn(),
}));

const textos = {
  paginas: {
    albumMundo: {
      migas: { inicio: "Inicio" },
      encabezado: { rango: "Mundo {numero} de 6 · cromos {desde} a {hasta}." },
      mundos: {
        titulo: "Mundos",
        cromos: "{cantidad} cromos",
        aria: { paginaActual: "Página actual" },
      },
      filtros: {
        rareza: {
          titulo: "Filtrar por rareza",
          todas: "Rareza: todas",
          valor: "Rareza: {rareza}",
        },
        tipo: {
          titulo: "Filtrar por tipo",
          todos: "Tipo: todos",
          valor: "Tipo: {tipo}",
          opciones: { heroe: "Héroe", aliado: "Aliado", villano: "Villano" },
        },
        cantidad: { uno: "{cantidad} cromo", otro: "{cantidad} cromos" },
      },
      orden: { etiqueta: "Orden: {orden}", opciones: { numero: "número" } },
      tarjeta: { tipo: "{mundo} · {tipo}" },
      vacio: {
        titulo: "Sin resultados",
        texto: "Prueba otros filtros",
        botones: { limpiar: "Quitar filtros" },
      },
    },
  },
  general: { acciones: { volver: "Volver", buscar: "Buscar" } },
  estados: {
    cargando: "Cargando…",
    error: { texto: "Falló", botones: { reintentar: "Reintentar" } },
    noEncontrado: {
      titulo: "No encontramos esta página",
      texto: "Revisa el enlace",
      botones: { irAlInicio: "Ir al inicio" },
    },
  },
  navbar: { buscador: { aria: "Buscar cromos", placeholder: "Buscar" } },
};

const datos = {
  mundo: {
    id: "neon",
    nombre: "Ciudad Neón",
    tema: "Metrópoli tecnológica",
    color: "#7C4DFF",
    numeros: { desde: 1, hasta: 20 },
    porRareza: { legendaria: 2 },
    cromos: [{ rareza: "legendaria", tipo: "heroe" }],
  },
  mundos: [
    { id: "neon", nombre: "Ciudad Neón", totalCromos: 20, color: "#7C4DFF" },
  ],
  rarezas: [
    {
      id: "legendaria",
      nombre: "Legendaria",
      icono: "corona",
      probabilidad: 0.02,
    },
  ],
};

const voltia = {
  id: "CV-001",
  numero: 1,
  nombre: "Voltia",
  mundoNombre: "Ciudad Neón",
  rareza: "legendaria",
  tipo: "heroe",
};

function renderizar(estado, ruta = "/mundos/neon") {
  useCatalogoMundo.mockReturnValue({
    datos: null,
    cromos: null,
    filtros: { rareza: "", tipo: "" },
    cargando: false,
    cargandoCromos: false,
    error: null,
    noEncontrado: false,
    recargar: vi.fn(),
    ...estado,
  });
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[ruta]}>
      <CatalogoMundo id="neon" textos={textos} />
    </MemoryRouter>,
  );
}

describe("CatalogoMundo", () => {
  it("muestra el mundo, su rango, los filtros y los cromos de la API", () => {
    const markup = renderizar(
      { datos, cromos: [voltia], filtros: { rareza: "legendaria", tipo: "" } },
      "/mundos/neon?rareza=legendaria",
    );

    expect(markup).toContain(
      '<h1 id="catalogo-titulo" class="cabecera-mundo-titulo">Ciudad Neón</h1>',
    );
    expect(markup).toContain("Mundo 1 de 6 · cromos 001 a 020.");
    expect(markup).toContain("Filtrar por rareza");
    expect(markup).toContain('<option value="legendaria" selected="">');
    expect(markup).toContain("Rareza: Legendaria");
    expect(markup).toContain("Orden: número");
    expect(markup).toContain('href="/cromos/CV-001"');
    expect(markup).toContain("Ciudad Neón · Héroe");
    expect(markup).toContain("Quitar filtros");
    expect(markup).not.toContain("/images/");
  });

  it("pide los filtros de la URL al hook", () => {
    renderizar(
      { datos, cromos: [] },
      "/mundos/neon?rareza=legendaria&tipo=villano",
    );

    expect(useCatalogoMundo).toHaveBeenLastCalledWith(
      "neon",
      { rareza: "legendaria", tipo: "villano" },
      ["heroe", "aliado", "villano"],
    );
  });

  it("muestra el estado vacío con la acción para quitar filtros", () => {
    const markup = renderizar({ datos, cromos: [] });

    expect(markup).toContain("Sin resultados");
    expect(markup).toContain("Prueba otros filtros");
  });

  it("muestra carga, error y mundo inexistente con textos de la API", () => {
    expect(renderizar({ cargando: true })).toContain("Cargando…");
    expect(renderizar({ error: new Error("x") })).toContain("Reintentar");
    expect(
      renderizar({ noEncontrado: true, error: new Error("404") }),
    ).toContain("No encontramos esta página");
  });
});
