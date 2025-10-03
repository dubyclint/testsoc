import { defineStore } from 'pinia';

interface UserState {
  userId: string | null;
  email: string | null;
  username: string | null;
  role: 'admin' | 'buyer' | 'seller' | 'user' | null;
  isVerified: boolean;
  rank: string | null;
  rankPoints: number;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: null,
    email: null,
    username: null,
    role: null,
    isVerified: false,
    rank: null,
    rankPoints: 0,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isAdmin: (state) => state.role === 'admin',
    isSeller: (state) => state.role === 'seller',
    isBuyer: (state) => state.role === 'buyer',
    displayName: (state) => state.username || state.email || 'Anonymous'
  },

  actions: {
    setUser(user: {
      id: string;
      email: string;
      username?: string;
      role?: string;
      isVerified?: boolean;
      rank?: string;
      rankPoints?: number;
    }) {
      this.userId = user.id;
      this.email = user.email;
      this.username = user.username || null;
      this.role = user.role as UserState['role'] || 'user';
      this.isVerified = user.isVerified || false;
      this.rank = user.rank || 'Homie';
      this.rankPoints = user.rankPoints || 0;
      this.isAuthenticated = true;
    },

    clearUser() {
      this.userId = null;
      this.email = null;
      this.username = null;
      this.role = null;
      this.isVerified = false;
      this.rank = null;
      this.rankPoints = 0;
      this.isAuthenticated = false;
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    updateRank(newRank: string, newPoints: number) {
      this.rank = newRank;
      this.rankPoints = newPoints;
    }
  }
});

