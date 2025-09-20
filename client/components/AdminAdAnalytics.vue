<template>
  <div>
    <h3>Ad Format A/B Performance</h3>

    <div class="filters">
      <select v-model="page">
        <option value="">All Pages</option>
        <option value="Home Feed">Home Feed</option>
        <option value="Explore">Explore</option>
        <option value="Profile">Profile</option>
        <option value="Post Detail">Post Detail</option>
        <option value="Chat Sidebar">Chat Sidebar</option>
        <option value="Trade Listings">Trade Listings</option>
      </select>

      <select v-model="region">
        <option value="">All Regions</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Kenya">Kenya</option>
        <option value="UK">UK</option>
      </select>

      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
      <button @click="load">Apply Filters</button>
    </div>

    <canvas ref="chart" height="300"></canvas>

    <table>
      <thead>
        <tr>
          <th>Format</th>
          <th>Impressions</th>
          <th>Clicks</th>
          <th>CTR</th>
          <th>Conversions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.format">
          <td>{{ row.format }}</td>
          <td>{{ row.impressions }}</td>
          <td>{{ row.clicks }}</td>
          <td>{{ row.ctr.toFixed(2) }}%</td>
          <td>{{ row.conversions }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Chart from 'chart.js/auto'

const rows = ref([])
const chart = ref(null)
const page = ref('')
const region = ref('')
const startDate = ref('')
const endDate = ref('')

async function load() {
  const query = new URLSearchParams({
    page: page.value,
    region: region.value,
    startDate: startDate.value,
    endDate: endDate.value
  })
  const res = await fetch(`/api/ads/ab-metrics?${query}`)
  rows.value = await res.json()
  renderChart()
}

function renderChart() {
  const ctx = chart.value.getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rows.value.map(r => r.format),
      datasets: [
        {
          label: 'Impressions',
          data: rows.value.map(r => r.impressions),
          backgroundColor: '#4caf50'
        },
        {
          label: 'Clicks',
          data: rows.value.map(r => r.clicks),
          backgroundColor: '#2196f3'
        },
        {
          label: 'Conversions',
          data: rows.value.map(r => r.conversions),
          backgroundColor: '#ff9800'
        }
      ]
    }
  })
}

load()
</script>

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
</style>


