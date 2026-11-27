// US-CRO-S1-01 · Configurar el proyecto y el sistema de diseño
import "./Card.css";

export default function Card({ children, className = "", ...props }) {
  const clases = ["tarjeta", className].filter(Boolean).join(" ");

  return (
    <div className={clases} {...props}>
      {children}
    </div>
  );
}
