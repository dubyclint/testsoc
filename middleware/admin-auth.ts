export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
  
  if (!user.value?.role || user.value.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Admin privileges required.'
    });
  }
});
