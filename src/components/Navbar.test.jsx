import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ContextoSesion } from "../hooks/useSesion.js";
import Navbar from "./Navbar.jsx";

const textos = {
  navbar: {
    logo: { texto: "cromoverso", aria: "Cromoverso, ir al inicio" },
    enlaces: { inicio: "Inicio", mundos: "Mundos" },
    botones: { ingresar: "Ingresar", crearCuenta: "Crear cuenta" },
    aria: {
      idioma: "Cambiar idioma",
      accesibilidad: "Abrir opciones de accesibilidad",
    },
  },
  menuMovil: { abrir: "Abrir menú", cerrar: "Cerrar menú" },
  idioma: { codigos: { es: "ES", en: "EN" } },
};

function renderizar(props = {}) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <Navbar
        textos={textos}
        idioma="es"
        cambiarIdioma={vi.fn()}
        activo="inicio"
        {...props}
      />
    </MemoryRouter>,
  );
}

describe("Navbar", () => {
  it("uses semantic header and nav with the course links", () => {
    const markup = renderizar();

    expect(markup).toMatch(/<header[^>]*><nav/);
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/mundos"');
    expect(markup).toContain('href="/ingresar"');
    expect(markup).toContain('href="/registro"');
    expect(markup).toContain('aria-current="page"');
  });

  it("loads the logos from the project, not from the API", () => {
    const markup = renderizar();

    expect(markup).toContain('src="/marca/logo-normal.svg"');
    expect(markup).not.toContain("fly.dev");
  });

  it("exposes the mobile menu button with its API label", () => {
    const markup = renderizar();

    expect(markup).toContain('aria-label="Abrir menú"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-controls="menu-movil"');
  });

  it("with a session shows the account menu instead of sign in", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <ContextoSesion.Provider
          value={{
            usuario: { nombre: "Laura Cardona", correo: "l@c.test" },
            salir: vi.fn(),
          }}
        >
          <Navbar
            textos={{
              ...textos,
              navbar: {
                ...textos.navbar,
                usuario: { menu: "Menú de tu cuenta" },
              },
            }}
            idioma="es"
            cambiarIdioma={vi.fn()}
            activo="inicio"
          />
        </ContextoSesion.Provider>
      </MemoryRouter>,
    );

    expect(markup).toContain("Menú de tu cuenta: Laura Cardona");
    expect(markup).not.toContain('href="/ingresar"');
    expect(markup).not.toContain('href="/registro"');
  });

  it("applies the dark tone and mobile hiding classes", () => {
    const markup = renderizar({ tono: "oscuro", ocultarEnMovil: true });

    expect(markup).toContain(
      'class="navbar navbar--oscuro navbar--oculta-movil"',
    );
  });
});
