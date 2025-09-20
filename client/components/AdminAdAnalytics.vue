<template>
  <div>
    <h3>Ad Performance Dashboard</h3>
    <table>
      <thead>
        <tr>
          <th>Ad ID</th>
          <th>Impressions</th>
          <th>Clicks</th>
          <th>CTR</th>
          <th>Spend (USDT)</th>
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
const ads = ref([])

onMounted(async () => {
  const res = await fetch('/api/ads/metrics')
  ads.value = await res.json()
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
</style>
