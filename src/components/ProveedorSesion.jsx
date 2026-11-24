import { useMemo, useState } from "react";
import { ContextoSesion } from "../hooks/useSesion.js";

export default function ProveedorSesion({ children, usuarioInicial = null }) {
  const [usuario, setUsuario] = useState(usuarioInicial);
  const valor = useMemo(() => ({ usuario, setUsuario }), [usuario]);
  return (
    <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>
  );
}
