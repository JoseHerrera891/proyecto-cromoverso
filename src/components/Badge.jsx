import "./Badge.css";

const VARIANTES = ["comun", "rara", "epica", "legendaria"];

export default function Badge({
  children,
  rareza = "comun",
  className = "",
  ...props
}) {
  if (!VARIANTES.includes(rareza)) {
    throw new Error(`Rareza de etiqueta no válida: ${rareza}`);
  }

  const clases = ["etiqueta", `etiqueta--${rareza}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={clases} {...props}>
      {children}
    </span>
  );
}
