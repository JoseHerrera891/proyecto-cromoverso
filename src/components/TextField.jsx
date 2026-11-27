// US-CRO-S1-01 · Configurar el proyecto y el sistema de diseño
// US-CRO-S2-03 · Iniciar sesión
import { forwardRef, useId } from "react";
import Icono from "./Icono.jsx";
import "./TextField.css";

/**
 * Campo del sistema de diseño (Figma · «Campo»): etiqueta visible asociada,
 * descripción y error enlazados con aria-describedby y un accesorio opcional
 * dentro de la caja (por ejemplo, el botón para ver la contraseña).
 */
// US-CRO-S2-03 · C1 y C3: etiqueta asociada al campo y error junto a él.
const TextField = forwardRef(function TextField(
  {
    label,
    id,
    description,
    error,
    accesorio,
    "aria-describedby": ariaDescribedBy,
    className = "",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const describedBy = [
    ariaDescribedBy,
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`campo${className ? ` ${className}` : ""}`}>
      <label className="campo-etiqueta" htmlFor={inputId}>
        {label}
      </label>
      <div className="campo-caja">
        <input
          ref={ref}
          className="campo-control"
          id={inputId}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {accesorio}
      </div>
      {description && (
        <p className="campo-descripcion" id={descriptionId}>
          {description}
        </p>
      )}
      {error && (
        <p className="campo-error" id={errorId}>
          <Icono nombre="alerta" />
          {error}
        </p>
      )}
    </div>
  );
});

export default TextField;
