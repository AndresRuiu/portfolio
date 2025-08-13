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
        // Estrategia de chunking más inteligente
        manualChunks: (id) => {
          // Vendor chunks por categoría
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            // Animations y motion
            if (id.includes('framer-motion') || id.includes('lenis')) {
              return 'animations';
            }
            // UI libraries
            if (id.includes('@radix-ui') || id.includes('cmdk') || id.includes('sonner')) {
              return 'ui';
            }
            // Icons y assets
            if (id.includes('lucide-react') || id.includes('react-loading-skeleton')) {
              return 'icons';
            }
            // React Query y state management
            if (id.includes('@tanstack/react-query') || id.includes('react-helmet-async')) {
              return 'data';
            }
            // Lightbox y media
            if (id.includes('yet-another-react-lightbox')) {
              return 'media';
            }
            // Utilities
            if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'utils';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // Resto de vendor dependencies
            return 'vendor';
          }

          // App chunks por feature
          if (id.includes('src/pages')) {
            if (id.includes('HomePage')) return 'page-home';
            if (id.includes('ProjectsPage') || id.includes('ProjectGallery')) return 'page-projects';
            if (id.includes('ServiciosPage')) return 'page-services';
            if (id.includes('EducacionPage')) return 'page-education';
          }

          // Components chunks
          if (id.includes('src/components')) {
            if (id.includes('ui/') || id.includes('UnifiedCard')) return 'ui-components';
            if (id.includes('magicui/')) return 'magic-ui';
            if (id.includes('SectionReveal') || id.includes('OptimizedImage')) return 'common-components';
          }

          // Hooks y utilities
          if (id.includes('src/hooks') || id.includes('src/lib')) {
            return 'app-utils';
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
  // Preload critical modules
  esbuild: {
    target: 'es2020',
    keepNames: false,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
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