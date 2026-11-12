import { Link } from "react-router-dom";
import { useDetalleCromo } from "../hooks/useDetalleCromo.js";
import "./DetalleCromo.css";

function insertarVariables(plantilla, variables) {
  return Object.entries(variables).reduce(
    (texto, [clave, valor]) => texto.replaceAll(`{${clave}}`, String(valor)),
    plantilla,
  );
}

export default function DetalleCromo({ id, textos }) {
  const { cromo, cargando, error, noEncontrado, recargar } =
    useDetalleCromo(id);
  const pagina = textos?.paginas?.detalleCromo;
  const atributos = pagina?.atributos;
  const estados = textos?.estados;

  if (cargando || !pagina) {
    return (
      <p className="detalle-cromo-estado" role="status">
        {estados?.cargando}
      </p>
    );
  }

  if (error || !cromo) {
    if (noEncontrado) {
      return (
        <div className="detalle-cromo-estado" role="alert">
          <h1>{pagina.noEncontrado.titulo}</h1>
          <p>{pagina.noEncontrado.texto}</p>
          <Link to="/">{pagina.noEncontrado.botones.volver}</Link>
        </div>
      );
    }

    return (
      <div className="detalle-cromo-estado" role="alert">
        <p>{estados?.error?.texto}</p>
        <button type="button" onClick={recargar}>
          {estados?.error?.botones?.reintentar}
        </button>
      </div>
    );
  }

  return (
    <article
      className="detalle-cromo"
      style={{ "--color-mundo": cromo.ilustracion?.colorBase }}
    >
      <Link to={`/mundos/${cromo.mundo}`} className="detalle-cromo-miga">
        {cromo.mundoNombre}
      </Link>
      <header className="detalle-cromo-encabezado">
        <span className="detalle-cromo-numero">#{cromo.id}</span>
        <h1>{cromo.nombre}</h1>
        <p>
          {insertarVariables(pagina.encabezado.ubicacion, {
            id: cromo.id,
            mundo: cromo.mundoNombre,
            posicion: cromo.posicion,
          })}
        </p>
        <span className="detalle-cromo-tipo">
          {pagina.encabezado.tipos[cromo.tipo]}
        </span>
      </header>
      <section aria-labelledby="detalle-cromo-poder">
        <h2 id="detalle-cromo-poder">{pagina.poder.titulo}</h2>
        <p className="detalle-cromo-poder">{cromo.poder}</p>
        <p>{cromo.descripcion}</p>
      </section>
      {atributos && (
        <section aria-labelledby="detalle-cromo-atributos">
          <h2 id="detalle-cromo-atributos">{atributos.titulo}</h2>
          <ul className="detalle-cromo-atributos">
            {Object.entries(cromo.atributos).map(([nombre, valor]) => (
              <li key={nombre}>
                <div className="detalle-cromo-atributo-etiqueta">
                  <span>{atributos.nombres[nombre]}</span>
                  <span>{valor}</span>
                </div>
                <div
                  className="detalle-cromo-barra"
                  role="progressbar"
                  aria-label={atributos.nombres[nombre]}
                  aria-valuemin="10"
                  aria-valuemax="99"
                  aria-valuenow={valor}
                >
                  <span
                    style={{
                      width: `${((valor - 10) / 89) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="detalle-cromo-escala">{atributos.escala}</p>
          <p className="detalle-cromo-atributo-total">
            {insertarVariables(atributos.total, {
              total: Object.values(cromo.atributos).reduce(
                (suma, valor) => suma + valor,
                0,
              ),
            })}
          </p>
        </section>
      )}
    </article>
  );
}
