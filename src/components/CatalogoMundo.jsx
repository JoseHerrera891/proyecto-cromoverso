import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useCatalogoMundo } from "../hooks/useCatalogoMundo.js";
import { useTituloDocumento } from "../hooks/useTituloDocumento.js";
import { ordenarRarezas } from "../utils/catalogo.js";
import { clasesBoton } from "../utils/clasesBoton.js";
import { insertarVariables } from "../utils/textos.js";
import CabeceraMundo from "./CabeceraMundo.jsx";
import CartaCromo from "./CartaCromo.jsx";
import FiltrosCatalogo from "./FiltrosCatalogo.jsx";
import Icono from "./Icono.jsx";
import "./CatalogoMundo.css";

// Cromos que se ven sin desplazar (2 filas en móvil, 1 en escritorio): su arte
// se pide de inmediato para no retrasar el primer pintado (LCP).
const CARTAS_VISIBLES_AL_INICIO = 6;

function Selector({ etiqueta, valor, onCambiar, opciones }) {
  return (
    <label className="catalogo-selector">
      <span className="solo-lector">{etiqueta}</span>
      <select
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
      >
        {opciones.map(([clave, texto]) => (
          <option key={clave} value={clave}>
            {texto}
          </option>
        ))}
      </select>
      <Icono nombre="chevronAbajo" />
    </label>
  );
}

function Estado({ children, rol = "status" }) {
  return (
    <div className="catalogo-estado" role={rol}>
      {children}
    </div>
  );
}

