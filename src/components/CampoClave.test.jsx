import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CampoClave from "./CampoClave.jsx";

describe("CampoClave", () => {
  it("tiene etiqueta visible asociada y empieza oculta", () => {
    const markup = renderToStaticMarkup(
      <CampoClave
        id="clave"
        label="Contraseña"
        etiquetaMostrar="Mostrar contraseña"
        etiquetaOcultar="Ocultar contraseña"
      />,
    );

    expect(markup).toContain('<label class="campo-etiqueta" for="clave">');
    expect(markup).toContain('type="password"');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain('aria-label="Mostrar contraseña"');
  });

  it("enlaza el error al campo", () => {
    const markup = renderToStaticMarkup(
      <CampoClave
        id="clave"
        label="Contraseña"
        error="Escribe tu contraseña."
        etiquetaMostrar="Mostrar"
        etiquetaOcultar="Ocultar"
      />,
    );

    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-describedby="clave-error"');
    expect(markup).toContain("Escribe tu contraseña.");
  });
});
