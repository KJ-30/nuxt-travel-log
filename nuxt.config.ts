import "./lib/env"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@nuxt/eslint"],
  devtools: { enabled: true },
  css: [],
  compatibilityDate: "2025-07-15",
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },
  tailwindcss: {
    config: {
      darkMode: "class", // 启用 class 方式的暗色模式
    },
  },
});
