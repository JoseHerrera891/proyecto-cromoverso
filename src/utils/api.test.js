import { describe, expect, it, vi } from "vitest";
import { cabecerasDeSimulacion, ErrorHttp, pedirJson } from "./api.js";

describe("cliente de la API", () => {
  it("activa las cabeceras de simulación desde la URL", () => {
    expect(
      cabecerasDeSimulacion("?simularLatencia=2000&simularError=503"),
    ).toEqual({
      "X-Simular-Latencia": "2000",
      "X-Simular-Error": "503",
    });
    expect(cabecerasDeSimulacion("?simularError=418")).toEqual({});
    expect(cabecerasDeSimulacion("")).toEqual({});
  });

  it("conserva el código HTTP y el código de error de la API", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: () =>
        Promise.resolve({ error: { codigo: "falla_simulada", mensaje: "x" } }),
    });

    const error = await pedirJson("mundos", { fetcher }).catch((e) => e);

    expect(error).toBeInstanceOf(ErrorHttp);
    expect(error.status).toBe(503);
    expect(error.codigo).toBe("falla_simulada");
  });

  it("devuelve el JSON de una respuesta correcta", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ datos: [] }),
    });

    await expect(pedirJson("rarezas", { fetcher })).resolves.toEqual({
      datos: [],
    });
    expect(fetcher.mock.calls[0][0]).toMatch(/\/rarezas$/);
  });
});
