import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bookingInvoice: resolve(__dirname, 'booking-invoice.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});

