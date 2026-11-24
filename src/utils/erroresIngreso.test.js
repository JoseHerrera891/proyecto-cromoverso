import { describe, expect, it } from "vitest";
import { ErrorHttp } from "./api.js";
import { avisoDeError } from "./erroresIngreso.js";

const pagina = {
  errores: {
    camposObligatorios: { titulo: "Revisa los campos marcados" },
    credenciales: {
      titulo: "Correo o contraseña incorrectos",
      texto: "Revisa",
    },
    demasiadosIntentos: {
      titulo: "Demasiados intentos",
      texto: "Espera {segundos} segundos.",
    },
    conexion: { titulo: "No pudimos conectarnos", texto: "Revisa tu red" },
  },
};
const textos = {
  estados: { error: { titulo: "No se pudo cargar", texto: "Algo falló" } },
  errores: {
    validacion: "Revisa los datos marcados.",
    falla_simulada: "El servidor no respondió.",
    generico: "Algo salió mal.",
  },
};

describe("avisos del formulario de ingreso", () => {
  it("401 muestra un solo mensaje sin señalar un campo", () => {
    const r = avisoDeError(
      new ErrorHttp(401, "credenciales_invalidas"),
      pagina,
      textos,
    );
    expect(r.tipo).toBe("credenciales");
    expect(r.aviso.titulo).toBe("Correo o contraseña incorrectos");
    expect(r.campos).toBeUndefined();
  });

  it("429 bloquea durante los segundos de Retry-After", () => {
    const r = avisoDeError(
      new ErrorHttp(429, "demasiadas_peticiones", { reintentarEn: 42 }),
      pagina,
      textos,
    );
    expect(r).toMatchObject({ tipo: "bloqueo", segundos: 42 });
  });

  it("sin red muestra el error de conexión", () => {
    const r = avisoDeError(new TypeError("Failed to fetch"), pagina, textos);
    expect(r.tipo).toBe("conexion");
    expect(r.aviso.titulo).toBe("No pudimos conectarnos");
  });

  it("422 lleva los mensajes de la API a cada campo", () => {
    const r = avisoDeError(
      new ErrorHttp(422, "validacion", {
        campos: { correo: "El correo no es válido." },
      }),
      pagina,
      textos,
    );
    expect(r.campos).toEqual({ correo: "El correo no es válido." });
    expect(r.aviso.texto).toBe("Revisa los datos marcados.");
  });

  it("otros errores usan textos.errores según el código", () => {
    expect(
      avisoDeError(new ErrorHttp(503, "falla_simulada"), pagina, textos).aviso
        .texto,
    ).toBe("El servidor no respondió.");
    expect(
      avisoDeError(new ErrorHttp(500, "desconocido"), pagina, textos).aviso
        .texto,
    ).toBe("Algo salió mal.");
  });
});
