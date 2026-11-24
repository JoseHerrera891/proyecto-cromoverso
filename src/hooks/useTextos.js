import { useEffect, useState } from "react";
import { API_BASE_URL, crearUrlApi } from "../utils/api.js";

export const SECCIONES = [
  "sitio",
  "navbar",
  "menuMovil",
  "estados",
  "accesibilidad",
  "cookies",
  "paginas",
  "footer",
  "idioma",
  "general",
];

export function validarTextos(datos) {
  const textos = datos?.textos;
  const nav = textos?.navbar;
  const menuMovil = textos?.menuMovil;
  const accesibilidad = textos?.accesibilidad;
  const bannerCookies = textos?.cookies?.banner;
  const footer = textos?.footer;
  const columnasFooter = footer?.columnas;
  const enlacesNavbar = Object.values(nav?.enlaces ?? {});
  const enlacesMoviles = Object.values(menuMovil?.enlaces ?? {});
  const enlacesFooter = [
    ...Object.values(columnasFooter?.explora?.enlaces ?? {}),
    ...Object.values(columnasFooter?.cuenta?.enlaces ?? {}),
    ...Object.values(columnasFooter?.legal?.enlaces ?? {}),
  ];
  const etiquetas = [
    nav?.logo?.texto,
    nav?.logo?.aria,
    ...enlacesNavbar,
    nav?.buscador?.placeholder,
    nav?.buscador?.aria,
    nav?.botones?.ingresar,
    nav?.botones?.crearCuenta,
    nav?.aria?.idioma,
    menuMovil?.abrir,
    menuMovil?.cerrar,
    ...enlacesMoviles,
    menuMovil?.botones?.ingresar,
    menuMovil?.botones?.crearCuenta,
    textos?.estados?.cargando,
    textos?.estados?.error?.texto,
    textos?.estados?.error?.botones?.reintentar,
    textos?.accesibilidad?.tamanoTexto?.titulo,
    textos?.accesibilidad?.tamanoTexto?.opciones?.normal,
    textos?.accesibilidad?.tamanoTexto?.opciones?.grande,
    accesibilidad?.titulo,
    accesibilidad?.botones?.abrir,
    accesibilidad?.botones?.restablecer,
    accesibilidad?.tamanoTexto?.opciones?.muyGrande,
    accesibilidad?.altoContraste?.titulo,
    accesibilidad?.altoContraste?.ayuda,
    accesibilidad?.reducirMovimiento?.titulo,
    accesibilidad?.reducirMovimiento?.ayuda,
    accesibilidad?.subrayarEnlaces?.titulo,
    accesibilidad?.subrayarEnlaces?.ayuda,
    accesibilidad?.fuenteLecturaFacil?.titulo,
    accesibilidad?.fuenteLecturaFacil?.ayuda,
    accesibilidad?.etiquetas?.encendido,
    accesibilidad?.etiquetas?.apagado,
    accesibilidad?.enlaces?.declaracion,
    bannerCookies?.titulo,
    bannerCookies?.texto,
    bannerCookies?.botones?.aceptar,
    bannerCookies?.botones?.rechazar,
    footer?.lema,
    columnasFooter?.explora?.titulo,
    ...Object.values(columnasFooter?.explora?.enlaces ?? {}),
    columnasFooter?.cuenta?.titulo,
    ...Object.values(columnasFooter?.cuenta?.enlaces ?? {}),
    columnasFooter?.legal?.titulo,
    ...Object.values(columnasFooter?.legal?.enlaces ?? {}),
    footer?.legal?.derechos,
    footer?.legal?.nota,
  ];

  if (
    !enlacesNavbar.length ||
    !enlacesMoviles.length ||
    !enlacesFooter.length ||
    !etiquetas.every((valor) => typeof valor === "string" && valor.trim())
  ) {
    throw new Error(
      "La respuesta no contiene todos los textos requeridos de la interfaz.",
    );
  }
  return textos;
}

/** GET /textos?idioma=…&seccion=… validado. */
export async function solicitarTextos(idioma, signal, fetcher = fetch) {
  if (!API_BASE_URL) {
    throw new Error("Falta configurar la variable VITE_API_BASE_URL.");
  }
  const parametros = new URLSearchParams({
    idioma,
    seccion: SECCIONES.join(","),
  });
  const respuesta = await fetcher(`${crearUrlApi("textos")}?${parametros}`, {
    signal,
  });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  return validarTextos(await respuesta.json());
}

// Textos ya descargados por idioma: volver a un idioma es instantáneo.
const textosPorIdioma = new Map();

/**
 * Textos de la interfaz en el idioma pedido. Mientras llegan los del idioma
 * nuevo se siguen mostrando los anteriores, para que la vista no se vacíe.
 */
export function useTextos(idioma) {
  const [estado, setEstado] = useState(() => ({
    textos: textosPorIdioma.get(idioma) ?? null,
    idiomaTextos: textosPorIdioma.has(idioma) ? idioma : null,
    error: false,
  }));
  const [intento, setIntento] = useState(0);
  const cargando = estado.idiomaTextos !== idioma && !estado.error;

  useEffect(() => {
    if (textosPorIdioma.has(idioma)) {
      setEstado({
        textos: textosPorIdioma.get(idioma),
        idiomaTextos: idioma,
        error: false,
      });
      return undefined;
    }
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setEstado((anterior) => ({ ...anterior, error: false }));

    solicitarTextos(idioma, controlador.signal)
      .then((textos) => {
        textosPorIdioma.set(idioma, textos);
        if (vigente) setEstado({ textos, idiomaTextos: idioma, error: false });
      })
      .catch((error) => {
        if (!vigente) return;
        console.error("Error al cargar los textos:", error);
        setEstado((anterior) => ({ ...anterior, error: true }));
      })
      .finally(() => clearTimeout(limite));

    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [idioma, intento]);

  return {
    textos: estado.textos,
    idiomaTextos: estado.idiomaTextos,
    cargando,
    error: estado.error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
