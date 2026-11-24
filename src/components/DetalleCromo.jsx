import { useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDetalleCromo } from "../hooks/useDetalleCromo.js";
import { useTituloDocumento } from "../hooks/useTituloDocumento.js";
import { clasesBoton } from "../utils/clasesBoton.js";
import { insertarVariables } from "../utils/textos.js";
import Badge from "./Badge.jsx";
import CartaCromo from "./CartaCromo.jsx";
import CatalogoMundo from "./CatalogoMundo.jsx";
import { AvisoCarga, Esqueleto, EstadoError } from "./Estados.jsx";
import Icono from "./Icono.jsx";
import "./DetalleCromo.css";

const conCeros = (numero) => String(numero).padStart(3, "0");

function useDialogo(onCerrar, activo, contenido) {
  const dialogo = useRef(null);

  useEffect(() => {
    if (!activo) return undefined;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogo.current?.querySelector(".detalle-cerrar")?.focus();

    function gestionarTeclado(evento) {
      if (evento.key === "Escape") {
        onCerrar();
        return;
      }
      if (evento.key !== "Tab" || !dialogo.current) return;
      const enfocables = [...dialogo.current.querySelectorAll("a, button")];
      const primero = enfocables[0];
      const ultimo = enfocables.at(-1);
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", gestionarTeclado);
    return () => {
      document.removeEventListener("keydown", gestionarTeclado);
      document.body.style.overflow = overflowAnterior;
    };
  }, [onCerrar, activo, contenido]);

  return dialogo;
}

function Atributos({ atributos, textos }) {
  const total = Object.values(atributos).reduce(
    (suma, valor) => suma + valor,
    0,
  );
  return (
    <section className="detalle-atributos" aria-labelledby="detalle-atributos">
      <div className="detalle-atributos-cabecera">
        <h2 id="detalle-atributos">{textos.titulo}</h2>
        <span>{insertarVariables(textos.total, { total })}</span>
      </div>
      <ul>
        {Object.entries(atributos).map(([nombre, valor]) => (
          <li key={nombre}>
            <span className="detalle-atributo-nombre">
              {textos.nombres[nombre] ?? nombre}
            </span>
            <span
              className="detalle-barra"
              role="progressbar"
              aria-label={textos.nombres[nombre] ?? nombre}
              aria-valuemin={10}
              aria-valuemax={99}
              aria-valuenow={valor}
            >
              <span style={{ width: `${(valor / 99) * 100}%` }} />
            </span>
            <span className="detalle-atributo-valor">{valor}</span>
          </li>
        ))}
      </ul>
      <p className="detalle-escala">{textos.escala}</p>
    </section>
  );
}

/** Vista 3 · Detalle de un cromo, sobre el catálogo de su mundo. */
export default function DetalleCromo({ id, textos }) {
  const { cromo, cargando, error, noEncontrado, recargar } =
    useDetalleCromo(id);
  const navigate = useNavigate();
  const { state } = useLocation();
  const pagina = textos?.paginas?.detalleCromo;
  const mundoFondo = cromo?.mundo ?? state?.mundo;
  const volverA = state?.volverA ?? (mundoFondo && `/mundos/${mundoFondo}`);

  const cerrar = useCallback(
    () => navigate(volverA ?? "/mundos"),
    [navigate, volverA],
  );
  // El foco vuelve a «Cerrar» cada vez que cambia lo que muestra la ventana.
  const contenido = cromo?.id ?? (error ? "error" : "carga");
  const dialogo = useDialogo(
    cerrar,
    Boolean(pagina) && !noEncontrado,
    contenido,
  );
  const botonCerrar = pagina && (
    <button
      type="button"
      className="detalle-cerrar"
      aria-label={pagina.botones.cerrar}
      onClick={cerrar}
    >
      <Icono nombre="cerrar" />
    </button>
  );

  useTituloDocumento(
    cromo && pagina && insertarVariables(pagina.seo.titulo, cromo),
    cromo && pagina && insertarVariables(pagina.seo.descripcion, cromo),
  );

  if (noEncontrado && pagina) {
    return (
      <div className="detalle-no-encontrado" role="alert">
        <h1>{pagina.noEncontrado.titulo}</h1>
        <p>{pagina.noEncontrado.texto}</p>
        <Link className={clasesBoton("primario", "m")} to="/mundos">
          {pagina.noEncontrado.botones.volver}
        </Link>
      </div>
    );
  }

  const tipo = pagina?.encabezado?.tipos?.[cromo?.tipo] ?? cromo?.tipo;
  const vecino = (otro) => `${conCeros(otro.numero)} ${otro.nombre}`;

  return (
    <>
      {mundoFondo && (
        <div className="detalle-fondo" inert aria-hidden="true">
          <CatalogoMundo id={mundoFondo} textos={textos} fondo />
        </div>
      )}

      <div
        className="detalle-velo"
        onMouseDown={(evento) => {
          if (evento.target === evento.currentTarget) cerrar();
        }}
      >
        {cromo && pagina ? (
          <section
            ref={dialogo}
            className="detalle"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-titulo"
            aria-busy={cargando}
            style={{ "--color-mundo": cromo.ilustracion.colorBase }}
          >
            <span className="detalle-asa" aria-hidden="true" />
            {botonCerrar}

            <div className="detalle-carta">
              <CartaCromo
                cromo={cromo}
                rareza={cromo.datosRareza}
                soloSvg
                etiquetaNombre="p"
                detalle={`${cromo.mundoNombre} · ${tipo}`}
              />
            </div>

            <div className="detalle-identidad">
              <div className="detalle-etiquetas">
                <Badge rareza={cromo.rareza}>
                  <Icono nombre={`rareza-${cromo.datosRareza.icono}`} />
                  {cromo.datosRareza.nombre}
                </Badge>
                <span className="detalle-chip detalle-chip--mundo">
                  {cromo.mundoNombre}
                </span>
                <span className="detalle-chip">{tipo}</span>
              </div>
              <p className="detalle-ubicacion">
                {insertarVariables(pagina.encabezado.ubicacion, {
                  id: cromo.id,
                  mundo: cromo.mundoNombre,
                  posicion: cromo.posicion,
                })}
              </p>
              <p className="detalle-codigo">{cromo.id}</p>
              <h1 id="detalle-titulo">{cromo.nombre}</h1>
              <p className="detalle-subtitulo">{`${cromo.mundoNombre} · ${tipo}`}</p>
            </div>

            <div className="detalle-poder">
              <span className="detalle-poder-icono" aria-hidden="true">
                <Icono nombre="rayo" />
              </span>
              <div>
                <p className="detalle-poder-titulo">{pagina.poder.titulo}</p>
                <p className="detalle-poder-texto">{cromo.poder}</p>
              </div>
            </div>

            <p className="detalle-descripcion">{cromo.descripcion}</p>

            <Atributos atributos={cromo.atributos} textos={pagina.atributos} />

            <nav className="detalle-navegacion" aria-label={cromo.mundoNombre}>
              {cromo.anterior && (
                <Link
                  to={`/cromos/${encodeURIComponent(cromo.anterior.id)}`}
                  state={state}
                  replace
                  aria-label={`${pagina.navegacion.anterior}: ${vecino(cromo.anterior)}`}
                >
                  <Icono nombre="chevronIzq" />
                  {vecino(cromo.anterior)}
                </Link>
              )}
              {cromo.siguiente && (
                <Link
                  className="detalle-siguiente"
                  to={`/cromos/${encodeURIComponent(cromo.siguiente.id)}`}
                  state={state}
                  replace
                  aria-label={`${pagina.navegacion.siguiente}: ${vecino(cromo.siguiente)}`}
                >
                  <Icono nombre="chevronDer" />
                  {vecino(cromo.siguiente)}
                </Link>
              )}
            </nav>
          </section>
        ) : error ? (
          <div className="detalle detalle--estado" ref={dialogo}>
            {botonCerrar}
            <EstadoError
              textos={textos}
              error={error}
              onReintentar={recargar}
            />
          </div>
        ) : (
          <div
            className="detalle detalle--esqueleto"
            aria-busy="true"
            ref={dialogo}
          >
            {botonCerrar}
            <AvisoCarga textos={textos} />
            <Esqueleto className="detalle-esqueleto-carta" />
            <div className="detalle-esqueleto-info">
              <Esqueleto className="detalle-esqueleto-etiquetas" />
              <Esqueleto className="detalle-esqueleto-titulo" />
              <Esqueleto className="detalle-esqueleto-poder" />
              <Esqueleto className="detalle-esqueleto-atributos" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
