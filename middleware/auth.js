export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAppState()
  
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
})
