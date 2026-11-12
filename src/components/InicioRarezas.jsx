import "./InicioRarezas.css";

export default function InicioRarezas({ rarezas }) {
  return (
    <ul className="inicio-rarezas">
      {rarezas.map((rareza) => (
        <li className="inicio-rarezas-item" key={rareza.id}>
          <span
            className={`inicio-rarezas-icono inicio-rarezas-icono--${rareza.icono}`}
            style={{ "--color-rareza": rareza.color }}
            aria-hidden="true"
          />
          <span>{rareza.nombre}</span>
        </li>
      ))}
    </ul>
  );
}
