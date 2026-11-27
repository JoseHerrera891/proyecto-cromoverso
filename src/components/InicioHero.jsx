// US-CRO-S1-03 · Inicio público
import { Link } from "react-router-dom";
import { useSesion } from "../hooks/useSesion.js";
import { clasesBoton } from "../utils/clasesBoton.js";
import { insertarVariables } from "../utils/textos.js";
import CartaCromo from "./CartaCromo.jsx";
import Icono from "./Icono.jsx";
import "./InicioHero.css";

// Orden visual de Figma: la primera guardiana va al centro y encima.
const POSICIONES = ["centro", "izquierda", "derecha"];

// Separa la última frase del titular para respetar el salto de línea de Figma.
function partesDelTitulo(titulo) {
  const frases = titulo.split(/(?<=\.)\s+/);
  if (frases.length < 2) return [titulo];
  return [frases.slice(0, -1).join(" "), frases.at(-1)];
}

export default function InicioHero({ textos, destacados = [], rarezas = [] }) {
  const { usuario } = useSesion();
  const hero = textos?.paginas?.inicio?.hero;
  // Mientras llegan los textos se reserva el alto de la portada (sin saltos).
  if (!hero) {
    return (
      <section className="inicio-hero" aria-busy="true">
        <div className="inicio-hero-interior" />
      </section>
    );
  }
  const plantillaDetalle = textos.paginas.inicio.tarjeta?.tipo;
  const tipos = textos.paginas.albumMundo?.filtros?.tipo?.opciones ?? {};

  return (
    <section className="inicio-hero" aria-labelledby="inicio-hero-titulo">
      <div className="inicio-hero-interior">
        <div className="inicio-hero-bienvenida">
          <h1 id="inicio-hero-titulo">
            {partesDelTitulo(hero.titulo).map((parte) => (
              <span className="inicio-hero-linea" key={parte}>
                {parte}{" "}
              </span>
            ))}
          </h1>
          <p className="inicio-hero-descripcion">{hero.subtituloMovil}</p>
          <div className="inicio-hero-acciones">
            {!usuario && (
              <Link className={clasesBoton("acento", "g")} to="/registro">
                <Icono nombre="regalo" />
                {hero.botones.crearCuentaGratis}
              </Link>
            )}
            <Link className={clasesBoton("secundario", "g")} to="/mundos">
              <Icono nombre="album" />
              {hero.botones.explorarMundos}
            </Link>
          </div>
          {!usuario && (
            <p className="inicio-hero-nota">
              <Icono nombre="destellos" />
              {hero.subtitulo}
            </p>
          )}
        </div>

        {destacados.length > 0 && (
          <div className="inicio-hero-cartas" aria-hidden="true">
            {hero.etiquetas?.guardiana && (
              <span className="inicio-hero-sello">
                <Icono nombre="destellos" />
                {hero.etiquetas.guardiana}
              </span>
            )}
            {destacados.map((cromo, indice) => (
              <CartaCromo
                key={cromo.id}
                className={`inicio-hero-carta inicio-hero-carta--${POSICIONES[indice]}`}
                cromo={cromo}
                rareza={rarezas.find(({ id }) => id === cromo.rareza)}
                etiquetaNombre="p"
                prioritaria
                detalle={
                  plantillaDetalle &&
                  insertarVariables(plantillaDetalle, {
                    mundo: cromo.mundoNombre,
                    tipo: tipos[cromo.tipo] ?? "",
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
