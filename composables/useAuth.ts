import { ref, computed } from 'vue';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser(); // Use built-in user state
  const loading = ref(false);
  const error = ref('');
  
  const isAuthenticated = computed(() => !!user.value);
  
  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = '';
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      // Navigation will be handled by the calling component
      return { success: true, user: data.user };
    } catch (err: any) {
      error.value = err.message;
      console.error('Login error:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };
  
  const signup = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = '';
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (signUpError) throw signUpError;
      
      if (data.user && !data.user.email_confirmed_at) {
        return { success: true, user: data.user, needsConfirmation: true };
      }
      
      return { success: true, user: data.user };
    } catch (err: any) {
      error.value = err.message;
      console.error('Signup error:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };
  
  const logout = async () => {
    try {
      loading.value = true;
      error.value = '';
      
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      await navigateTo('/');
      return { success: true };
    } catch (err: any) {
      error.value = err.message;
      console.error('Logout error:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };
  
  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    login,
    signup,
    logout
  };
};
