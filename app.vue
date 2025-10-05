<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Configuração global da aplicação
useHead({
  titleTemplate: '%s - DeliveryApp',
  meta: [
    { name: 'description', content: 'Sistema completo de delivery de alimentos' }
  ]
})
</script>
