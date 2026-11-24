import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CartaCromo from "./CartaCromo.jsx";

const legendaria = { id: "legendaria", nombre: "Legendaria", icono: "corona" };

function cromo(id, numero) {
  return {
    id,
    numero,
    nombre: "Voltia",
    holografico: false,
    ilustracion: { colorBase: "#7C4DFF", figura: "rayo" },
  };
}

describe("CartaCromo", () => {
  it("uses the Figma art when the cromo has an exported image", () => {
    const markup = renderToStaticMarkup(
      <CartaCromo
        cromo={cromo("CV-001", 1)}
        rareza={legendaria}
        detalle="Ciudad Neón · Héroe"
      />,
    );

    expect(markup).toMatch(/<img[^>]+CV-001/);
    expect(markup).toContain("2x");
    expect(markup).not.toContain("carta-cromo-svg");
    expect(markup).toContain(">001<");
    expect(markup).toContain("Ciudad Neón · Héroe");
  });

  it("draws the art from ilustracion when there is no image", () => {
    const markup = renderToStaticMarkup(
      <CartaCromo cromo={cromo("CV-055", 55)} rareza={legendaria} />,
    );

    expect(markup).not.toContain("<img");
    expect(markup).toContain('class="carta-cromo-svg"');
    expect(markup).toContain("--color-base:#7C4DFF");
  });

  it("can always draw the art in SVG, even when an image exists", () => {
    const markup = renderToStaticMarkup(
      <CartaCromo cromo={cromo("CV-001", 1)} rareza={legendaria} soloSvg />,
    );

    expect(markup).not.toContain("<img");
    expect(markup).toContain('class="carta-cromo-svg"');
  });

  it("names the rarity for screen readers next to its icon", () => {
    const markup = renderToStaticMarkup(
      <CartaCromo cromo={cromo("CV-001", 1)} rareza={legendaria} />,
    );

    expect(markup).toContain("icono--rareza-corona");
    expect(markup).toContain('<span class="solo-lector">Legendaria</span>');
  });

  it("lets the page choose the name element and hide the detail", () => {
    const markup = renderToStaticMarkup(
      <CartaCromo
        cromo={cromo("CV-001", 1)}
        detalle="Ciudad Neón · Héroe"
        mostrarDetalle={false}
        etiquetaNombre="p"
      />,
    );

    expect(markup).toContain('<p class="carta-cromo-nombre">Voltia</p>');
    expect(markup).not.toContain("Ciudad Neón · Héroe");
  });
});
