import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Las imágenes de cromos van como archivos aparte (se cargan en diferido);
    // incrustarlas en base64 haría crecer el JavaScript inicial.
    assetsInlineLimit: (archivo) =>
      archivo.endsWith(".webp") ? false : undefined,
  },
  test: {
    env: {
      VITE_API_BASE_URL: "http://localhost:3000/api",
    },
  },
});
