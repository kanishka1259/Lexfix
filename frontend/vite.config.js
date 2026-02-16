import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@adhd": path.resolve(__dirname, "../adhd_learning_lexfix/frontend/src"),
      "@module4": path.resolve(__dirname, "../module4/frontend"),
      "socket.io-client": path.resolve(__dirname, "./node_modules/socket.io-client"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react-router-dom": path.resolve(__dirname, "./node_modules/react-router-dom"),
      "axios": path.resolve(__dirname, "./node_modules/axios"),


    },
  },
})
