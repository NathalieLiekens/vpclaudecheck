import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  
  // Use root base for most deployments
  base: '/',
  
  // Ensure public directory is served correctly
  publicDir: 'public',
  
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    
    // IMPORTANT: Copy public files to build
    copyPublicDir: true,
    
    // Asset handling
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // Inline small assets, copy large ones
    
    rollupOptions: {
      output: {
        // Organize chunks
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
        // Keep asset names predictable
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    
    // Target modern browsers
    target: 'es2015',
    minify: 'esbuild',
  },
  
  server: {
    port: 3000,
    open: true,
    // Serve static files from public
    fs: {
      strict: false
    }
  },
  
  preview: {
    port: 4173,
    open: true,
  },
  
  // IMPORTANT: Include image files
  assetsInclude: [
    '**/*.jpeg', 
    '**/*.jpg', 
    '**/*.png', 
    '**/*.svg',
    '**/*.webp'
  ],
  
  envPrefix: 'VITE_',
});