import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

function validarTextos(datos) {
  const textos = datos?.textos;
  const nav = textos?.navbar;
  const menuMovil = textos?.menuMovil;
  const enlacesNavbar = Object.values(nav?.enlaces ?? {});
  const enlacesMoviles = Object.values(menuMovil?.enlaces ?? {});
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
  ];

  if (
    !enlacesNavbar.length ||
    !enlacesMoviles.length ||
    !etiquetas.every((valor) => typeof valor === "string" && valor.trim())
  ) {
    throw new Error(
      "La respuesta no contiene los textos requeridos del Navbar.",
    );
  }
  return textos;
}

export function useTextos(idioma) {
  const [textos, setTextos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setCargando(true);
    setError(false);
    setTextos(null);

    async function cargarTextosNavbar() {
      try {
        if (!API) {
          throw new Error("Falta configurar la variable VITE_API_BASE_URL.");
        }
        const respuesta = await fetch(
          `${API}/textos?idioma=${idioma}&seccion=navbar,menuMovil,estados,accesibilidad`,
          {
            signal: controlador.signal,
          },
        );
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        const nuevosTextos = validarTextos(datos);
        if (vigente) setTextos(nuevosTextos);
      } catch (error) {
        if (vigente) {
          console.error("Error al cargar los textos:", error);
          setError(true);
        }
      } finally {
        clearTimeout(limite);
        if (vigente) setCargando(false);
      }
    }

    cargarTextosNavbar();
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [idioma, intento]);

  return {
    textos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
