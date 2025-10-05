export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn, isOwner } = useAppState()
  
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
  
  if (!isOwner.value) {
    return navigateTo('/menu')
  }
})
