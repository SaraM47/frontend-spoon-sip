import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        menu: 'src/pages/menu.html',
        takeaway: 'src/pages/takeaway.html',
        ourstory: 'src/pages/ourstory.html',
        login: 'src/pages/login.html',
        register: 'src/pages/register.html',
        admin: 'src/pages/admin.html',
      },
    },
  },
});
