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
    ).toEqual({ mundos, rarezas, destacados: [], totalAlbum: 120 });
  });

  it("destaca hasta tres guardianas que tienen arte en Figma", () => {
    const guardiana = (id) => ({ id, nombre: id, mundoNombre: "Mundo" });
    const { destacados } = validarDatosInicio(
      { datos: mundos, totalAlbum: 120 },
      { datos: rarezas },
      {
        datos: ["CV-001", "CV-021", "CV-041", "CV-081", "CV-101"].map(
          guardiana,
        ),
      },
    );

    expect(destacados.map(({ id }) => id)).toEqual([
      "CV-001",
      "CV-041",
      "CV-081",
    ]);
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

  it("solicita mundos, rarezas y guardianas, y rechaza errores HTTP", async () => {
    const fetcher = vi.fn((url) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            url.endsWith("/mundos")
              ? { datos: mundos, totalAlbum: 120 }
              : url.endsWith("/rarezas")
                ? { datos: rarezas }
                : { datos: [] },
          ),
      }),
    );
    await expect(solicitarDatosInicio(undefined, fetcher)).resolves.toEqual({
      mundos,
      rarezas,
      destacados: [],
      totalAlbum: 120,
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(fetcher.mock.calls[2][0]).toContain(
      "cromos?rareza=legendaria&tipo=heroe",
    );
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
