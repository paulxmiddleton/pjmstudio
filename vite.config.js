// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home.html'),
        homeSimple: resolve(__dirname, 'home-simple.html'),
      },
      output: {
        // Organize assets by type
        assetFileNames: (assetInfo) => {
          const info = (assetInfo.names?.[0] || 'asset').split('.');
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          } else if (/mp4|webm|mov|avi/i.test(extType)) {
            extType = 'videos';
          }
          return `${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    // Asset optimization
    minify: 'esbuild',
    sourcemap: false,
    // Increase chunk size warning limit for medieval assets
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    // Enable hot reload for all file types
    watch: {
      include: ['src/**/*', 'index.html', 'home.html'],
    },
  },
  // Asset processing
  assetsInclude: ['**/*.mov', '**/*.webm'],
  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@js': resolve(__dirname, 'src/js'),
    },
  },
});