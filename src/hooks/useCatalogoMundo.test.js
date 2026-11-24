import { describe, expect, it, vi } from "vitest";
import {
  ErrorHttp,
  solicitarCromos,
  solicitarMundo,
} from "./useCatalogoMundo.js";

const mundo = {
  id: "neon",
  nombre: "Ciudad Neón",
  cromos: [{ id: "CV-001", rareza: "rara", tipo: "heroe" }],
};
const mundos = {
  datos: [{ id: "neon", nombre: "Ciudad Neón", totalCromos: 20 }],
};
const rarezas = {
  datos: [{ id: "rara", nombre: "Rara", icono: "rombo", color: "#2F6FED" }],
};

function respuesta(datos, ok = true, status = 200) {
  return Promise.resolve({ ok, status, json: () => Promise.resolve(datos) });
}

describe("datos del catálogo", () => {
  it("carga el mundo, las rarezas y la lista de mundos", async () => {
    const fetcher = vi.fn((url) =>
      respuesta(
        url.endsWith("/mundos/neon")
          ? mundo
          : url.endsWith("/mundos")
            ? mundos
            : rarezas,
      ),
    );

    await expect(solicitarMundo("neon", undefined, fetcher)).resolves.toEqual({
      mundo,
      rarezas: rarezas.datos,
      mundos: mundos.datos,
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("pide los cromos con los filtros y los ordena por número", async () => {
    const fetcher = vi.fn(() =>
      respuesta({
        datos: [
          {
            id: "CV-002",
            numero: 2,
            nombre: "B",
            rareza: "rara",
            tipo: "heroe",
          },
          {
            id: "CV-001",
            numero: 1,
            nombre: "A",
            rareza: "rara",
            tipo: "heroe",
          },
        ],
      }),
    );

    const cromos = await solicitarCromos(
      "neon",
      { rareza: "rara", tipo: "heroe" },
      undefined,
      fetcher,
    );

    expect(cromos.map(({ id }) => id)).toEqual(["CV-001", "CV-002"]);
    expect(fetcher.mock.calls[0][0]).toContain(
      "cromos?mundo=neon&porPagina=100&rareza=rara&tipo=heroe",
    );
  });

  it("conserva el código HTTP para distinguir un mundo inexistente", async () => {
    const error = await solicitarMundo(
      "nada",
      undefined,
      vi.fn(() => respuesta({}, false, 404)),
    ).catch((e) => e);

    expect(error).toBeInstanceOf(ErrorHttp);
    expect(error.status).toBe(404);
  });
});
