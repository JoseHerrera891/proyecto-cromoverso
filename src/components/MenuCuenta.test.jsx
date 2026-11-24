import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ContextoSesion } from "../hooks/useSesion.js";
import { iniciales } from "../utils/iniciales.js";
import MenuCuenta from "./MenuCuenta.jsx";

const usuario = {
  nombre: "Laura Cardona",
  correo: "laura@cromoverso.test",
  alias: "laura.cromos",
  colorAvatar: "#7C4DFF",
};
const textos = { menu: "Menú de tu cuenta", cerrarSesion: "Cerrar sesión" };

function renderizar(sesion) {
  return renderToStaticMarkup(
    <ContextoSesion.Provider value={{ salir: vi.fn(), ...sesion }}>
      <MenuCuenta textos={textos} />
    </ContextoSesion.Provider>,
  );
}

describe("MenuCuenta", () => {
  it("muestra el avatar con el nombre de la persona para lectores de pantalla", () => {
    const markup = renderizar({ usuario });

    expect(markup).toContain(">LC</span>");
    expect(markup).toContain("Menú de tu cuenta: Laura Cardona");
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-controls="menu-cuenta-panel"');
  });

  it("no se muestra sin sesión", () => {
    expect(renderizar({ usuario: null })).toBe("");
  });

  it("calcula las iniciales del nombre", () => {
    expect(iniciales("Laura Cardona")).toBe("LC");
    expect(iniciales("mateo")).toBe("M");
    expect(iniciales("  Ana María López ")).toBe("AM");
  });
});
