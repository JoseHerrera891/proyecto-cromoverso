// US-CRO-S1-02 · Navegar por el sitio en web y móvil
// US-CRO-S1-05 · Cambiar el idioma entre español e inglés
// US-CRO-S1-06 · Aceptar o rechazar las cookies
import "./styles/App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import InicioPublico from "./components/InicioPublico.jsx";

// Cada vista se descarga solo cuando se visita.
const CatalogoMundo = lazy(() => import("./components/CatalogoMundo.jsx"));
const PrimerMundo = lazy(() => import("./components/PrimerMundo.jsx"));
const DetalleCromo = lazy(() => import("./components/DetalleCromo.jsx"));
const Ingresar = lazy(() => import("./components/Ingresar.jsx"));
// Vistas con su propio diseño a pantalla completa, sin barra ni pie del sitio.
const RUTAS_PANTALLA_COMPLETA = ["/ingresar"];
import CookieBanner from "./components/CookieBanner.jsx";
import { useTextos } from "./hooks/useTextos.js";
import { obtenerTituloPagina } from "./utils/tituloPagina.js";
import {
  decidioCookies,
  guardarConsentimiento,
  idiomaGuardado,
  recordarIdioma,
} from "./utils/cookies.js";

// Etiquetas lang que indica la API (textos.idioma.mensajes.recordatorioMovil).
const ETIQUETAS_LANG = { es: "es-CO", en: "en" };
const PREFERENCIAS_ACCESIBILIDAD_INICIALES = {
  tamanoTexto: "normal",
  altoContraste: false,
  reducirMovimiento: false,
  subrayarEnlaces: false,
  fuenteLecturaFacil: false,
};

// US-CRO-S1-02 · C1: encabezado y pie en todas las vistas (salvo /ingresar, pantalla completa).
export default function App() {
  const [idioma, setIdioma] = useState(() => idiomaGuardado());
  const [preferenciasAccesibilidad, setPreferenciasAccesibilidad] = useState(
    PREFERENCIAS_ACCESIBILIDAD_INICIALES,
  );
  const [mostrarAvisoCookies, setMostrarAvisoCookies] = useState(
    () => !decidioCookies(),
  );
  const { pathname } = useLocation();
  const activo = pathname.split("/").filter(Boolean)[0] || "inicio";
  const pantallaCompleta = RUTAS_PANTALLA_COMPLETA.includes(pathname);
  const datos = useTextos(idioma);
  const tituloPagina = obtenerTituloPagina(pathname, datos.textos);

  // US-CRO-S1-05 · C3: <html lang> cambia con el idioma.
  // El atributo lang sigue al idioma de los textos que se ven en pantalla.
  const idiomaVisible = datos.idiomaTextos ?? idioma;
  useEffect(() => {
    document.documentElement.lang = ETIQUETAS_LANG[idiomaVisible];
  }, [idiomaVisible]);

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.dataset.tamanoTexto = preferenciasAccesibilidad.tamanoTexto;
    raiz.dataset.altoContraste = String(
      preferenciasAccesibilidad.altoContraste,
    );
    raiz.dataset.reducirMovimiento = String(
      preferenciasAccesibilidad.reducirMovimiento,
    );
    raiz.dataset.subrayarEnlaces = String(
      preferenciasAccesibilidad.subrayarEnlaces,
    );
    raiz.dataset.fuenteLecturaFacil = String(
      preferenciasAccesibilidad.fuenteLecturaFacil,
    );
  }, [preferenciasAccesibilidad]);

  function cambiarPreferenciaAccesibilidad(nombre, valor) {
    setPreferenciasAccesibilidad((actuales) => ({
      ...actuales,
      [nombre]: valor,
    }));
  }

  function cambiarIdioma(nuevoIdioma) {
    setIdioma(nuevoIdioma);
    recordarIdioma(nuevoIdioma);
  }

  function decidirCookies(valor) {
    guardarConsentimiento(valor, idioma);
    setMostrarAvisoCookies(false);
  }

  return (
    <>
      <div className="sitio">
        {datos.textos?.general?.aria?.saltarAlContenido && (
          <a className="saltar-contenido" href="#contenido-principal">
            {datos.textos.general.aria.saltarAlContenido}
          </a>
        )}
        {!pantallaCompleta && (
          <Navbar
            {...datos}
            idioma={idioma}
            cambiarIdioma={cambiarIdioma}
            activo={activo}
            tono={pathname === "/" ? "oscuro" : "claro"}
            ocultarEnMovil={/^\/(mundos|cromos)\/[^/]+/.test(pathname)}
            preferenciasAccesibilidad={preferenciasAccesibilidad}
            onCambiarAccesibilidad={cambiarPreferenciaAccesibilidad}
            onRestablecerAccesibilidad={() =>
              setPreferenciasAccesibilidad(PREFERENCIAS_ACCESIBILIDAD_INICIALES)
            }
          />
        )}
        <main id="contenido-principal" tabIndex={-1}>
          <Suspense fallback={null}>
            {/^\/mundos\/?$/.test(pathname) ? (
              <PrimerMundo textos={datos.textos} />
            ) : pathname === "/" ? (
              <InicioPublico textos={datos.textos} />
            ) : pathname.startsWith("/mundos/") ? (
              <CatalogoMundo
                id={decodeURIComponent(pathname.split("/")[2])}
                textos={datos.textos}
              />
            ) : pathname === "/ingresar" ? (
              <Ingresar textos={datos.textos} />
            ) : pathname.startsWith("/cromos/") ? (
              <DetalleCromo
                id={decodeURIComponent(pathname.split("/")[2] ?? "")}
                textos={datos.textos}
              />
            ) : (
              <div className="contenedor">
                <h1>{tituloPagina}</h1>
              </div>
            )}
          </Suspense>
        </main>
        {!pantallaCompleta && <Footer textos={datos.textos} idioma={idioma} />}
      </div>
      {/* US-CRO-S1-06 · C1: aviso de cookies en la primera visita. */}
      {mostrarAvisoCookies && datos.textos?.cookies?.banner && (
        <CookieBanner
          texts={datos.textos.cookies.banner}
          onAccept={() => decidirCookies("aceptado")}
          onReject={() => decidirCookies("rechazado")}
        />
      )}
    </>
  );
}
