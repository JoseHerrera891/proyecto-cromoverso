import "./styles/App.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import { useTextos } from "./hooks/useTextos.js";

const COOKIE_CONSENT_NAME = "consentimiento";
const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

function leerSeccion() {
  return window.location.pathname.split("/").filter(Boolean)[0] || "inicio";
}

function leerConsentimiento() {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${COOKIE_CONSENT_NAME}=`));
}

export default function App() {
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [textoGrande, setTextoGrande] = useState(false);
  const [mostrarAvisoCookies, setMostrarAvisoCookies] = useState(
    () => !leerConsentimiento(),
  );
  const datos = useTextos(idioma);

  useEffect(() => {
    function actualizar() {
      setActivo(leerSeccion());
    }
    window.addEventListener("popstate", actualizar);
    return () => window.removeEventListener("popstate", actualizar);
  }, []);

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
    window.history.pushState(null, "", `/cromos?${parametros}`);
    setActivo("cromos");
  }

  function guardarConsentimiento(valor) {
    document.cookie = `${COOKIE_CONSENT_NAME}=${valor}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax`;
    setMostrarAvisoCookies(false);
  }

  return (
    <>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onBuscar={buscar}
        textoGrande={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />
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
