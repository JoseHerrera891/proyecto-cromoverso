import { Link, useSearchParams } from "react-router-dom";
import { useCatalogoMundo } from "../hooks/useCatalogoMundo.js";
import Badge from "./Badge.jsx";
import Card from "./Card.jsx";
import "./CatalogoMundo.css";

const ICONOS_RAREZA = {
  circulo: "●",
  rombo: "◆",
  estrella: "★",
  corona: "♛",
};

function insertarVariables(plantilla, variables) {
  return Object.entries(variables).reduce(
    (texto, [clave, valor]) => texto.replaceAll(`{${clave}}`, String(valor)),
    plantilla,
  );
}

export default function CatalogoMundo({ id, textos }) {
  const { datos, cargando, error, recargar } = useCatalogoMundo(id);
  const [parametros, setParametros] = useSearchParams();
  const pagina = textos?.paginas?.albumMundo;
  const estados = textos?.estados;

  if (cargando || !pagina) {
    return (
      <p className="catalogo-estado" role="status">
        {estados?.cargando}
      </p>
    );
  }

  if (error || !datos) {
    return (
      <div className="catalogo-estado" role="alert">
        <p>{estados?.error?.texto}</p>
        <button type="button" onClick={recargar}>
          {estados?.error?.botones?.reintentar}
        </button>
      </div>
    );
  }

  function cambiarFiltro(nombre, valor) {
    const nuevosParametros = new URLSearchParams(parametros);
    if (valor) nuevosParametros.set(nombre, valor);
    else nuevosParametros.delete(nombre);
    setParametros(nuevosParametros);
  }

  const rarezaSeleccionada = parametros.get("rareza") ?? "";
  const tipoSeleccionado = parametros.get("tipo") ?? "";
  const hayFiltros = Boolean(rarezaSeleccionada || tipoSeleccionado);

  function limpiarFiltros() {
    const nuevosParametros = new URLSearchParams(parametros);
    nuevosParametros.delete("rareza");
    nuevosParametros.delete("tipo");
    setParametros(nuevosParametros);
  }

  return (
    <section className="catalogo-mundo" aria-labelledby="catalogo-titulo">
      <Link className="catalogo-miga" to="/">
        {pagina.migas.inicio}
      </Link>
      <header className="catalogo-encabezado">
        <div>
          <h1 id="catalogo-titulo">{datos.mundo.nombre}</h1>
          <p>{datos.mundo.descripcion}</p>
        </div>
        <span className="catalogo-total">
          {insertarVariables(pagina.mundos.cromos, {
            cantidad: datos.mundo.totalCromos,
          })}
        </span>
      </header>
      <div className="catalogo-filtros">
        <label>
          <span>{pagina.filtros.rareza.titulo}</span>
          <select
            value={rarezaSeleccionada}
            onChange={(evento) => cambiarFiltro("rareza", evento.target.value)}
          >
            <option value="">{pagina.filtros.rareza.todas}</option>
            {datos.rarezas.map((rareza) => (
              <option value={rareza.id} key={rareza.id}>
                {rareza.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{pagina.filtros.tipo.titulo}</span>
          <select
            value={tipoSeleccionado}
            onChange={(evento) => cambiarFiltro("tipo", evento.target.value)}
          >
            <option value="">{pagina.filtros.tipo.todos}</option>
            {Object.entries(pagina.filtros.tipo.opciones).map(
              ([tipo, etiqueta]) => (
                <option value={tipo} key={tipo}>
                  {etiqueta}
                </option>
              ),
            )}
          </select>
        </label>
        {hayFiltros && (
          <button type="button" onClick={limpiarFiltros}>
            {pagina.vacio.botones.limpiar}
          </button>
        )}
      </div>
      {datos.cromos.length ? (
        <ul className="catalogo-cromos">
          {datos.cromos.map((cromo) => {
            const rareza = datos.rarezas.find(
              (item) => item.id === cromo.rareza,
            );
            if (!rareza) {
              throw new Error(
                `No se encontró la rareza del cromo ${cromo.id}.`,
              );
            }
            const iconoRareza = ICONOS_RAREZA[rareza.icono];
            if (!iconoRareza) {
              throw new Error(
                `El icono de rareza ${rareza.icono} no es válido.`,
              );
            }

            return (
              <li key={cromo.id}>
                <Link
                  className="catalogo-cromo-enlace"
                  to={`/cromos/${encodeURIComponent(cromo.id)}`}
                >
                  <Card className="catalogo-cromo">
                    <span className="catalogo-cromo-numero">
                      #{String(cromo.numero).padStart(3, "0")}
                    </span>
                    <span
                      className="catalogo-cromo-arte"
                      style={{
                        "--color-ilustracion":
                          cromo.ilustracion?.colorBase ?? datos.mundo.color,
                      }}
                      aria-hidden="true"
                    />
                    <span className="catalogo-cromo-nombre">
                      {cromo.nombre}
                    </span>
                    <span className="catalogo-cromo-tipo">
                      {insertarVariables(pagina.tarjeta.tipo, {
                        mundo: datos.mundo.nombre,
                        tipo: pagina.filtros.tipo.opciones[cromo.tipo],
                      })}
                    </span>
                    <Badge
                      rareza={cromo.rareza}
                      className="catalogo-cromo-rareza"
                    >
                      <span
                        className="catalogo-cromo-icono"
                        style={{ "--color-rareza": rareza.color }}
                        aria-hidden="true"
                      >
                        {iconoRareza}
                      </span>
                      {rareza.nombre}
                    </Badge>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="catalogo-vacio">
          <h2>{pagina.vacio.titulo}</h2>
          <p>{pagina.vacio.texto}</p>
          <button type="button" onClick={limpiarFiltros}>
            {pagina.vacio.botones.limpiar}
          </button>
        </div>
      )}
    </section>
  );
}
