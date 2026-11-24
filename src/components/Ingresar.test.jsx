import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Ingresar, { validarIngreso } from "./Ingresar.jsx";

const ingresar = {
  seo: { titulo: "Ingresar · Cromoverso", descripcion: "Ingresa" },
  presentacion: {
    etiquetas: { temporada: "Temporada 1 · Seis mundos" },
    titulo: "Seis mundos. 120 héroes. Un álbum tuyo.",
    texto: "Explora seis mundos.",
  },
  formulario: {
    titulo: "Ingresa a tu cuenta",
    subtitulo: "Ingresa con el correo y la contraseña de tu cuenta.",
    etiquetas: {
      correo: "Correo electrónico",
      clave: "Contraseña",
      mantenerSesion: "Mantener la sesión iniciada",
    },
    placeholders: { correo: "nombre@correo.com" },
    enlaces: {
      olvidasteClave: "¿Olvidaste tu contraseña?",
      crearCuenta: "Crea una cuenta",
    },
    mensajes: { sinCuenta: "¿No tienes cuenta?", ingresando: "Ingresando…" },
    botones: {
      ingresar: "Ingresar",
      mostrarClave: "Mostrar contraseña",
      ocultarClave: "Ocultar contraseña",
    },
  },
  errores: {
    correoObligatorio: "Escribe tu correo electrónico.",
    claveObligatoria: "Escribe tu contraseña.",
  },
};

function renderizar() {
  return renderToStaticMarkup(
    <MemoryRouter>
      <Ingresar textos={{ paginas: { ingresar } }} />
    </MemoryRouter>,
  );
}

describe("Ingresar", () => {
  it("pide correo y contraseña con etiquetas visibles asociadas", () => {
    const markup = renderizar();

    expect(markup).toContain("<h1>Ingresa a tu cuenta</h1>");
    expect(markup).toContain('for="ingreso-correo"');
    expect(markup).toContain('id="ingreso-correo"');
    expect(markup).toContain('for="ingreso-clave"');
    expect(markup).toContain('type="password"');
    expect(markup).toContain('aria-label="Mostrar contraseña"');
  });

  it("enlaza a crear cuenta y a recuperar la contraseña", () => {
    const markup = renderizar();

    expect(markup).toContain('href="/registro"');
    expect(markup).toContain("Crea una cuenta");
    expect(markup).toContain('href="/recuperar-clave"');
    expect(markup).toContain("¿Olvidaste tu contraseña?");
  });

  it("marca los campos vacíos en el orden del formulario", () => {
    expect(
      validarIngreso({ correo: " ", clave: "" }, ingresar.errores),
    ).toEqual({
      correo: "Escribe tu correo electrónico.",
      clave: "Escribe tu contraseña.",
    });
    expect(
      validarIngreso(
        { correo: "laura@cromoverso.test", clave: "x" },
        ingresar.errores,
      ),
    ).toEqual({});
  });
});
