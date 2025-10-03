import { ref, computed, readonly } from 'vue';
import { supabase } from '~/utils/supabase';

export const useAuth = () => {
  const user = ref(null);
  const loading = ref(false);
  const isAuthenticated = computed(() => !!user.value);
  
  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      user.value = data.user;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };
  
  const logout = async () => {
    try {
      loading.value = true;
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      user.value = null;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };
  
  const signup = async (email: string, password: string) => {
    try {
      loading.value = true;
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      user.value = data.user;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const getCurrentUser = async () => {
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error) throw error;
      user.value = currentUser;
      return currentUser;
    } catch (error) {
      console.error('Get user error:', error);
      user.value = null;
      return null;
    }
  };

  // Initialize user on composable creation
  getCurrentUser();
  
  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    login,
    logout,
    signup,
    getCurrentUser
  };
};
