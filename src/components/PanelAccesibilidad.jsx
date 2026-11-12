import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Icono from "./Icono.jsx";
import "./PanelAccesibilidad.css";

const TAMANOS_TEXTO = ["normal", "grande", "muyGrande"];
const AJUSTES = [
  "altoContraste",
  "reducirMovimiento",
  "subrayarEnlaces",
  "fuenteLecturaFacil",
];

export default function PanelAccesibilidad({
  textos,
  preferencias,
  onCambiar,
  onRestablecer,
  onCerrar,
  botonAbrir,
  id,
}) {
  const panel = useRef(null);
  const tituloId = "panel-accesibilidad-titulo";
  const etiquetas = textos.etiquetas;

  useEffect(() => {
    const anterior = document.activeElement;
    const botonAbrirActual = botonAbrir?.current;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("button")?.focus();

    function gestionarTeclado(evento) {
      if (evento.key === "Escape") {
        onCerrar();
        return;
      }
      if (evento.key !== "Tab") return;
      const botones = [...panel.current.querySelectorAll("button, a")];
      const primero = botones[0];
      const ultimo = botones[botones.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", gestionarTeclado);
    return () => {
      document.removeEventListener("keydown", gestionarTeclado);
      document.body.style.overflow = overflowAnterior;
      if (botonAbrirActual) botonAbrirActual.focus();
      else anterior?.focus();
    };
  }, [botonAbrir, onCerrar]);

  const contenido = (
    <div
      className="accesibilidad-fondo"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar();
      }}
    >
      <section
        ref={panel}
        id={id}
        className="accesibilidad-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
      >
        <header className="accesibilidad-panel-encabezado">
          <h2 id={tituloId}>{textos.titulo}</h2>
          <button
            type="button"
            className="accesibilidad-cerrar"
            aria-label={textos.botones.cerrar}
            onClick={onCerrar}
          >
            <Icono nombre="cerrar" />
          </button>
        </header>

        <fieldset className="accesibilidad-tamano">
          <legend>{textos.tamanoTexto.titulo}</legend>
          <div className="accesibilidad-tamano-opciones">
            {TAMANOS_TEXTO.map((tamano) => (
              <button
                type="button"
                key={tamano}
                aria-pressed={preferencias.tamanoTexto === tamano}
                onClick={() => onCambiar("tamanoTexto", tamano)}
              >
                {textos.tamanoTexto.opciones[tamano]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="accesibilidad-ajustes">
          {AJUSTES.map((ajuste) => (
            <div className="accesibilidad-ajuste" key={ajuste}>
              <div>
                <h3>{textos[ajuste].titulo}</h3>
                <p>{textos[ajuste].ayuda}</p>
              </div>
              <button
                className="accesibilidad-interruptor"
                type="button"
                role="switch"
                aria-checked={preferencias[ajuste]}
                aria-label={`${textos[ajuste].titulo}: ${
                  preferencias[ajuste] ? etiquetas.encendido : etiquetas.apagado
                }`}
                onClick={() => onCambiar(ajuste, !preferencias[ajuste])}
              >
                <span aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <footer className="accesibilidad-panel-pie">
          <Link to="/accesibilidad" onClick={onCerrar}>
            {textos.enlaces.declaracion}
          </Link>
          <button
            className="accesibilidad-restablecer"
            type="button"
            onClick={onRestablecer}
          >
            {textos.botones.restablecer}
          </button>
        </footer>
      </section>
    </div>
  );

  return typeof document === "undefined"
    ? contenido
    : createPortal(contenido, document.body);
}
