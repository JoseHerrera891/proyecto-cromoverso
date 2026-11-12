import "./Button.css";

export default function Button({
  children,
  variante = "primario",
  className = "",
  type = "button",
  ...props
}) {
  const clases = ["boton", `boton--${variante}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={clases} type={type} {...props}>
      {children}
    </button>
  );
}
