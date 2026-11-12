import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer.jsx";

describe("Footer", () => {
  it("renders API content, grouped links, and legal text", () => {
    const textos = {
      navbar: { logo: { texto: "Cromoverso" } },
      footer: {
        lema: "Colecciona aventuras",
        columnas: {
          explora: {
            titulo: "Explora",
            enlaces: { inicio: "Inicio", mundos: "Mundos" },
          },
          cuenta: {
            titulo: "Tu cuenta",
            enlaces: { ingresar: "Ingresar", crearCuenta: "Crear cuenta" },
          },
          legal: {
            titulo: "Legal",
            enlaces: { terminos: "Términos", accesibilidad: "Accesibilidad" },
          },
        },
        legal: {
          derechos: "© {anio} Cromoverso",
          nota: "Todos los derechos reservados.",
        },
      },
    };
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <Footer textos={textos} idioma="es" />
      </MemoryRouter>,
    );

    expect(markup).toContain('aria-label="Navegación del pie"');
    expect(markup).toContain("logo-inverso.svg");
    expect(markup).toContain("Colecciona aventuras");
    expect(markup).toContain("<h2>Explora</h2>");
    expect(markup).toContain("<h2>Tu cuenta</h2>");
    expect(markup).toContain("<h2>Legal</h2>");
    expect(markup).toContain('href="/mundos"');
    expect(markup).toContain('href="/ingresar"');
    expect(markup).toContain('href="/registro"');
    expect(markup).toContain('href="/terminos"');
    expect(markup).toContain('href="/accesibilidad"');
    expect(markup).toContain(`© ${new Date().getFullYear()} Cromoverso`);
    expect(markup).toContain("Todos los derechos reservados.");
  });
});
