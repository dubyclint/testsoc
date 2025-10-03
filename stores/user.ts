import { defineStore } from 'pinia';
import { supabase } from '~/utils/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  role?: 'admin' | 'buyer' | 'seller' | 'user';
  is_verified?: boolean;
  rank?: string;
  rank_points?: number;
  avatar_url?: string;
}

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isAdmin: (state) => state.profile?.role === 'admin',
    isSeller: (state) => state.profile?.role === 'seller',
    isBuyer: (state) => state.profile?.role === 'buyer',
    isVerified: (state) => state.profile?.is_verified || false,
    displayName: (state) => state.profile?.username || state.user?.email || 'Anonymous',
    rankPoints: (state) => state.profile?.rank_points || 0,
    currentRank: (state) => state.profile?.rank || null
  },

  actions: {
    async setUser(user: User | null) {
      this.user = user;
      this.isAuthenticated = !!user;
      
      if (user) {
        await this.fetchProfile();
      } else {
        this.profile = null;
      }
    },

    async fetchProfile() {
      if (!this.user) return;
      
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        this.profile = data || {
          id: this.user.id,
          email: this.user.email!,
          role: 'user'
        };
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(updates: Partial<UserProfile>) {
      if (!this.user) return;

      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id: this.user.id,
            ...this.profile,
            ...updates,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        
        this.profile = data;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      await supabase.auth.signOut();
      this.user = null;
      this.profile = null;
      this.isAuthenticated = false;
    },

    async initialize() {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await this.setUser(session.user);
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        await this.setUser(session?.user || null);
      });
    }
  }
});


