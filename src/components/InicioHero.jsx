import { Link } from "react-router-dom";
import "./InicioHero.css";

const PERSONAJES = [
  {
    className: "inicio-hero-carta--raiz",
    numero: "041",
    nombre: "Raíz Madre",
    mundo: "Bosque Eterno · Héroe",
  },
  {
    className: "inicio-hero-carta--astra",
    numero: "081",
    nombre: "Astra",
    mundo: "Estación Órbita · Héroe",
  },
  {
    className: "inicio-hero-carta--voltia",
    numero: "001",
    nombre: "Voltia",
    mundo: "Ciudad Neón · Héroe",
  },
];

function CartaHeroe({ className, numero, nombre, mundo }) {
  return (
    <article className={`inicio-hero-carta ${className}`}>
      <span className="inicio-hero-carta-numero">{numero}</span>
      <svg
        className="inicio-hero-carta-arte"
        viewBox="0 0 160 190"
        aria-hidden="true"
      >
        <circle className="inicio-hero-carta-halo" cx="80" cy="82" r="52" />
        <path
          className="inicio-hero-carta-cuerpo"
          d="M29 190c2-42 20-67 51-67s49 25 51 67"
        />
        <circle className="inicio-hero-carta-cabeza" cx="80" cy="93" r="25" />
        <rect
          className="inicio-hero-carta-visor"
          x="59"
          y="88"
          width="42"
          height="12"
          rx="6"
        />
        <path
          className="inicio-hero-carta-destello"
          d="m80 137 4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z"
        />
      </svg>
      <strong>{nombre}</strong>
      <span>{mundo}</span>
    </article>
  );
}

function tituloEnLineas(titulo) {
  const palabras = titulo.split(" ");
  const indiceNumero = palabras.indexOf("120");
  if (indiceNumero < 1 || indiceNumero + 1 >= palabras.length) return titulo;

  return (
    <>
      {palabras.slice(0, indiceNumero + 1).join(" ")}
      <br />
      {palabras[indiceNumero + 1]}
      <br />
      {palabras.slice(indiceNumero + 2).join(" ")}
    </>
  );
}

export default function InicioHero({ textos }) {
  const hero = textos?.paginas?.inicio?.hero;
  if (!hero) return null;

  return (
    <section className="inicio-hero" aria-labelledby="inicio-hero-titulo">
      <div className="inicio-hero-contenido">
        <h1 id="inicio-hero-titulo">{tituloEnLineas(hero.titulo)}</h1>
        <div className="inicio-hero-acciones">
          <Link
            className="inicio-hero-boton inicio-hero-boton--acento"
            to="/registro"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13m0-13H8.5a2 2 0 1 1 2-2c0 1.1 1.5 2 1.5 2Zm0 0h3.5a2 2 0 1 0-2-2c0 1.1-1.5 2-1.5 2Z" />
            </svg>
            {hero.botones.crearCuentaGratis}
          </Link>
          <a
            className="inicio-hero-boton inicio-hero-boton--claro"
            href="#mundos"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4z" />
            </svg>
            {hero.botones.explorarMundos}
          </a>
        </div>
        <p className="inicio-hero-subtitulo">
          <span aria-hidden="true">✦</span>
          <span className="inicio-hero-subtitulo--escritorio">
            {hero.subtitulo}
          </span>
          <span className="inicio-hero-subtitulo--movil">
            {hero.subtituloMovil}
          </span>
        </p>
      </div>
      <div
        className="inicio-hero-ilustracion"
        role="group"
        aria-label="Héroes de Cromoverso"
      >
        <span className="inicio-hero-insignia">✦ Guardiana holográfica</span>
        <div className="inicio-hero-cartas">
          {PERSONAJES.map((personaje) => (
            <CartaHeroe key={personaje.numero} {...personaje} />
          ))}
        </div>
      </div>
    </section>
  );
}
