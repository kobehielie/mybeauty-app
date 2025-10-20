import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    fs: {
      strict: false
    }
  },
  esbuild: {
    jsx: 'automatic'
  },
  build: {
    // Optimisation du code splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Séparer les dépendances vendor
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('leaflet')) {
              return 'leaflet-vendor';
            }
            return 'vendor';
          }
        }
      }
    },
    // Optimiser la taille des chunks
    chunkSizeWarningLimit: 1000,
    // Minification optimale (rolldown utilise esbuild par défaut)
    minify: true,
    // Réduire la taille des assets
    assetsInlineLimit: 4096, // Inline des assets < 4kb
    cssCodeSplit: true, // Séparer le CSS par chunk
  },
  // Optimisation des performances
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
