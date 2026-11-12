import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useInicioPublico } from "../hooks/useInicioPublico.js";
import InicioMundos from "./InicioMundos.jsx";

vi.mock("../hooks/useInicioPublico.js", () => ({
  useInicioPublico: vi.fn(),
}));

describe("InicioMundos", () => {
  it("muestra los seis mundos con sus totales y enlaces de catálogo", () => {
    useInicioPublico.mockReturnValue({
      datos: {
        totalAlbum: 120,
        rarezas: [],
        mundos: Array.from({ length: 6 }, (_, index) => ({
          id: `mundo-${index}`,
          nombre: `Mundo ${index}`,
          color: "#123456",
          totalCromos: 20,
        })),
      },
      cargando: false,
      error: false,
      recargar: vi.fn(),
    });
    const textos = {
      paginas: {
        inicio: {
          mundos: {
            titulo: "Los seis mundos",
            subtitulo: "Cada mundo tiene cromos.",
            etiquetas: { mundo: "Mundo {numero}", cromos: "{cantidad} cromos" },
          },
        },
      },
      estados: {},
    };
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <InicioMundos textos={textos} />
      </MemoryRouter>,
    );

    expect(markup.match(/href="\/mundos\/mundo-/g)).toHaveLength(6);
    expect(markup.match(/20 cromos/g)).toHaveLength(6);
    expect(markup).toContain("Los seis mundos");
    expect(markup).toContain(">120</span>");
  });
});
