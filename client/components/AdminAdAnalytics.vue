<template>
  <div>
    <h3>Ad Performance Dashboard</h3>

    <div class="filters">
      <select v-model="region">
        <option value="">All Regions</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Kenya">Kenya</option>
        <option value="UK">UK</option>
      </select>

      <select v-model="device">
        <option value="">All Devices</option>
        <option value="mobile">Mobile</option>
        <option value="desktop">Desktop</option>
      </select>

      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
      <button @click="load">Apply Filters</button>
    </div>

    <canvas ref="chart" height="300"></canvas>

    <table>
      <thead>
        <tr>
          <th>Ad ID</th>
          <th>Impressions</th>
          <th>Clicks</th>
          <th>CTR</th>
          <th>Spend</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ad in ads" :key="ad.id">
          <td>{{ ad.id }}</td>
          <td>{{ ad.impressions }}</td>
          <td>{{ ad.clicks }}</td>
          <td>{{ (ad.clicks / ad.impressions * 100).toFixed(2) }}%</td>
          <td>{{ ad.spend }}</td>
          <td>{{ ad.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const ads = ref([])
const region = ref('')
const device = ref('')
const startDate = ref('')
const endDate = ref('')
const chart = ref(null)

async function load() {
  const query = new URLSearchParams({ region: region.value, device: device.value, startDate: startDate.value, endDate: endDate.value })
  const res = await fetch(`/api/ads/metrics?${query}`)
  ads.value = await res.json()
  renderChart()
}

function renderChart() {
  const ctx = chart.value.getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ads.value.map(a => a.id),
      datasets: [
        {
          label: 'Impressions',
          data: ads.value.map(a => a.impressions),
          backgroundColor: '#4caf50'
        },
        {
          label: 'Clicks',
          data: ads.value.map(a => a.clicks),
          backgroundColor: '#2196f3'
        }
      ]
    }
  })
}

onMounted(load)
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
}
th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
</style>

