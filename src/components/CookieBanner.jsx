import Button from "./Button.jsx";
import "./CookieBanner.css";

export default function CookieBanner({ textos, onAceptar, onRechazar }) {
  if (!textos?.titulo || !textos?.texto || !textos?.botones) return null;

  const tituloId = "aviso-cookies-titulo";
  const textoId = "aviso-cookies-texto";

  return (
    <aside
      className="aviso-cookies"
      aria-labelledby={tituloId}
      aria-describedby={textoId}
    >
      <h2 className="aviso-cookies-titulo" id={tituloId}>
        {textos.titulo}
      </h2>
      <p className="aviso-cookies-texto" id={textoId}>
        {textos.texto}
      </p>
      <div className="aviso-cookies-acciones">
        <Button variante="secundario" onClick={onRechazar}>
          {textos.botones.rechazar}
        </Button>
        <Button variante="secundario" onClick={onAceptar}>
          {textos.botones.aceptar}
        </Button>
      </div>
    </aside>
  );
}
