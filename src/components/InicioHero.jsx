import { Link } from "react-router-dom";
import "./InicioHero.css";

export default function InicioHero({ textos }) {
  const hero = textos?.paginas?.inicio?.hero;
  if (!hero) return null;

  return (
    <section className="inicio-hero" aria-labelledby="inicio-hero-titulo">
      <div className="inicio-hero-contenido">
        <h1 id="inicio-hero-titulo">{hero.titulo}</h1>
        <p className="inicio-hero-subtitulo inicio-hero-subtitulo--escritorio">
          {hero.subtitulo}
        </p>
        <p className="inicio-hero-subtitulo inicio-hero-subtitulo--movil">
          {hero.subtituloMovil}
        </p>
        <div className="inicio-hero-acciones">
          <Link
            className="inicio-hero-boton inicio-hero-boton--acento"
            to="/registro"
          >
            {hero.botones.crearCuentaGratis}
          </Link>
          <a
            className="inicio-hero-boton inicio-hero-boton--claro"
            href="#mundos"
          >
            {hero.botones.explorarMundos}
          </a>
        </div>
      </div>
      <div className="inicio-hero-cartas" aria-hidden="true">
        <span className="inicio-hero-carta inicio-hero-carta--una" />
        <span className="inicio-hero-carta inicio-hero-carta--dos" />
        <span className="inicio-hero-carta inicio-hero-carta--tres" />
      </div>
    </section>
  );
}
