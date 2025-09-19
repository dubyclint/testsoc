<template>
  <div class="escrow-table">
    <h3>📋 Pending Escrow Deals</h3>
    <table>
      <thead>
        <tr>
          <th>Deal ID</th>
          <th>Buyer</th>
          <th>Seller</th>
          <th>Amount (USDC)</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="deal in pendingDeals" :key="deal._id">
          <td>{{ deal.tradeId }}</td>
          <td>{{ deal.buyerId }}</td>
          <td>{{ deal.sellerId }}</td>
          <td>{{ deal.amount }}</td>
          <td>{{ formatDate(deal.timestamp) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pendingDeals = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/escrow/history?status=pending')
  const allDeals = await res.json()
  pendingDeals.value = allDeals.filter(d => !d.isReleased && !d.isRefunded)
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}
</script>

<style scoped>
.escrow-table {
  margin-top: 2rem;
  border: 1px solid #ccc;
  padding: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}
thead {
  background-color: #f5f5f5;
}
</style>
