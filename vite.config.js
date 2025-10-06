import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replace this with your ngrok URL if you already have one.
// You can also leave it as empty string and ngrok will work with CORS.
const NGROK_URL = "https://multimotored-myrl-dicastic.ngrok-free.dev";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to LAN
    port: 5173,
    strictPort: true,
    cors: true,       // Allow requests from any origin
    origin: NGROK_URL // Accept requests from your ngrok URL
  },
});
