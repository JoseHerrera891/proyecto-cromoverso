import "./styles/App.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import InicioHero from "./components/InicioHero.jsx";
import InicioMundos from "./components/InicioMundos.jsx";
import CatalogoMundo from "./components/CatalogoMundo.jsx";
import DetalleCromo from "./components/DetalleCromo.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import { useTextos } from "./hooks/useTextos.js";
import { obtenerTituloPagina } from "./utils/tituloPagina.js";

const COOKIE_CONSENT_NAME = "consentimiento";
const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365;
const LANGUAGE_COOKIE_NAME = "idioma";

function leerCookie(nombre) {
  const prefijo = `${nombre}=`;
  const cookie = document.cookie
    .split("; ")
    .find((valor) => valor.startsWith(prefijo));
  return cookie?.slice(prefijo.length);
}

function leerIdiomaInicial() {
  if (leerCookie(COOKIE_CONSENT_NAME) !== "aceptado") return "es";
  return leerCookie(LANGUAGE_COOKIE_NAME) === "en" ? "en" : "es";
}

export default function App() {
  const [idioma, setIdioma] = useState(leerIdiomaInicial);
  const [textoGrande, setTextoGrande] = useState(false);
  const [mostrarAvisoCookies, setMostrarAvisoCookies] = useState(
    () => !leerCookie(COOKIE_CONSENT_NAME),
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activo = pathname.split("/").filter(Boolean)[0] || "inicio";
  const datos = useTextos(idioma);
  const tituloPagina = obtenerTituloPagina(pathname, datos.textos);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

  function buscar(consulta) {
    const parametros = new URLSearchParams({ q: consulta });
    navigate(`/cromos?${parametros}`);
  }

  function cambiarIdioma(nuevoIdioma) {
    setIdioma(nuevoIdioma);
    if (leerCookie(COOKIE_CONSENT_NAME) === "aceptado") {
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${nuevoIdioma}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax`;
    }
  }

  function guardarConsentimiento(valor) {
    document.cookie = `${COOKIE_CONSENT_NAME}=${valor}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax`;
    if (valor === "aceptado") {
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${idioma}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax`;
    } else {
      document.cookie = `${LANGUAGE_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
    setMostrarAvisoCookies(false);
  }

  return (
    <>
      <div className="sitio">
        <Navbar
          {...datos}
          idioma={idioma}
          cambiarIdioma={cambiarIdioma}
          activo={activo}
          onBuscar={buscar}
          textoGrande={textoGrande}
          alternarTexto={() => setTextoGrande((valor) => !valor)}
        />
        <main id="contenido-principal" className="contenedor">
          {pathname === "/" ? (
            <>
              <InicioHero textos={datos.textos} />
              <InicioMundos textos={datos.textos} />
            </>
          ) : pathname.startsWith("/mundos/") ? (
            <CatalogoMundo
              id={pathname.split("/")[2] ?? ""}
              textos={datos.textos}
            />
          ) : pathname.startsWith("/cromos/") ? (
            <DetalleCromo
              id={pathname.split("/")[2] ?? ""}
              textos={datos.textos}
            />
          ) : (
            <h1>{tituloPagina}</h1>
          )}
        </main>
        <Footer textos={datos.textos} idioma={idioma} />
      </div>
      {mostrarAvisoCookies && datos.textos?.cookies?.banner && (
        <CookieBanner
          texts={datos.textos.cookies.banner}
          onAccept={() => guardarConsentimiento("aceptado")}
          onReject={() => guardarConsentimiento("rechazado")}
        />
      )}
    </>
  );
}
