import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'buffer';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer/'
    }
  }
  // define: {
  //   'global.Buffer': Buffer
  // }
});