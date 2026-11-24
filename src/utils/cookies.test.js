import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  decidioCookies,
  guardarConsentimiento,
  idiomaGuardado,
  recordarIdioma,
} from "./cookies.js";

// Simula document.cookie: guarda cada cookie y borra las de Max-Age=0.
function simularDocumento() {
  const tarro = new Map();
  globalThis.document = {
    get cookie() {
      return [...tarro].map(([n, v]) => `${n}=${v}`).join("; ");
    },
    set cookie(valor) {
      const [par, ...atributos] = valor.split("; ");
      const [nombre, contenido] = par.split("=");
      if (atributos.includes("Max-Age=0")) tarro.delete(nombre);
      else tarro.set(nombre, contenido);
    },
  };
}

describe("cookies de consentimiento e idioma", () => {
  beforeEach(simularDocumento);
  afterEach(() => delete globalThis.document);

  it("muestra el aviso solo hasta que la persona decide", () => {
    expect(decidioCookies()).toBe(false);
    guardarConsentimiento("rechazado", "en");
    expect(decidioCookies()).toBe(true);
  });

  it("guarda y recuerda el idioma si la persona acepta", () => {
    guardarConsentimiento("aceptado", "es");
    recordarIdioma("en");

    expect(document.cookie).toContain("idioma=en");
    expect(idiomaGuardado()).toBe("en");
  });

  it("no guarda el idioma si la persona rechaza", () => {
    guardarConsentimiento("rechazado", "en");
    recordarIdioma("en");

    expect(document.cookie).toBe("consentimiento=rechazado");
    expect(idiomaGuardado()).toBe("es");
  });

  it("ignora una cookie de idioma sin consentimiento o con valor inválido", () => {
    expect(idiomaGuardado("idioma=en")).toBe("es");
    expect(idiomaGuardado("consentimiento=aceptado; idioma=fr")).toBe("es");
  });
});
