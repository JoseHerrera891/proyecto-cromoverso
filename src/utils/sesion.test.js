import { describe, expect, it, vi } from "vitest";
import { segundosDeEspera } from "./api.js";
import { iniciarSesion } from "./sesion.js";

const usuario = { id: "usr_laura", nombre: "Laura Cardona" };

function respuesta({ ok = true, status = 201, cuerpo, cabeceras = {} }) {
  return Promise.resolve({
    ok,
    status,
    headers: new Headers(cabeceras),
    json: () => Promise.resolve(cuerpo),
  });
}

describe("iniciar sesión", () => {
  it("envía correo y clave con la cookie de sesión y devuelve solo el usuario", async () => {
    const fetcher = vi.fn(() =>
      respuesta({ cuerpo: { usuario, token: "secreto" } }),
    );

    const resultado = await iniciarSesion(
      { correo: "laura@cromoverso.test", clave: "cromos2026" },
      { fetcher },
    );

    expect(resultado).toEqual(usuario);
    expect(JSON.stringify(resultado)).not.toContain("secreto");
    const [url, opciones] = fetcher.mock.calls[0];
    expect(url).toMatch(/\/sesion$/);
    expect(opciones.method).toBe("POST");
    expect(opciones.credentials).toBe("include");
    expect(JSON.parse(opciones.body)).toEqual({
      correo: "laura@cromoverso.test",
      clave: "cromos2026",
    });
  });

  it("conserva el código, los campos y la espera de los errores", async () => {
    const credenciales = await iniciarSesion(
      { correo: "a@b.co", clave: "x" },
      {
        fetcher: () =>
          respuesta({
            ok: false,
            status: 401,
            cuerpo: { error: { codigo: "credenciales_invalidas" } },
          }),
      },
    ).catch((e) => e);
    expect(credenciales.codigo).toBe("credenciales_invalidas");

    const bloqueo = await iniciarSesion(
      { correo: "a@b.co", clave: "x" },
      {
        fetcher: () =>
          respuesta({
            ok: false,
            status: 429,
            cuerpo: { error: { codigo: "demasiadas_peticiones" } },
            cabeceras: { "Retry-After": "30" },
          }),
      },
    ).catch((e) => e);
    expect(bloqueo.reintentarEn).toBe(30);
  });

  it("interpreta Retry-After en segundos o como fecha", () => {
    const ahora = Date.parse("2026-11-25T10:00:00Z");
    expect(segundosDeEspera("12")).toBe(12);
    expect(segundosDeEspera("Wed, 25 Nov 2026 10:00:45 GMT", ahora)).toBe(45);
    expect(segundosDeEspera(null)).toBeNull();
  });
});
