// US-CRO-S1-01 · Configurar el proyecto y el sistema de diseño
// US-CRO-S2-05 · Mantener la sesión y cerrarla
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
// Fuentes servidas desde el propio sitio: solo alfabeto latino y pesos usados.
import "@fontsource/rubik/latin-400.css";
import "@fontsource/rubik/latin-600.css";
import "@fontsource/rubik/latin-700.css";
import "@fontsource/unbounded/latin-600.css";
import "@fontsource/unbounded/latin-700.css";
import "./styles/tokens.css";
import "./styles/global.css";
import App from "./App.jsx";
import ProveedorSesion from "./components/ProveedorSesion.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* US-CRO-S2-05 · C2: la sesión se consulta al cargar la página (GET /sesion). */}
      <ProveedorSesion>
        <App />
      </ProveedorSesion>
    </BrowserRouter>
  </StrictMode>,
);
