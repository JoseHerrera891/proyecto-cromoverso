import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContextoSesion } from "../hooks/useSesion.js";
import {
  cerrarSesion,
  debeCerrarSesionAlIniciar,
  obtenerSesion,
} from "../utils/sesion.js";

/**
 * Sesión de la persona. La cookie httpOnly `sesion` la maneja el navegador;
 * aquí solo se guarda el usuario que devuelve GET /sesion.
 */
export default function ProveedorSesion({
  children,
  usuarioInicial = null,
  verificarAlIniciar = true,
}) {
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [verificada, setVerificada] = useState(!verificarAlIniciar);
  const navigate = useNavigate();
  const usuarioActual = useRef(usuario);
  usuarioActual.current = usuario;

  // Si la sesión vence (401 no_autenticado) se lleva a la persona a ingresar.
  const sesionVencida = useCallback(() => {
    setUsuario(null);
    navigate("/ingresar");
  }, [navigate]);

  const verificar = useCallback(async () => {
    try {
      const actual = await obtenerSesion();
      if (!actual && usuarioActual.current) sesionVencida();
      else setUsuario(actual);
    } catch {
      // Sin conexión: se conserva lo que había.
    } finally {
      setVerificada(true);
    }
  }, [sesionVencida]);

  useEffect(() => {
    if (!verificarAlIniciar) return;
    if (debeCerrarSesionAlIniciar()) {
      cerrarSesion()
        .catch(() => {})
        .finally(verificar);
    } else {
      verificar();
    }
    // Solo al cargar la aplicación.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function alVolver() {
      if (document.visibilityState === "visible" && usuarioActual.current) {
        verificar();
      }
    }
    document.addEventListener("visibilitychange", alVolver);
    window.addEventListener("focus", alVolver);
    return () => {
      document.removeEventListener("visibilitychange", alVolver);
      window.removeEventListener("focus", alVolver);
    };
  }, [verificar]);

  const salir = useCallback(async () => {
    try {
      await cerrarSesion();
    } finally {
      setUsuario(null);
      navigate("/");
    }
  }, [navigate]);

  const valor = useMemo(
    () => ({ usuario, setUsuario, verificada, salir, sesionVencida }),
    [usuario, verificada, salir, sesionVencida],
  );
  return (
    <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>
  );
}
