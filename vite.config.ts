import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        menu: 'menu.html',
        takeaway: 'takeaway.html',
        ourstory: 'ourstory.html',
        login: 'login.html',
        register: 'register.html',
        admin: 'admin.html'
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
