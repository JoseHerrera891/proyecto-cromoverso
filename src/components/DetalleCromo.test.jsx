import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useDetalleCromo } from "../hooks/useDetalleCromo.js";
import DetalleCromo from "./DetalleCromo.jsx";

vi.mock("../hooks/useDetalleCromo.js", () => ({
  useDetalleCromo: vi.fn(),
}));
// El catálogo de fondo se prueba por separado.
vi.mock("./CatalogoMundo.jsx", () => ({
  default: ({ id }) => <div data-fondo={id} />,
}));

const textos = {
  paginas: {
    detalleCromo: {
      seo: { titulo: "{nombre} · Cromoverso", descripcion: "{poder}" },
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
      botones: { cerrar: "Cerrar" },
      noEncontrado: {
        titulo: "No encontramos este cromo",
        texto: "Revisa el número.",
        botones: { volver: "Volver a los mundos" },
      },
    },
  },
  estados: { cargando: "Cargando…", error: { texto: "Error" } },
};

const cromo = {
  id: "CV-008",
  numero: 8,
  nombre: "Holograma",
  mundo: "neon",
  mundoNombre: "Ciudad Neón",
  posicion: 8,
  tipo: "heroe",
  rareza: "epica",
  datosRareza: { id: "epica", nombre: "Épica", icono: "estrella" },
  holografico: false,
  poder: "Crea copias de luz",
  descripcion: "Guarda los secretos de la ciudad.",
  atributos: { fuerza: 55, velocidad: 61, mente: 60, energia: 58 },
  anterior: { id: "CV-007", numero: 7, nombre: "Lumen" },
  siguiente: { id: "CV-009", numero: 9, nombre: "Doctora Estática" },
  ilustracion: { colorBase: "#7C4DFF", figura: "estrella" },
};

function renderizar(estado) {
  useDetalleCromo.mockReturnValue({
    cromo: null,
    cargando: false,
    error: false,
    noEncontrado: false,
    recargar: vi.fn(),
    ...estado,
  });
  return renderToStaticMarkup(
    <MemoryRouter>
      <DetalleCromo id="CV-008" textos={textos} />
    </MemoryRouter>,
  );
}

describe("DetalleCromo", () => {
  it("es un diálogo con rareza (icono y palabra), tipo, poder y descripción", () => {
    const markup = renderizar({ cromo });

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).toContain('<h1 id="detalle-titulo">Holograma</h1>');
    expect(markup).toContain("CV-008 · Ciudad Neón, posición 8");
    expect(markup).toContain("icono--rareza-estrella");
    expect(markup).toContain("Épica");
    expect(markup).toContain("Héroe");
    expect(markup).toContain("Crea copias de luz");
    expect(markup).toContain("Guarda los secretos de la ciudad.");
    expect(markup).toContain('aria-label="Cerrar"');
  });

  it("dibuja la carta con SVG, no con una imagen", () => {
    const markup = renderizar({ cromo });

    expect(markup).toContain('class="carta-cromo-svg"');
    expect(markup).not.toContain("<img");
  });

  it("muestra los atributos en barras con su total y escala", () => {
    const markup = renderizar({ cromo });

    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-valuenow="55"');
    expect(markup).toContain("Total 234");
    expect(markup).toContain("Escala de 10 a 99.");
  });

  it("enlaza al cromo anterior y siguiente con número y nombre", () => {
    const markup = renderizar({ cromo });

    expect(markup).toContain('href="/cromos/CV-007"');
    expect(markup).toContain("007 Lumen");
    expect(markup).toContain(
      'aria-label="Cromo siguiente: 009 Doctora Estática"',
    );
  });

  it("deja el catálogo del mundo de fondo, inerte", () => {
    const markup = renderizar({ cromo });

    expect(markup).toContain('data-fondo="neon"');
    expect(markup).toMatch(/class="detalle-fondo" inert=""/);
  });

  it("muestra la página de no encontrado cuando la API responde 404", () => {
    const markup = renderizar({ error: true, noEncontrado: true });

    expect(markup).toContain("No encontramos este cromo");
    expect(markup).toContain('href="/mundos"');
    expect(markup).not.toContain('role="dialog"');
  });
});
