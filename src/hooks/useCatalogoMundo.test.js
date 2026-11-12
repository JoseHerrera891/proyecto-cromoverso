import { describe, expect, it, vi } from "vitest";
import { solicitarDatosCatalogo } from "./useCatalogoMundo.js";

const mundo = { id: "neon", nombre: "Ciudad Neón" };
const cromos = [
  { id: "CV-001", nombre: "Voltia", rareza: "rara", tipo: "heroe" },
];
const rarezas = [
  { id: "rara", nombre: "Rara", icono: "rombo", color: "#2F6FED" },
];

describe("solicitarDatosCatalogo", () => {
  it("carga mundo, cromos y rarezas aplicando filtros", async () => {
    const fetcher = vi.fn((url) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            url.endsWith("/mundos/neon")
              ? mundo
              : url.includes("/cromos?")
                ? { datos: cromos, paginacion: { total: 1 } }
                : { datos: rarezas },
          ),
      }),
    );

    await expect(
      solicitarDatosCatalogo(
        "neon",
        { rareza: "rara", tipo: "heroe" },
        undefined,
        fetcher,
      ),
    ).resolves.toEqual({
      mundo,
      cromos,
      rarezas,
      paginacion: { total: 1 },
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(fetcher.mock.calls[1][0]).toContain(
      "mundo=neon&rareza=rara&tipo=heroe",
    );
  });

  it("informa errores HTTP del catálogo", async () => {
    await expect(
      solicitarDatosCatalogo(
        "neon",
        {},
        undefined,
        vi.fn().mockResolvedValue({ ok: false, status: 503 }),
      ),
    ).rejects.toThrow("Error HTTP 503.");
  });
});
