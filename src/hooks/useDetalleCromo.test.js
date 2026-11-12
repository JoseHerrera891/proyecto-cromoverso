import { describe, expect, it, vi } from "vitest";
import {
  obtenerCromosAdyacentes,
  solicitarDetalleCromo,
} from "./useDetalleCromo.js";

const detalle = {
  id: "CV-001",
  numero: 1,
  nombre: "Voltia",
  mundo: "neon",
  mundoNombre: "Ciudad Neón",
  posicion: 1,
  rareza: "legendaria",
  tipo: "heroe",
  poder: "Descarga eléctrica",
  descripcion: "Cuida la ciudad.",
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
    await expect(invocador({ ok: false, status: 404 })).rejects.toThrow(
      "Error HTTP 404.",
    );
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
