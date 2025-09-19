export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUserStore()
  if (!user.isAdmin) return navigateTo('/')
})
