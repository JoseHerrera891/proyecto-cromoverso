import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LanguageSelector from "./LanguageSelector.jsx";

describe("LanguageSelector", () => {
  it("disables both language options when disabled", () => {
    const markup = renderToStaticMarkup(
      <LanguageSelector
        idioma="es"
        cambiarIdioma={vi.fn()}
        etiqueta="Cambiar idioma"
        disabled
      />,
    );

    expect(markup.match(/<button\b[^>]*disabled=""/g)).toHaveLength(2);
    expect(markup).toContain('lang="es" aria-pressed="true"');
  });

  it("keeps the language options enabled by default", () => {
    const markup = renderToStaticMarkup(
      <LanguageSelector
        idioma="en"
        cambiarIdioma={vi.fn()}
        etiqueta="Change language"
      />,
    );

    expect(markup).not.toContain("disabled");
    expect(markup).toContain('lang="en" aria-pressed="true"');
  });

  it("uses the language codes and names sent by the API", () => {
    const markup = renderToStaticMarkup(
      <LanguageSelector
        idioma="es"
        cambiarIdioma={vi.fn()}
        etiqueta="Idioma"
        codigos={{ es: "ES", en: "EN" }}
        nombres={{ es: "Español", en: "English" }}
      />,
    );

    expect(markup).toContain('aria-label="Español"');
    expect(markup).toContain('aria-label="English"');
    expect(markup).toContain(">EN</button>");
  });
});
