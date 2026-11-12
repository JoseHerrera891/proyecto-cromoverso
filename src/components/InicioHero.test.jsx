import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import InicioHero from "./InicioHero.jsx";

describe("InicioHero", () => {
  it("uses API text and links to registration and the worlds section", () => {
    const textos = {
      paginas: {
        inicio: {
          hero: {
            titulo: "Seis mundos. 120 héroes. Un álbum tuyo.",
            subtitulo: "Empieza tu colección.",
            subtituloMovil: "Explora los mundos.",
            botones: {
              crearCuentaGratis: "Crear cuenta gratis",
              explorarMundos: "Explorar los mundos",
            },
          },
        },
      },
    };
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <InicioHero textos={textos} />
      </MemoryRouter>,
    );

    expect(markup).toContain("<h1");
    expect(markup).toContain("Seis mundos. 120");
    expect(markup).toContain("héroes.");
    expect(markup).toContain("Un álbum tuyo.");
    expect(markup).toContain('href="/registro"');
    expect(markup).toContain('href="#mundos"');
    expect(markup).toContain('aria-label="Héroes de Cromoverso"');
    expect(markup).toContain("Raíz Madre");
    expect(markup).toContain("Voltia");
    expect(markup).toContain("Astra");
    expect(markup).toContain(
      'class="inicio-hero-carta inicio-hero-carta--voltia"',
    );
  });
});
