import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCatalogoMundo } from "../hooks/useCatalogoMundo.js";
import Badge from "./Badge.jsx";
import Card from "./Card.jsx";
import Icono from "./Icono.jsx";
import "./CatalogoMundo.css";

const ICONOS_RAREZA = {
  circulo: "rareza-circulo",
  rombo: "rareza-rombo",
  estrella: "rareza-estrella",
  corona: "rareza-corona",
};

const COLORES_RAREZA = {
  comun: "var(--rareza-comun)",
  rara: "var(--rareza-rara)",
  epica: "var(--rareza-epica)",
  legendaria: "var(--rareza-legendaria)",
};

const ILUSTRACIONES_NEON = [
  { desde: 1, hasta: 1, archivo: "CV-001.png" },
  { desde: 2, hasta: 3, archivo: "CV-002.png" },
  { desde: 4, hasta: 7, archivo: "CV-004.png" },
  { desde: 8, hasta: 8, archivo: "CV-008.png" },
  { desde: 9, hasta: 12, archivo: "CV-009.png" },
  { desde: 13, hasta: 15, archivo: "CV-013.png" },
  { desde: 16, hasta: 16, archivo: "CV-016.png" },
  { desde: 17, hasta: 20, archivo: "CV-017.png" },
];

function obtenerIlustracion(cromo) {
  if (cromo.mundo !== "neon") return "/images/cromo-general.png";
  const ilustracion = ILUSTRACIONES_NEON.find(
    ({ desde, hasta }) => cromo.numero >= desde && cromo.numero <= hasta,
  );
  return ilustracion
    ? `/images/cromos/${ilustracion.archivo}`
    : "/images/cromo-general.png";
}

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
  const numeroMundo = datos.mundos.findIndex(
    (mundo) => mundo.id === datos.mundo.id,
  );
  const cromosMundo = datos.mundo.cromos;
  const cantidadPorRareza = (id) =>
    cromosMundo.filter((cromo) => cromo.rareza === id).length;
  const cantidadPorTipo = (id) =>
    cromosMundo.filter((cromo) => cromo.tipo === id).length;
  const rangoCromos = insertarVariables(pagina.encabezado.rango, {
    numero: numeroMundo + 1,
    desde: String(datos.mundo.numeros.desde).padStart(3, "0"),
    hasta: String(datos.mundo.numeros.hasta).padStart(3, "0"),
  });
  const etiquetaOrden = insertarVariables(pagina.orden.etiqueta, {
    orden: pagina.orden.opciones.numero,
  });
  const tipoNombre = (tipo) => pagina.filtros.tipo.opciones[tipo] ?? tipo;
  const etiquetasBusqueda = textos.navbar?.buscador;
  const cromosVisibles = [...datos.cromos]
    .filter((cromo) =>
      cromo.nombre
        .toLocaleLowerCase()
        .includes(busqueda.trim().toLocaleLowerCase()),
    )
    .sort((a, b) => a.numero - b.numero);

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
            <p>{rangoCromos}</p>
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
          <nav className="catalogo-mundos" aria-label={pagina.mundos.titulo}>
            <h2>{pagina.mundos.titulo}</h2>
            <ul>
              {datos.mundos.map((mundo) => (
                <li key={mundo.id}>
                  <Link
                    to={`/mundos/${encodeURIComponent(mundo.id)}`}
                    aria-current={
                      mundo.id === datos.mundo.id ? "page" : undefined
                    }
                    style={{ "--color-mundo-enlace": mundo.color }}
                  >
                    <span className="catalogo-mundo-identidad">
                      <span
                        className="catalogo-mundo-punto"
                        aria-hidden="true"
                      />
                      {mundo.nombre}
                    </span>
                    <span>{mundo.totalCromos}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
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
              <span className="catalogo-filtro-cantidad">
                {cromosMundo.length}
              </span>
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
                  className="catalogo-filtro-rareza"
                  style={{ "--color-rareza": COLORES_RAREZA[rareza.id] }}
                >
                  <span
                    className="catalogo-filtro-rareza-icono"
                    aria-hidden="true"
                  >
                    <Icono nombre={ICONOS_RAREZA[rareza.icono]} />
                  </span>
                  {rareza.nombre}
                </span>
                <span className="catalogo-filtro-cantidad">
                  {insertarVariables(pagina.mundos.cromos, {
                    cantidad: cantidadPorRareza(rareza.id),
                  })}
                </span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>{pagina.filtros.tipo.titulo}</legend>
            {Object.entries(pagina.filtros.tipo.opciones).map(
              ([tipo, etiqueta]) => (
                <label
                  className="catalogo-opcion catalogo-opcion--tipo"
                  key={tipo}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value={tipo}
                    checked={tipoSeleccionado === tipo}
                    onChange={() => cambiarFiltro("tipo", tipo)}
                  />
                  <span>{etiqueta}</span>
                  <span className="catalogo-filtro-cantidad">
                    {insertarVariables(pagina.mundos.cromos, {
                      cantidad: cantidadPorTipo(tipo),
                    })}
                  </span>
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
            <label className="catalogo-orden">
              <select aria-label={etiquetaOrden}>
                <option value="numero">{etiquetaOrden}</option>
              </select>
            </label>
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
                const colorRareza = COLORES_RAREZA[cromo.rareza];
                if (!colorRareza) {
                  throw new Error(
                    `El color de rareza ${cromo.rareza} no es válido.`,
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
                          className={`catalogo-cromo-arte${
                            cromo.holografico ? " is-holografico" : ""
                          }`}
                          src={obtenerIlustracion(cromo)}
                          alt={`Ilustración de ${cromo.nombre}`}
                          loading="lazy"
                        />
                        <span className="catalogo-cromo-nombre">
                          {cromo.nombre}
                        </span>
                        <span className="catalogo-cromo-tipo">
                          {insertarVariables(pagina.tarjeta.tipo, {
                            mundo: datos.mundo.nombre,
                            tipo: tipoNombre(cromo.tipo),
                          })}
                        </span>
                        <Badge
                          rareza={cromo.rareza}
                          className="catalogo-cromo-rareza"
                          aria-label={rareza.nombre}
                        >
                          <span
                            className="catalogo-cromo-icono"
                            style={{ "--color-rareza": colorRareza }}
                            aria-hidden="true"
                          >
                            <Icono nombre={iconoRareza} />
                          </span>
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
