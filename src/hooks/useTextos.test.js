import { describe, expect, it } from "vitest";
import { validarTextos } from "./useTextos.js";

const textosRequeridos = {
  navbar: {
    logo: { texto: "Cromoverso", aria: "Ir al inicio" },
    enlaces: { inicio: "Inicio", mundos: "Mundos" },
    buscador: { placeholder: "Buscar", aria: "Buscar cromos" },
    botones: { ingresar: "Ingresar", crearCuenta: "Crear cuenta" },
    aria: { idioma: "Cambiar idioma" },
  },
  menuMovil: {
    abrir: "Abrir menú",
    cerrar: "Cerrar menú",
    enlaces: { inicio: "Inicio", mundos: "Mundos" },
    botones: { ingresar: "Ingresar", crearCuenta: "Crear cuenta" },
  },
  estados: {
    cargando: "Cargando",
    error: { texto: "Error", botones: { reintentar: "Reintentar" } },
  },
  accesibilidad: {
    titulo: "Accesibilidad",
    botones: { abrir: "Abrir opciones", restablecer: "Restablecer" },
    tamanoTexto: {
      titulo: "Tamaño del texto",
      opciones: { normal: "Normal", grande: "Grande", muyGrande: "Muy grande" },
    },
    altoContraste: { titulo: "Alto contraste", ayuda: "Más contraste" },
    reducirMovimiento: { titulo: "Reducir movimiento", ayuda: "Menos movimiento" },
    subrayarEnlaces: { titulo: "Subrayar enlaces", ayuda: "Más claridad" },
    fuenteLecturaFacil: { titulo: "Lectura fácil", ayuda: "Más legible" },
    etiquetas: { encendido: "Encendido", apagado: "Apagado" },
    enlaces: { declaracion: "Declaración de accesibilidad" },
  },
  cookies: {
    banner: {
      titulo: "Usamos cookies",
      texto: "Puedes aceptar o rechazar las cookies.",
      botones: { aceptar: "Aceptar", rechazar: "Rechazar" },
    },
  },
  footer: {
    lema: "Colecciona aventuras",
    columnas: {
      explora: {
        titulo: "Explora",
        enlaces: { inicio: "Inicio", mundos: "Mundos" },
      },
      cuenta: {
        titulo: "Tu cuenta",
        enlaces: { ingresar: "Ingresar", crearCuenta: "Crear cuenta" },
      },
      legal: {
        titulo: "Legal",
        enlaces: { terminos: "Términos", accesibilidad: "Accesibilidad" },
      },
    },
    legal: {
      derechos: "© {anio} Cromoverso",
      nota: "Todos los derechos reservados.",
    },
  },
};

describe("validarTextos", () => {
  it("accepts API navigation links and cookie banner text", () => {
    expect(validarTextos({ textos: textosRequeridos })).toEqual(
      textosRequeridos,
    );
  });

  it("rejects a response missing required cookie text", () => {
    const datos = {
      textos: {
        ...textosRequeridos,
        cookies: { banner: { ...textosRequeridos.cookies.banner, texto: "" } },
      },
    };

    expect(() => validarTextos(datos)).toThrow(
      "La respuesta no contiene todos los textos requeridos de la interfaz.",
    );
  });

  it("rejects a response missing required footer text", () => {
    const datos = {
      textos: {
        ...textosRequeridos,
        footer: { ...textosRequeridos.footer, lema: "" },
      },
    };

    expect(() => validarTextos(datos)).toThrow(
      "La respuesta no contiene todos los textos requeridos de la interfaz.",
    );
  });
});
