export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});
