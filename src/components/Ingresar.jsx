import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import abanico from "../assets/ilustraciones/abanico-de-cromos.webp";
import abanico2x from "../assets/ilustraciones/abanico-de-cromos@2x.webp";
import { useSesion } from "../hooks/useSesion.js";
import { useTituloDocumento } from "../hooks/useTituloDocumento.js";
import { clasesBoton } from "../utils/clasesBoton.js";
import { avisoDeError } from "../utils/erroresIngreso.js";
import { iniciarSesion, recordarPreferenciaDeSesion } from "../utils/sesion.js";
import { insertarVariables } from "../utils/textos.js";
import CampoClave from "./CampoClave.jsx";
import Icono from "./Icono.jsx";
import TextField from "./TextField.jsx";
import "./Ingresar.css";

const LOGO_NORMAL = "/marca/logo-normal.svg";
const LOGO_INVERSO = "/marca/logo-inverso.svg";

/** Errores de campos vacíos, en el orden en que aparecen en el formulario. */
export function validarIngreso({ correo, clave }, errores) {
  const resultado = {};
  if (!correo.trim()) resultado.correo = errores.correoObligatorio;
  if (!clave) resultado.clave = errores.claveObligatoria;
  return resultado;
}

function Aviso({ titulo, texto }) {
  return (
    <div className="ingreso-aviso" role="alert">
      <Icono nombre="alerta" />
      <div>
        <p className="ingreso-aviso-titulo">{titulo}</p>
        {/* La cuenta regresiva cambia cada segundo: no se vuelve a anunciar. */}
        <p aria-live="off">{texto}</p>
      </div>
    </div>
  );
}

/** Vista 4 · Iniciar sesión (POST /sesion). */
export default function Ingresar({ textos }) {
  const pagina = textos?.paginas?.ingresar;
  const { setUsuario } = useSesion();
  const navigate = useNavigate();
  const [valores, setValores] = useState({ correo: "", clave: "" });
  const [mantener, setMantener] = useState(true);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const campos = { correo: useRef(null), clave: useRef(null) };

  useTituloDocumento(pagina?.seo?.titulo, pagina?.seo?.descripcion);

  // Cuenta regresiva del bloqueo por demasiados intentos (Retry-After).
  useEffect(() => {
    if (segundos <= 0) return undefined;
    const temporizador = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(temporizador);
  }, [segundos]);

  if (!pagina) return null;
  const { formulario, presentacion } = pagina;
  const bloqueado = segundos > 0;
  const textoAviso =
    aviso?.tipo === "bloqueo"
      ? insertarVariables(aviso.texto, { segundos })
      : aviso?.texto;

  function cambiar(evento) {
    const { name, value } = evento.target;
    setValores((actuales) => ({ ...actuales, [name]: value }));
    if (errores[name])
      setErrores((actuales) => ({ ...actuales, [name]: null }));
  }

  function marcarCampos(nuevosErrores) {
    setErrores(nuevosErrores);
    const primero = Object.keys(nuevosErrores)[0];
    if (primero) campos[primero].current?.focus();
    return Boolean(primero);
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (enviando || bloqueado) return;
    if (marcarCampos(validarIngreso(valores, pagina.errores))) {
      setAviso(pagina.errores.camposObligatorios);
      return;
    }
    setAviso(null);
    setEnviando(true);
    try {
      const usuario = await iniciarSesion(valores);
      recordarPreferenciaDeSesion(mantener);
      setUsuario(usuario);
      navigate("/");
    } catch (error) {
      const resultado = avisoDeError(error, pagina, textos);
      setAviso({ ...resultado.aviso, tipo: resultado.tipo });
      if (resultado.campos) marcarCampos(resultado.campos);
      if (resultado.segundos) setSegundos(resultado.segundos);
      setEnviando(false);
    }
  }

  let etiquetaBoton = formulario.botones.ingresar;
  if (enviando) etiquetaBoton = formulario.mensajes.ingresando;
  else if (aviso?.tipo === "conexion")
    etiquetaBoton = pagina.errores.conexion.botones.reintentar;

  return (
    <div className="ingreso">
      <section className="ingreso-escenario" aria-hidden="true">
        <img className="ingreso-logo" src={LOGO_INVERSO} alt="" />
        <img
          className="ingreso-abanico"
          src={abanico}
          srcSet={`${abanico} 1x, ${abanico2x} 2x`}
          width="600"
          height="420"
          fetchPriority="high"
          alt=""
        />
        <div className="ingreso-lema">
          <span className="ingreso-etiqueta">
            {presentacion.etiquetas.temporada}
          </span>
          <p className="ingreso-lema-titulo">
            {presentacion.titulo.split(/(?<=\.)\s+/).map((frase) => (
              <span key={frase}>{frase} </span>
            ))}
          </p>
          <p className="ingreso-lema-texto">{presentacion.texto}</p>
        </div>
      </section>

      <div className="ingreso-lado">
        <form className="ingreso-formulario" onSubmit={enviar} noValidate>
          <Link
            className="ingreso-marca"
            to="/"
            aria-label={textos.navbar?.logo?.aria}
          >
            <img src={LOGO_NORMAL} alt="" />
          </Link>
          <h1>{formulario.titulo}</h1>
          <p className="ingreso-subtitulo">{formulario.subtitulo}</p>

          {aviso && <Aviso titulo={aviso.titulo} texto={textoAviso} />}

          <fieldset className="ingreso-campos" disabled={bloqueado}>
            <TextField
              ref={campos.correo}
              id="ingreso-correo"
              name="correo"
              type="email"
              autoComplete="email"
              label={formulario.etiquetas.correo}
              placeholder={formulario.placeholders.correo}
              value={valores.correo}
              onChange={cambiar}
              error={errores.correo}
            />
            <CampoClave
              ref={campos.clave}
              id="ingreso-clave"
              name="clave"
              label={formulario.etiquetas.clave}
              etiquetaMostrar={formulario.botones.mostrarClave}
              etiquetaOcultar={formulario.botones.ocultarClave}
              value={valores.clave}
              onChange={cambiar}
              error={errores.clave}
            />
          </fieldset>

          <div className="ingreso-recordar">
            <label className="ingreso-casilla">
              <input
                type="checkbox"
                checked={mantener}
                onChange={(evento) => setMantener(evento.target.checked)}
              />
              <span className="ingreso-casilla-marca" aria-hidden="true">
                <Icono nombre="check" />
              </span>
              {formulario.etiquetas.mantenerSesion}
            </label>
            <Link className="ingreso-enlace" to="/recuperar-clave">
              {formulario.enlaces.olvidasteClave}
            </Link>
          </div>

          <button
            type="submit"
            className={clasesBoton("primario", "g", "ingreso-enviar")}
            disabled={enviando || bloqueado}
            aria-busy={enviando}
          >
            {enviando && (
              <span className="ingreso-girando" aria-hidden="true" />
            )}
            {etiquetaBoton}
          </button>

          <p className="ingreso-pie">
            {formulario.mensajes.sinCuenta}{" "}
            <Link className="ingreso-enlace" to="/registro">
              {formulario.enlaces.crearCuenta}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
