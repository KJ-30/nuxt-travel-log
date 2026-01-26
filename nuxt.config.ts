import "./lib/env"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/eslint'],
  css: [],
  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    }
  },
  tailwindcss: {
    config: {
      darkMode: 'class', // 启用 class 方式的暗色模式
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})