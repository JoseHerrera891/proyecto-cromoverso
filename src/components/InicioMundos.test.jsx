import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import InicioMundos from "./InicioMundos.jsx";

const textos = {
  paginas: {
    inicio: {
      mundos: {
        titulo: "Los seis mundos",
        subtitulo: "Cada mundo tiene cromos.",
        etiquetas: { mundo: "Mundo {numero}", cromos: "{cantidad} cromos" },
        enlaces: { ver: "Ver {mundo}" },
      },
    },
  },
  estados: {
    cargando: "Cargando…",
    error: {
      texto: "No pudimos cargar",
      botones: { reintentar: "Reintentar" },
    },
  },
};

const ids = ["neon", "coral", "bosque", "forja", "orbita", "otro"];
const datos = {
  totalAlbum: 120,
  mundos: ids.map((id, indice) => ({
    id,
    nombre: `Nombre ${indice}`,
    color: "#123456",
    figura: "rayo",
    totalCromos: 20,
  })),
};

function renderizar(estado) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <InicioMundos textos={textos} recargar={vi.fn()} {...estado} />
    </MemoryRouter>,
  );
}

describe("InicioMundos", () => {
  it("muestra los seis mundos con sus totales y enlaces de catálogo", () => {
    const markup = renderizar({ datos });

    expect(markup.match(/href="\/mundos\//g)).toHaveLength(7);
    expect(markup.match(/20 cromos/g)).toHaveLength(6);
    expect(markup).toContain('<h2 id="inicio-mundos-titulo">');
    expect(markup).toContain("Ver Nombre 0");
    expect(markup.match(/>Mundo 1</g)).toHaveLength(1);
    expect(markup).toContain("--color-mundo:#123456");
  });

  it("usa el emblema de Figma y dibuja la figura si un mundo no lo tiene", () => {
    const markup = renderizar({ datos });

    expect(markup.match(/<img class="inicio-mundo-emblema"/g)).toHaveLength(5);
    expect(markup.match(/<span class="inicio-mundo-emblema"/g)).toHaveLength(1);
  });

  it("muestra los estados de carga y error con textos de la API", () => {
    expect(renderizar({ cargando: true })).toContain("Cargando…");
    expect(renderizar({ error: true })).toContain("Reintentar");
  });
});
