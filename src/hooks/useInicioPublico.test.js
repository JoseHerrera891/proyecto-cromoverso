import { describe, expect, it, vi } from "vitest";
import {
  solicitarDatosInicio,
  validarDatosInicio,
} from "./useInicioPublico.js";

const lista = (cantidad, prefijo) =>
  Array.from({ length: cantidad }, (_, i) => ({
    id: `${prefijo}${i}`,
    nombre: `${prefijo}${i}`,
    color: "#123456",
    icono: "estrella",
    totalCromos: 20,
  }));
const mundos = lista(6, "m");
const rarezas = lista(4, "r");

describe("datos del inicio público", () => {
  it("valida seis mundos, cuatro rarezas y el total", () => {
    expect(
      validarDatosInicio(
        { datos: mundos, totalAlbum: 120 },
        { datos: rarezas },
      ),
    ).toEqual({ mundos, rarezas, totalAlbum: 120 });
  });

  it("rechaza listas incompletas", () => {
    expect(() =>
      validarDatosInicio(
        { datos: mundos.slice(1), totalAlbum: 100 },
        { datos: rarezas },
      ),
    ).toThrow("La respuesta de mundos no tiene el formato esperado.");
    expect(() =>
      validarDatosInicio(
        { datos: mundos, totalAlbum: 120 },
        { datos: rarezas.slice(1) },
      ),
    ).toThrow("La respuesta de rarezas no tiene el formato esperado.");
  });

  it("solicita ambos endpoints y rechaza errores HTTP", async () => {
    const fetcher = vi.fn((url) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            url.endsWith("/mundos")
              ? { datos: mundos, totalAlbum: 120 }
              : { datos: rarezas },
          ),
      }),
    );
    await expect(solicitarDatosInicio(undefined, fetcher)).resolves.toEqual({
      mundos,
      rarezas,
      totalAlbum: 120,
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
    await expect(
      solicitarDatosInicio(
        undefined,
        vi.fn().mockResolvedValue({
          ok: false,
          status: 503,
        }),
      ),
    ).rejects.toThrow("Error HTTP 503.");
  });
});
