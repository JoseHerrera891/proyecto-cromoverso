import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    env: {
      VITE_API_BASE_URL: "http://localhost:3000/api",
    },
  },
});

