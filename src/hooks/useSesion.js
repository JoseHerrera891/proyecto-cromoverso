import { createContext, useContext } from "react";

/** Usuario con sesión iniciada (o null). Nunca guarda el token. */
export const ContextoSesion = createContext({
  usuario: null,
  setUsuario: () => {},
});

export function useSesion() {
  return useContext(ContextoSesion);
}
