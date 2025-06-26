import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'src/pages/menu.html'),
        takeaway: resolve(__dirname, 'src/pages/takeaway.html'),
        ourstory: resolve(__dirname, 'src/pages/ourstory.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        register: resolve(__dirname, 'src/pages/register.html'),
        admin: resolve(__dirname, 'src/pages/admin.html'),
      },
    },
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:3000",
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
});
