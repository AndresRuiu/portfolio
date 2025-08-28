import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({
      // Enable SWC for better performance in development
      jsxRuntime: 'automatic',
    }),
    splitVendorChunkPlugin(),
    // Bundle analyzer - solo en build con ANALYZE=true
    process.env.ANALYZE === 'true' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Estrategia de chunking ultra-simple para evitar ALL dependencias circulares
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Todo lo demás en un solo vendor chunk
            return 'vendor';
          }

          // App code - todo junto para evitar dependencias circulares
          if (id.includes('src/')) {
            return 'app';
          }
        },
        // Optimizar nombres de archivos
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'unknown';
          return `js/[name]-[hash]-${facadeModuleId}.js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          if (assetInfo.name?.match(/\.(png|jpe?g|gif|svg|webp|avif)$/)) {
            return 'images/[name]-[hash][extname]';
          }
          if (assetInfo.name?.match(/\.(woff2?|eot|ttf|otf)$/)) {
            return 'fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Configuración de minificación
    minify: 'esbuild',
    sourcemap: process.env.NODE_ENV === 'development',
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
    // Optimizar tamaños de chunk
    chunkSizeWarningLimit: 800,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimizaciones adicionales
    reportCompressedSize: false,
    cssMinify: true,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      '@tanstack/react-query',
      'clsx',
      'tailwind-merge',
      'class-variance-authority'
    ],
    exclude: ['@vercel/analytics', '@vercel/speed-insights']
  },
  // Performance optimizations
  server: {
    hmr: {
      overlay: false
    },
    fs: {
      // Permitir acceso a archivos fuera del root para mejor performance
      allow: ['..']
    }
  },
  // Configuración de esbuild balanceada - funcional pero optimizada
  esbuild: {
    target: 'es2020',
    // Solo minificaciones seguras
    keepNames: false,
    minifyIdentifiers: false, // Mantener deshabilitado para evitar problemas de referencia
    minifySyntax: true,       // Seguro - optimiza sintaxis
    minifyWhitespace: true,   // Seguro - remueve espacios
    // Remover console.log en producción
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  // Configuración de CSS
  css: {
    devSourcemap: false,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  // Configuración de preview
  preview: {
    port: 4173,
    strictPort: true,
  },
  // Define globals para mejor tree-shaking
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
  }
});