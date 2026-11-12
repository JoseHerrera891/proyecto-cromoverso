import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCatalogoMundo } from "../hooks/useCatalogoMundo.js";
import Badge from "./Badge.jsx";
import Card from "./Card.jsx";
import Icono from "./Icono.jsx";
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
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
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
  const etiquetasBusqueda = textos.navbar?.buscador;
  const cromosVisibles = datos.cromos.filter((cromo) =>
    cromo.nombre
      .toLocaleLowerCase()
      .includes(busqueda.trim().toLocaleLowerCase()),
  );

  function limpiarFiltros() {
    const nuevosParametros = new URLSearchParams(parametros);
    nuevosParametros.delete("rareza");
    nuevosParametros.delete("tipo");
    setParametros(nuevosParametros);
  }

  return (
    <section
      className="catalogo-mundo"
      aria-labelledby="catalogo-titulo"
      style={{ "--color-mundo": datos.mundo.color }}
    >
      <header className="catalogo-encabezado">
        <nav className="catalogo-migas" aria-label={pagina.migas.inicio}>
          <Link to="/">{pagina.migas.inicio}</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{datos.mundo.nombre}</span>
        </nav>
        <div className="catalogo-encabezado-contenido">
          <Link
            className="catalogo-volver"
            to="/"
            aria-label={pagina.migas.inicio}
          >
            <Icono nombre="volver" />
          </Link>
          <div className="catalogo-titulo-grupo">
            <h1 id="catalogo-titulo">{datos.mundo.nombre}</h1>
            <p>{datos.mundo.descripcion}</p>
          </div>
          <button
            className="catalogo-buscar"
            type="button"
            aria-label={etiquetasBusqueda?.aria ?? pagina.filtros.tipo.titulo}
            aria-expanded={buscadorAbierto}
            aria-controls={buscadorAbierto ? "catalogo-busqueda" : undefined}
            onClick={() => setBuscadorAbierto((abierto) => !abierto)}
          >
            <Icono nombre="buscar" />
          </button>
        </div>
      </header>
      <div className="catalogo-cuerpo">
        <aside className="catalogo-filtros-escritorio">
          <fieldset>
            <legend>{pagina.filtros.rareza.titulo}</legend>
            <label className="catalogo-opcion">
              <input
                type="radio"
                name="rareza"
                checked={!rarezaSeleccionada}
                onChange={() => cambiarFiltro("rareza", "")}
              />
              {pagina.filtros.rareza.todas}
            </label>
            {datos.rarezas.map((rareza) => (
              <label className="catalogo-opcion" key={rareza.id}>
                <input
                  type="radio"
                  name="rareza"
                  value={rareza.id}
                  checked={rarezaSeleccionada === rareza.id}
                  onChange={() => cambiarFiltro("rareza", rareza.id)}
                />
                <span
                  className={`catalogo-opcion-icono catalogo-opcion-icono--${rareza.icono}`}
                  style={{ "--color-rareza": rareza.color }}
                  aria-hidden="true"
                />
                {rareza.nombre}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>{pagina.filtros.tipo.titulo}</legend>
            <label className="catalogo-opcion">
              <input
                type="radio"
                name="tipo"
                checked={!tipoSeleccionado}
                onChange={() => cambiarFiltro("tipo", "")}
              />
              {pagina.filtros.tipo.todos}
            </label>
            {Object.entries(pagina.filtros.tipo.opciones).map(
              ([tipo, etiqueta]) => (
                <label className="catalogo-opcion" key={tipo}>
                  <input
                    type="radio"
                    name="tipo"
                    value={tipo}
                    checked={tipoSeleccionado === tipo}
                    onChange={() => cambiarFiltro("tipo", tipo)}
                  />
                  {etiqueta}
                </label>
              ),
            )}
          </fieldset>
          {hayFiltros && (
            <button
              className="catalogo-limpiar"
              type="button"
              onClick={limpiarFiltros}
            >
              {pagina.vacio.botones.limpiar}
            </button>
          )}
        </aside>
        <div className="catalogo-resultados">
          <div className="catalogo-controles">
            <span className="catalogo-total">
              {insertarVariables(pagina.mundos.cromos, {
                cantidad: datos.mundo.totalCromos,
              })}
            </span>
            <div className="catalogo-filtros-movil">
              <label>
                <span className="catalogo-solo-lector">
                  {pagina.filtros.rareza.titulo}
                </span>
                <select
                  aria-label={pagina.filtros.rareza.titulo}
                  value={rarezaSeleccionada}
                  onChange={(evento) =>
                    cambiarFiltro("rareza", evento.target.value)
                  }
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
                <span className="catalogo-solo-lector">
                  {pagina.filtros.tipo.titulo}
                </span>
                <select
                  aria-label={pagina.filtros.tipo.titulo}
                  value={tipoSeleccionado}
                  onChange={(evento) =>
                    cambiarFiltro("tipo", evento.target.value)
                  }
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
            </div>
            {buscadorAbierto && (
              <input
                id="catalogo-busqueda"
                className="catalogo-busqueda"
                type="search"
                aria-label={
                  etiquetasBusqueda?.aria ?? pagina.filtros.tipo.titulo
                }
                placeholder={
                  etiquetasBusqueda?.placeholder ?? pagina.filtros.tipo.titulo
                }
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            )}
            {hayFiltros && (
              <button
                className="catalogo-limpiar"
                type="button"
                onClick={limpiarFiltros}
              >
                {pagina.vacio.botones.limpiar}
              </button>
            )}
          </div>
          {cromosVisibles.length ? (
            <ul className="catalogo-cromos">
              {cromosVisibles.map((cromo) => {
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
                        <img
                          className="catalogo-cromo-arte"
                          src="/images/cromo-general.png"
                          alt=""
                          aria-hidden="true"
                        />
                        <span className="catalogo-cromo-nombre">
                          {cromo.nombre}
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
        </div>
      </div>
    </section>
  );
}
