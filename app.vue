<!-- app.vue -->
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script lang="ts" setup>
import { useHead } from 'nuxt/app';

useHead({
  titleTemplate: "%s - DeliveryApp",
  meta: [
    {
      name: "description",
      content: "Sistema completo de delivery de alimentos",
    },
  ],
});
</script>
