<template>
  <div>
    <h3>Ad Format A/B Performance</h3>

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
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const rows = ref([])
const chart = ref(null)

onMounted(async () => {
  const res = await fetch('/api/ads/ab-metrics')
  rows.value = await res.json()
  renderChart()
})

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
</script>

<style scoped>
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


