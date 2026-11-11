import { useId } from "react";
import "./TextField.css";

export default function TextField({
  label,
  id,
  description,
  error,
  "aria-describedby": ariaDescribedBy,
  className = "",
  ...props
}) {
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
      <input
        className="campo-control"
        id={inputId}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {description && (
        <p className="campo-descripcion" id={descriptionId}>
          {description}
        </p>
      )}
      {error && (
        <p className="campo-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
