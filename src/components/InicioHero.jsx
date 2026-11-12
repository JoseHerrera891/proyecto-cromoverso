import { Link } from "react-router-dom";
import Icono from "./Icono.jsx";
import "./InicioHero.css";

const PERSONAJES = [
  {
    className: "inicio-hero-carta--raiz",
    numero: "041",
    nombre: "Raíz Madre",
    mundo: "Bosque Eterno · Héroe",
    imagen: "/images/cromo-raiz.png",
  },
  {
    className: "inicio-hero-carta--astra",
    numero: "081",
    nombre: "Astra",
    mundo: "Estación Órbita · Héroe",
    imagen: "/images/cromo-astra.png",
  },
  {
    className: "inicio-hero-carta--voltia",
    numero: "001",
    nombre: "Voltia",
    mundo: "Ciudad Neón · Héroe",
    imagen: "/images/cromo-voltia.png",
  },
];

function CartaHeroe({ className, numero, nombre, mundo, imagen }) {
  return (
    <article className={`inicio-hero-carta ${className}`}>
      <span className="inicio-hero-carta-numero">{numero}</span>
      <span className="inicio-hero-carta-insignia" aria-hidden="true">
        <Icono nombre="rareza-corona" />
      </span>
      <img className="inicio-hero-carta-arte" src={imagen} alt="" />
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
            <Icono nombre="regalo" />
            {hero.botones.crearCuentaGratis}
          </Link>
          <a
            className="inicio-hero-boton inicio-hero-boton--claro"
            href="#mundos"
          >
            <Icono nombre="album" />
            {hero.botones.explorarMundos}
          </a>
        </div>
        <p className="inicio-hero-subtitulo">
          <Icono nombre="destello" />
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
        <span className="inicio-hero-insignia">
          <Icono nombre="estrella" /> Guardiana holográfica
        </span>
        <div className="inicio-hero-cartas">
          {PERSONAJES.map((personaje) => (
            <CartaHeroe key={personaje.numero} {...personaje} />
          ))}
        </div>
      </div>
    </section>
  );
}
