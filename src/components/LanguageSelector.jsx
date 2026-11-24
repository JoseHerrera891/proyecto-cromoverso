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
          aria-label={nombres[valor]}
          disabled={disabled}
          onClick={() => cambiarIdioma(valor)}
        >
          {codigos[valor] ?? valor.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
