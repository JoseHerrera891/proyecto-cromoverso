import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer.jsx";

describe("Footer", () => {
  it("renders navigation links from the supplied interface texts", () => {
    const textos = {
      navbar: {
        logo: { texto: "Cromoverso" },
        enlaces: { inicio: "Inicio", mundos: "Mundos" },
        botones: { ingresar: "Iniciar sesión", crearCuenta: "Crear cuenta" },
      },
    };
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <Footer textos={textos} idioma="es" />
      </MemoryRouter>,
    );

    expect(markup).toContain("<footer");
    expect(markup).toContain('aria-label="Navegación del pie"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/mundos"');
    expect(markup).toContain('href="/ingresar"');
    expect(markup).toContain('href="/registro"');
    expect(markup).toContain("Cromoverso");
  });
});
