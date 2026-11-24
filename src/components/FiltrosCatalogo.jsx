import { Link } from "react-router-dom";
import { contarPor, ordenarRarezas } from "../utils/catalogo.js";
import { clasesBoton } from "../utils/clasesBoton.js";
import { insertarVariables, plural } from "../utils/textos.js";
import Badge from "./Badge.jsx";
import Icono from "./Icono.jsx";
import "./FiltrosCatalogo.css";

/** Columna de mundos y filtros del catálogo (Figma · «Columna mundos»). */
export default function FiltrosCatalogo({
  mundo,
  mundos,
  rarezas,
  pagina,
  filtros,
  enlaceFiltro,
}) {
  const cantidad = pagina.filtros.cantidad;
  const porRareza = mundo.porRareza ?? contarPor(mundo.cromos, "rareza");
  const porTipo = contarPor(mundo.cromos, "tipo");
  const tipos = Object.entries(pagina.filtros.tipo.opciones);
  const hayFiltros = Boolean(filtros.rareza || filtros.tipo);

  return (
    <aside className="filtros-catalogo">
      <nav
        className="filtros-panel filtros-mundos"
        aria-labelledby="filtros-mundos-titulo"
      >
        <h2 id="filtros-mundos-titulo">{pagina.mundos.titulo}</h2>
        <ul>
          {mundos.map((item) => {
            const actual = item.id === mundo.id;
            return (
              <li key={item.id}>
                <Link
                  to={`/mundos/${encodeURIComponent(item.id)}`}
                  aria-current={actual ? "page" : undefined}
                  style={{ "--color-mundo": item.color }}
                >
                  <span className="filtros-mundo-fila">
                    <span className="filtros-mundo-punto" aria-hidden="true" />
                    <span className="filtros-mundo-nombre">{item.nombre}</span>
                    <span className="filtros-mundo-total">
                      {insertarVariables(pagina.mundos.cromos, {
                        cantidad: item.totalCromos,
                      })}
                    </span>
                  </span>
                  {actual && (
                    <span className="filtros-mundo-actual">
                      {pagina.mundos.aria.paginaActual}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <section
        className="filtros-panel"
        aria-labelledby="filtros-rareza-titulo"
      >
        <h2 id="filtros-rareza-titulo">{pagina.filtros.rareza.titulo}</h2>
        <ul>
          {ordenarRarezas(rarezas).map((rareza) => {
            const activa = filtros.rareza === rareza.id;
            return (
              <li key={rareza.id}>
                <Link
                  className="filtros-opcion"
                  to={enlaceFiltro("rareza", activa ? "" : rareza.id)}
                  aria-current={activa ? "true" : undefined}
                >
                  <Badge rareza={rareza.id}>
                    <Icono nombre={`rareza-${rareza.icono}`} />
                    {rareza.nombre}
                  </Badge>
                  <span className="filtros-cantidad">
                    {plural(cantidad, porRareza[rareza.id] ?? 0)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="filtros-panel" aria-labelledby="filtros-tipo-titulo">
        <h2 id="filtros-tipo-titulo">{pagina.filtros.tipo.titulo}</h2>
        <ul>
          {tipos.map(([tipo, etiqueta]) => {
            const activo = filtros.tipo === tipo;
            return (
              <li key={tipo}>
                <Link
                  className="filtros-opcion"
                  to={enlaceFiltro("tipo", activo ? "" : tipo)}
                  aria-current={activo ? "true" : undefined}
                >
                  <span className="filtros-tipo">{etiqueta}</span>
                  <span className="filtros-cantidad">
                    {plural(cantidad, porTipo[tipo] ?? 0)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {hayFiltros && (
        <Link
          className={clasesBoton("secundario", "m", "filtros-limpiar")}
          to={enlaceFiltro(null)}
        >
          {pagina.vacio.botones.limpiar}
        </Link>
      )}
    </aside>
  );
}
