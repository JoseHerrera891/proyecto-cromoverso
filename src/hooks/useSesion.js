// US-CRO-S2-05 · Mantener la sesión y cerrarla
import { createContext, useContext } from "react";

/** Usuario con sesión iniciada (o null). Nunca guarda el token. */
export const ContextoSesion = createContext({
  usuario: null,
  setUsuario: () => {},
  verificada: true,
  salir: () => {},
  sesionVencida: () => {},
});

export function useSesion() {
  return useContext(ContextoSesion);
}
