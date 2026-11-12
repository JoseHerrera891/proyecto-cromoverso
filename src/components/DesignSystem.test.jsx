import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";
import Card from "./Card.jsx";
import CookieBanner from "./CookieBanner.jsx";
import TextField from "./TextField.jsx";

describe("componentes base del sistema de diseño", () => {
  it("renders a disabled button with its variant and native attributes", () => {
    const markup = renderToStaticMarkup(
      <Button variante="secundario" disabled type="submit">
        Guardar
      </Button>,
    );

    expect(markup).toContain('class="boton boton--secundario"');
    expect(markup).toContain('type="submit"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain("Guardar");
  });

  it("connects a field label, description, and error to its input", () => {
    const markup = renderToStaticMarkup(
      <TextField
        id="correo"
        label="Correo"
        description="Usaremos tu correo para iniciar sesión."
        error="El formato no es válido."
        disabled
        type="email"
      />,
    );

    expect(markup).toContain('for="correo"');
    expect(markup).toContain('id="correo"');
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain(
      'aria-describedby="correo-description correo-error"',
    );
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('id="correo-description"');
    expect(markup).toContain('id="correo-error"');
  });

  it("renders the selected rarity as a semantic label", () => {
    const markup = renderToStaticMarkup(
      <Badge rareza="legendaria">Legendaria</Badge>,
    );

    expect(markup).toContain('class="etiqueta etiqueta--legendaria"');
    expect(markup).toContain("Legendaria");
  });

  it("preserves custom card classes and accessible attributes", () => {
    const markup = renderToStaticMarkup(
      <Card className="mundo-card" aria-label="Mundo Neón">
        Mundo Neón
      </Card>,
    );

    expect(markup).toContain('class="tarjeta mundo-card"');
    expect(markup).toContain('aria-label="Mundo Neón"');
    expect(markup).toContain("Mundo Neón");
  });

  it("renders cookie consent actions with their accessible labels", () => {
    const texts = {
      titulo: "Preferencias de cookies",
      texto: "Elige si aceptas las cookies.",
      botones: { aceptar: "Aceptar", rechazar: "Rechazar" },
    };
    const markup = renderToStaticMarkup(
      <CookieBanner texts={texts} onAccept={vi.fn()} onReject={vi.fn()} />,
    );

    expect(markup).toContain('aria-labelledby="');
    expect(markup).toContain('aria-describedby="');
    expect(markup).toContain("Preferencias de cookies");
    expect(markup).toContain("Aceptar");
    expect(markup).toContain("Rechazar");
    expect(markup.match(/class="boton boton--secundario"/g)).toHaveLength(2);
  });
});
