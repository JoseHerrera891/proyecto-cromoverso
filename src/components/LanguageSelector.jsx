import Icono from "./Icono.jsx";
import "./LanguageSelector.css";

export default function LanguageSelector({ idioma, cambiarIdioma, etiqueta }) {
  return (
    <label className="selector-idioma">
      <Icono nombre="idioma" />
      <select
        value={idioma}
        onChange={(evento) => cambiarIdioma(evento.target.value)}
        aria-label={etiqueta}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </label>
  );
}
