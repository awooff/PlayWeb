// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', '~/assets/css/colours.css'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  image: {
    domains: [
      'nataziel.nexus'
    ],
  },
  nitro: {
    experimental: {
      wasm: true
    }
  },
  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@pinia/nuxt'
  ]
})