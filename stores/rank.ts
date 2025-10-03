import { defineStore } from 'pinia';

interface RankData {
  rank: string;
  points: number;
  level: number;
  next?: string;
  nextLevelPoints?: number;
  hidden?: boolean;
}

interface RankState {
  cache: Record<string, RankData>;
  loading: boolean;
  error: string | null;
}

export const useRankStore = defineStore('rank', {
  state: (): RankState => ({
    cache: {},
    loading: false,
    error: null
  }),

  getters: {
    getRankData: (state) => (userId: string): RankData | null => {
      return state.cache[userId] || null;
    }
  },

  actions: {
    async fetchRank(userId: string): Promise<RankData> {
      if (this.cache[userId]) {
        return this.cache[userId];
      }

      try {
        this.loading = true;
        this.error = null;
        
        const response = await fetch(`/api/rank/get?userId=${encodeURIComponent(userId)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch rank: ${response.statusText}`);
        }
        
        const data: RankData = await response.json();
        this.cache[userId] = data;
        return data;
      } catch (error) {
        console.error('Error fetching rank:', error);
        this.error = error.message || 'Failed to fetch rank';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    getProgress(userId: string) {
      const data = this.cache[userId] || {};
      return {
        rank: data.rank || 'Homie',
        next: data.next || null,
        points: data.points || 0,
        level: data.level || 1,
        hidden: data.hidden || false,
        progress: data.nextLevelPoints ? 
          Math.min(100, (data.points / data.nextLevelPoints) * 100) : 0
      };
    },

    async updateRank(userId: string, delta: number): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await fetch('/api/rank/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, delta })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update rank: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Update cache with new data
        if (this.cache[userId]) {
          this.cache[userId] = {
            ...this.cache[userId],
            rank: result.newRank,
            points: result.newPoints
          };
        }
        
        return result;
      } catch (error) {
        console.error('Error updating rank:', error);
        this.error = error.message || 'Failed to update rank';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearCache(userId?: string) {
      if (userId) {
        delete this.cache[userId];
      } else {
        this.cache = {};
      }
    },

    clearError() {
      this.error = null;
    }
  }
});
