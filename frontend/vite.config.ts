import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// SPA dev server. Proxies /customers, /devices, /tickets, /auth, /ai to the
// Express backend on :3001 so the frontend can call relative paths like
// fetch("/auth/login") without hardcoding a host, and without hitting CORS
// in dev (the backend also has app.use(cors()) for when this proxy isn't used).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:3001",
      "/customers": "http://localhost:3001",
      "/devices": "http://localhost:3001",
      "/tickets": "http://localhost:3001",
      "/ai": "http://localhost:3001"
    }
  }
});
