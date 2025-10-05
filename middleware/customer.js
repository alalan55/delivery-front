export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn, isCustomer } = useAppState()
  
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
  
  if (!isCustomer.value) {
    return navigateTo('/dashboard')
  }
})
