// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  ssr: false,
  app: {
    head: {
      title: 'DeliveryApp - Sistema de Delivery',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // { hid: 'description', name: 'description', content: 'Sistema completo de delivery de alimentos' }
        { name: 'description', content: 'Sistema completo de delivery de alimentos' }
      ]
    }
  }
})
