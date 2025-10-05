<template>
  <div>
    <!-- Redirect logic handled in script -->
  </div>
</template>

<script setup>
const { isLoggedIn, isOwner } = useAppState()

// Redirect baseado no status de login
watchEffect(() => {
  if (!isLoggedIn.value) {
    navigateTo('/login')
  } else if (isOwner.value) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/menu')
  }
})

useHead({
  title: 'Início'
})
</script>
