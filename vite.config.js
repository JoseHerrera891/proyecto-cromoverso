import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// vitest.config.js o vite.config.js
export default defineConfig({
  // ... tu otra configuración
  test: {
    env: {
      VITE_API_BASE_URL: "http://localhost:3000/api", // O la URL de prueba que prefieras
    },
  },
});
