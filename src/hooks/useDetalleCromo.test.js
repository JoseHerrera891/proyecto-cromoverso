import { describe, expect, it, vi } from "vitest";
import {
  obtenerCromosAdyacentes,
  solicitarDetalleCompleto,
  solicitarDetalleCromo,
  validarRarezaCromo,
} from "./useDetalleCromo.js";

const detalle = {
  id: "CV-001",
  holografico: true,
  numero: 1,
  nombre: "Voltia",
  mundo: "neon",
  mundoNombre: "Ciudad Neón",
  posicion: 1,
  rareza: "legendaria",
  tipo: "heroe",
  poder: "Descarga eléctrica",
  descripcion: "Cuida la ciudad.",
  ilustracion: { colorBase: "#7C4DFF", figura: "estrella" },
  atributos: { fuerza: 98, velocidad: 87, mente: 75, energia: 80 },
};

describe("solicitarDetalleCromo", () => {
  it("carga y valida el detalle por su identificador", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(detalle),
    });

    await expect(
      solicitarDetalleCromo("CV-001", undefined, fetcher),
    ).resolves.toEqual(detalle);
    expect(fetcher.mock.calls[0][0]).toMatch(/\/cromos\/CV-001$/);
  });

  it("rechaza respuestas inválidas y errores HTTP", async () => {
    const invocador = (respuesta) =>
      solicitarDetalleCromo(
        "CV-001",
        undefined,
        vi.fn().mockResolvedValue(respuesta),
      );

    await expect(
      invocador({
        ok: true,
        json: () => Promise.resolve({ ...detalle, numero: "1" }),
      }),
    ).rejects.toThrow("La respuesta del cromo no tiene el formato esperado.");
    const error = await invocador({ ok: false, status: 404 }).catch((e) => e);
    expect(error.message).toBe("Error HTTP 404.");
    expect(error.status).toBe(404);
  });
});

describe("solicitarDetalleCompleto", () => {
  it("suma la rareza y los cromos vecinos del mismo mundo", async () => {
    const fetcher = vi.fn((url) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            url.includes("/cromos/")
              ? detalle
              : url.includes("/mundos/")
                ? {
                    cromos: [
                      { id: "CV-001", posicion: 1 },
                      { id: "CV-002", posicion: 2 },
                    ],
                  }
                : {
                    datos: [
                      {
                        id: "legendaria",
                        nombre: "Legendaria",
                        icono: "corona",
                        color: "#C9A227",
                      },
                    ],
                  },
          ),
      }),
    );

    const cromo = await solicitarDetalleCompleto("CV-001", undefined, fetcher);

    expect(cromo.anterior).toBeNull();
    expect(cromo.siguiente.id).toBe("CV-002");
    expect(cromo.datosRareza.nombre).toBe("Legendaria");
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});

describe("obtenerCromosAdyacentes", () => {
  it("encuentra cromos anterior y siguiente y permite los extremos", () => {
    const cromos = [
      { id: "CV-001", posicion: 1 },
      { id: "CV-002", posicion: 2 },
      { id: "CV-003", posicion: 3 },
    ];

    expect(obtenerCromosAdyacentes(cromos[1], cromos)).toEqual({
      anterior: cromos[0],
      siguiente: cromos[2],
    });
    expect(obtenerCromosAdyacentes(cromos[0], cromos).anterior).toBeNull();
    expect(obtenerCromosAdyacentes(cromos[2], cromos).siguiente).toBeNull();
  });
});

describe("validarRarezaCromo", () => {
  it("encuentra la rareza con su nombre, icono y color", () => {
    const rarezas = [
      {
        id: "legendaria",
        nombre: "Legendaria",
        icono: "corona",
        color: "#C9A227",
      },
    ];

    expect(validarRarezaCromo("legendaria", rarezas)).toEqual(rarezas[0]);
    expect(() => validarRarezaCromo("mítica", rarezas)).toThrow(
      "No se encontró la rareza mítica.",
    );
  });
});
