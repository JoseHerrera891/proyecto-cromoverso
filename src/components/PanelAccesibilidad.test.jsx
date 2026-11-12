import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PanelAccesibilidad from "./PanelAccesibilidad.jsx";

const textos = {
  titulo: "Accesibilidad",
  botones: { cerrar: "Cerrar", restablecer: "Restablecer" },
  tamanoTexto: {
    titulo: "Tamaño del texto",
    opciones: { normal: "Normal", grande: "Grande", muyGrande: "Muy grande" },
  },
  altoContraste: { titulo: "Alto contraste", ayuda: "Más contraste" },
  reducirMovimiento: {
    titulo: "Reducir movimiento",
    ayuda: "Menos movimiento",
  },
  subrayarEnlaces: { titulo: "Subrayar enlaces", ayuda: "Más claridad" },
  fuenteLecturaFacil: { titulo: "Lectura fácil", ayuda: "Más legible" },
  etiquetas: { encendido: "Encendido", apagado: "Apagado" },
  enlaces: { declaracion: "Declaración de accesibilidad" },
};

describe("PanelAccesibilidad", () => {
  it("presenta las opciones de lectura, ajustes, declaración y restablecimiento", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <PanelAccesibilidad
          id="panel-accesibilidad"
          textos={textos}
          preferencias={{
            tamanoTexto: "normal",
            altoContraste: false,
            reducirMovimiento: false,
            subrayarEnlaces: false,
            fuenteLecturaFacil: false,
          }}
          onCambiar={vi.fn()}
          onRestablecer={vi.fn()}
          onCerrar={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(markup).toContain('role="dialog"');
    expect(markup.match(/role="switch"/g)).toHaveLength(4);
    expect(markup).toContain('aria-pressed="true">Normal');
    expect(markup).toContain("Muy grande");
    expect(markup).toContain('href="/accesibilidad"');
    expect(markup).toContain("Restablecer");
  });
});
