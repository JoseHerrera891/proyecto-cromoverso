import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import InicioHero from "./InicioHero.jsx";

const textos = {
  paginas: {
    inicio: {
      hero: {
        titulo: "Seis mundos. 120 héroes. Un álbum tuyo.",
        subtitulo: "Empieza tu colección.",
        subtituloMovil: "Explora los mundos.",
        etiquetas: { guardiana: "Guardiana holográfica" },
        botones: {
          crearCuentaGratis: "Crear cuenta gratis",
          explorarMundos: "Explorar los mundos",
        },
      },
      tarjeta: { tipo: "{mundo} · {tipo}" },
    },
    albumMundo: { filtros: { tipo: { opciones: { heroe: "Héroe" } } } },
  },
};

const destacados = [
  {
    id: "CV-001",
    numero: 1,
    nombre: "Voltia",
    mundoNombre: "Ciudad Neón",
    tipo: "heroe",
    rareza: "legendaria",
    holografico: true,
  },
  {
    id: "CV-041",
    numero: 41,
    nombre: "Raíz Madre",
    mundoNombre: "Bosque Eterno",
    tipo: "heroe",
    rareza: "legendaria",
    holografico: true,
  },
];

const rarezas = [{ id: "legendaria", nombre: "Legendaria", icono: "corona" }];

function renderizar(props) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <InicioHero textos={textos} {...props} />
    </MemoryRouter>,
  );
}

describe("InicioHero", () => {
  it("uses API text and links to registration and the catalog", () => {
    const markup = renderizar();

    expect(markup).toContain('<h1 id="inicio-hero-titulo">');
    expect(markup).toContain("Seis mundos. 120 héroes.");
    expect(markup).toContain("Un álbum tuyo.");
    expect(markup).toContain('href="/registro"');
    expect(markup).toContain('href="/mundos"');
    expect(markup).toContain("Explora los mundos.");
    expect(markup).toContain("Empieza tu colección.");
  });

  it("shows the featured cromos from the API, not hand-written data", () => {
    const markup = renderizar({ destacados, rarezas });

    expect(markup).toContain("Guardiana holográfica");
    expect(markup).toContain("Voltia");
    expect(markup).toContain("Ciudad Neón · Héroe");
    expect(markup).toContain("Raíz Madre");
    expect(markup).toContain("inicio-hero-carta--centro");
    expect(markup).toContain("inicio-hero-carta--izquierda");
    expect(markup).not.toContain("Astra");
  });

  it("does not render cards until the API answers", () => {
    expect(renderizar()).not.toContain("inicio-hero-cartas");
  });
});
