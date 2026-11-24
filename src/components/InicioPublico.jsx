import { useInicioPublico } from "../hooks/useInicioPublico.js";
import InicioHero from "./InicioHero.jsx";
import InicioMundos from "./InicioMundos.jsx";

/** Vista 1 · Inicio público: portada y los seis mundos del álbum. */
export default function InicioPublico({ textos }) {
  const estado = useInicioPublico();

  return (
    <>
      <InicioHero
        textos={textos}
        destacados={estado.datos?.destacados}
        rarezas={estado.datos?.rarezas}
      />
      <InicioMundos textos={textos} {...estado} />
    </>
  );
}
