import Icono from "./Icono.jsx";
import "./LanguageSelector.css";

export default function LanguageSelector({ idioma, cambiarIdioma, etiqueta }) {
  return (
    <div className="selector-idioma" role="group" aria-label={etiqueta}>
      <Icono nombre="idioma" />
      {["es", "en"].map((valor) => (
        <button
          type="button"
          key={valor}
          lang={valor}
          aria-pressed={idioma === valor}
          onClick={() => cambiarIdioma(valor)}
        >
          {valor.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
