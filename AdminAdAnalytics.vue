<template>
  <div class="admin-ad-analytics">
    <h2>📊 Ad Analytics Dashboard</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Impressions</h3>
        <p class="stat-number">{{ totalImpressions }}</p>
      </div>
      <div class="stat-card">
        <h3>Click Rate</h3>
        <p class="stat-number">{{ clickRate }}%</p>
      </div>
      <div class="stat-card">
        <h3>Revenue</h3>
        <p class="stat-number">${{ revenue }}</p>
      </div>
    </div>
    <div class="chart-placeholder">
      <p>Analytics charts will be implemented here</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const totalImpressions = ref(12500);
const clickRate = ref(3.2);
const revenue = ref(248.50);
</script>

<style scoped>
.admin-ad-analytics {
  padding: 2rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}
.stat-card {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}
.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
}
.chart-placeholder {
  background: #f9f9f9;
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
  color: #666;
}
</style>
