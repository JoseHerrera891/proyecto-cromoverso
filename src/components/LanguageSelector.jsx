// US-CRO-S1-01 · Configurar el proyecto y el sistema de diseño
// US-CRO-S1-05 · Cambiar el idioma entre español e inglés
import "./LanguageSelector.css";

const IDIOMAS = ["es", "en"];

export default function LanguageSelector({
  idioma,
  cambiarIdioma,
  etiqueta,
  codigos = {},
  nombres = {},
  disabled = false,
}) {
  return (
    <div className="selector-idioma" role="group" aria-label={etiqueta}>
      {IDIOMAS.map((valor) => (
        <button
          type="button"
          key={valor}
          lang={valor}
          aria-pressed={idioma === valor}
          title={nombres[valor]}
          disabled={disabled}
          onClick={() => cambiarIdioma(valor)}
        >
          {codigos[valor] ?? valor.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
