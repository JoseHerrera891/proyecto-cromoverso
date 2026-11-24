import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AvisoCarga, Esqueleto, EstadoError } from "./Estados.jsx";

const textos = {
  estados: {
    cargando: "Cargando…",
    error: {
      titulo: "No se pudo cargar",
      texto: "Algo falló al pedir los datos.",
      botones: { reintentar: "Reintentar" },
    },
  },
  errores: { falla_simulada: "El servidor no respondió esta vez." },
};

describe("estados de las vistas", () => {
  it("usa el mensaje de textos.errores según el código de la API", () => {
    const markup = renderToStaticMarkup(
      <EstadoError
        textos={textos}
        error={{ codigo: "falla_simulada" }}
        onReintentar={vi.fn()}
      />,
    );

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("No se pudo cargar");
    expect(markup).toContain("El servidor no respondió esta vez.");
    expect(markup).toContain("Reintentar");
  });

  it("usa el texto general cuando el código no tiene mensaje", () => {
    const markup = renderToStaticMarkup(
      <EstadoError textos={textos} error={{ codigo: "otro" }} />,
    );

    expect(markup).toContain("Algo falló al pedir los datos.");
    expect(markup).not.toContain("<button");
  });

  it("los esqueletos no se leen y la carga se anuncia con texto de la API", () => {
    expect(renderToStaticMarkup(<Esqueleto />)).toContain('aria-hidden="true"');
    expect(renderToStaticMarkup(<AvisoCarga textos={textos} />)).toContain(
      'role="status">Cargando…',
    );
  });
});
