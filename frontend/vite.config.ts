import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  envDir: "..",
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5173,
  },
});
