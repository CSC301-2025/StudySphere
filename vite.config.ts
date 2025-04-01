import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    server: {
      host: '::',
      port: 8080,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, "localhost-key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "localhost-cert.pem")),
      },
      proxy: {
        '/api': {
          target: isProd
            ? 'https://StudySphereV1-env.eba-vtn6acad.us-east-2.elasticbeanstalk.com'
            : 'https://localhost:8443',
          changeOrigin: true,
          secure: isProd ? true : false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

