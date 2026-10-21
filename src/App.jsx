import "./styles/App.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { useTextos } from "./hooks/useTextos.js";

function leerSeccion() {
  return window.location.pathname.split("/").filter(Boolean)[0] || "inicio";
}

export default function App() {
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [textoGrande, setTextoGrande] = useState(false);
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

  return (
    <Navbar
      {...datos}
      idioma={idioma}
      cambiarIdioma={setIdioma}
      activo={activo}
      onBuscar={buscar}
      textoGrande={textoGrande}
      alternarTexto={() => setTextoGrande((valor) => !valor)}
    />
  );
}
