import { useId } from "react";
import Button from "./Button.jsx";
import "./CookieBanner.css";

export default function CookieBanner({ texts, onAccept, onReject }) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <aside
      className="cookie-banner"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="cookie-banner-copy">
        <h2 className="cookie-banner-title" id={titleId}>
          {texts.titulo}
        </h2>
        <p className="cookie-banner-description" id={descriptionId}>
          {texts.texto}
        </p>
      </div>
      <div className="cookie-banner-actions">
        <Button variante="secundario" onClick={onReject}>
          {texts.botones.rechazar}
        </Button>
        <Button variante="primario" onClick={onAccept}>
          {texts.botones.aceptar}
        </Button>
      </div>
    </aside>
  );
}
