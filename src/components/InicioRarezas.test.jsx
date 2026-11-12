import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import InicioRarezas from "./InicioRarezas.jsx";

describe("InicioRarezas", () => {
  it("muestra los nombres e iconos de las rarezas recibidas", () => {
    const rarezas = [
      { id: "comun", nombre: "Común", icono: "circulo", color: "#8A8F98" },
      { id: "rara", nombre: "Rara", icono: "rombo", color: "#2F6FED" },
      { id: "epica", nombre: "Épica", icono: "estrella", color: "#8B3FD9" },
      {
        id: "legendaria",
        nombre: "Legendaria",
        icono: "corona",
        color: "#C9A227",
      },
    ];

    const markup = renderToStaticMarkup(<InicioRarezas rarezas={rarezas} />);

    expect(markup.match(/class="inicio-rarezas-item"/g)).toHaveLength(4);
    expect(markup).toContain("Común");
    expect(markup).toContain("Rara");
    expect(markup).toContain("Épica");
    expect(markup).toContain("Legendaria");
    expect(markup).toContain("inicio-rarezas-icono--corona");
  });
});