/** Vista 2 · Catálogo de un mundo, en la ruta /mundos/:id. */
export default function CatalogoMundo({ id, textos }) {
  const [parametros, setParametros] = useSearchParams();
  const { pathname } = useLocation();
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const pagina = textos?.paginas?.albumMundo;
  const estados = textos?.estados;
  const opcionesTipo = pagina?.filtros?.tipo?.opciones ?? {};
  const estado = useCatalogoMundo(
    id,
    {
      rareza: parametros.get("rareza") ?? "",
      tipo: parametros.get("tipo") ?? "",
    },
    Object.keys(opcionesTipo),
  );
  const nombreMundo = estado.datos?.mundo.nombre;
  useTituloDocumento(
    nombreMundo &&
      pagina?.seo?.titulo &&
      insertarVariables(pagina.seo.titulo, { mundo: nombreMundo }),
    nombreMundo &&
      pagina?.seo?.descripcion &&
      insertarVariables(pagina.seo.descripcion, { mundo: nombreMundo }),
  );

  if (estado.noEncontrado && estados?.noEncontrado) {
    return (
      <Estado rol="alert">
        <h1>{estados.noEncontrado.titulo}</h1>
        <p>{estados.noEncontrado.texto}</p>
        <Link className={clasesBoton("primario", "m")} to="/">
          {estados.noEncontrado.botones.irAlInicio}
        </Link>
      </Estado>
    );
  }

  if (estado.error && !estado.datos) {
    return (
      <Estado rol="alert">
        <p>{estados?.error?.texto}</p>
        <button
          type="button"
          className={clasesBoton("secundario", "m")}
          onClick={estado.recargar}
        >
          {estados?.error?.botones?.reintentar}
        </button>
      </Estado>
    );
  }

  if (!estado.datos || !pagina) {
    return <Estado>{estados?.cargando}</Estado>;
  }

  const { mundo, mundos, rarezas } = estado.datos;
  const { filtros } = estado;
  const posicion = mundos.findIndex(({ id: m }) => m === mundo.id) + 1;

  function parametrosCon(nombre, valor) {
    const nuevos = new URLSearchParams(parametros);
    if (nombre === null) {
      nuevos.delete("rareza");
      nuevos.delete("tipo");
    } else if (valor) nuevos.set(nombre, valor);
    else nuevos.delete(nombre);
    return nuevos;
  }

  function enlaceFiltro(nombre, valor) {
    const consulta = parametrosCon(nombre, valor).toString();
    return consulta ? `${pathname}?${consulta}` : pathname;
  }

  const termino = busqueda.trim().toLocaleLowerCase();
  const cromos = (estado.cromos ?? []).filter(
    (cromo) =>
      !termino ||
      cromo.nombre.toLocaleLowerCase().includes(termino) ||
      String(cromo.numero).padStart(3, "0").includes(termino),
  );

  return (
    <section className="catalogo" style={{ "--color-mundo": mundo.color }}>
      <CabeceraMundo
        mundo={mundo}
        posicion={posicion}
        pagina={pagina}
        general={textos.general}
        buscadorAbierto={buscadorAbierto}
        onAlternarBuscador={() => setBuscadorAbierto((abierto) => !abierto)}
      />

      <div className="catalogo-contenido">
        <FiltrosCatalogo
          mundo={mundo}
          mundos={mundos}
          rarezas={rarezas}
          pagina={pagina}
          filtros={filtros}
          enlaceFiltro={enlaceFiltro}
        />

        <div className="catalogo-album" aria-busy={estado.cargandoCromos}>
          {buscadorAbierto && (
            <input
              id="catalogo-busqueda"
              className="catalogo-busqueda"
              type="search"
              aria-label={textos.navbar?.buscador?.aria}
              placeholder={textos.navbar?.buscador?.placeholder}
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              autoFocus
            />
          )}

          <div className="catalogo-herramientas">
            <div className="catalogo-filtros-movil">
              <Selector
                etiqueta={pagina.filtros.rareza.titulo}
                valor={filtros.rareza}
                onCambiar={(valor) =>
                  setParametros(parametrosCon("rareza", valor))
                }
                opciones={[
                  ["", pagina.filtros.rareza.todas],
                  ...ordenarRarezas(rarezas).map((rareza) => [
                    rareza.id,
                    insertarVariables(pagina.filtros.rareza.valor, {
                      rareza: rareza.nombre,
                    }),
                  ]),
                ]}
              />
              <Selector
                etiqueta={pagina.filtros.tipo.titulo}
                valor={filtros.tipo}
                onCambiar={(valor) =>
                  setParametros(parametrosCon("tipo", valor))
                }
                opciones={[
                  ["", pagina.filtros.tipo.todos],
                  ...Object.entries(opcionesTipo).map(([tipo, nombre]) => [
                    tipo,
                    insertarVariables(pagina.filtros.tipo.valor, {
                      tipo: nombre,
                    }),
                  ]),
                ]}
              />
            </div>
            <div className="catalogo-orden">
              <Selector
                etiqueta={insertarVariables(pagina.orden.etiqueta, {
                  orden: pagina.orden.opciones.numero,
                })}
                valor="numero"
                onCambiar={() => {}}
                opciones={[
                  [
                    "numero",
                    insertarVariables(pagina.orden.etiqueta, {
                      orden: pagina.orden.opciones.numero,
                    }),
                  ],
                ]}
              />
            </div>
          </div>

          {cromos.length > 0 ? (
            <ul className="catalogo-casillas">
              {cromos.map((cromo, indice) => (
                <li key={cromo.id}>
                  <Link
                    className="catalogo-cromo-enlace"
                    to={`/cromos/${encodeURIComponent(cromo.id)}`}
                  >
                    <CartaCromo
                      etiquetaNombre="h2"
                      prioritaria={indice < CARTAS_VISIBLES_AL_INICIO}
                      cromo={cromo}
                      rareza={rarezas.find(({ id: r }) => r === cromo.rareza)}
                      detalle={insertarVariables(pagina.tarjeta.tipo, {
                        mundo: cromo.mundoNombre ?? mundo.nombre,
                        tipo: opcionesTipo[cromo.tipo] ?? cromo.tipo,
                      })}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : estado.cromos ? (
            <div className="catalogo-vacio">
              <h2>{pagina.vacio.titulo}</h2>
              <p>{pagina.vacio.texto}</p>
              <Link
                className={clasesBoton("secundario", "m")}
                to={enlaceFiltro(null)}
                onClick={() => setBusqueda("")}
              >
                {pagina.vacio.botones.limpiar}
              </Link>
            </div>
          ) : (
            <Estado>{estados?.cargando}</Estado>
          )}
        </div>
      </div>
    </section>
  );
}
