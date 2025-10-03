import { ref, computed } from 'vue';
import { supabase } from '~/utils/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const user = ref<User | null>(null);
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
    } catch (error: any) {
      console.error('Login error:', error);
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
    } catch (error: any) {
      console.error('Signup error:', error);
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
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };
  
  const getCurrentUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      user.value = currentUser;
      return currentUser;
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  };
  
  // Listen to auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null;
  });
  
  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    login,
    signup,
    logout,
    getCurrentUser
  };
};
