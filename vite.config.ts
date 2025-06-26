import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', // Startfile in the root
        menu: 'src/pages/menu.html',
        takeaway: 'src/pages/takeaway.html',
        ourstory: 'src/pages/ourstory.html',
        login: 'src/pages/login.html',
        register: 'src/pages/register.html',
        admin: 'src/pages/admin.html'
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
