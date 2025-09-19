<template>
  <div class="escrow-table">
    <h3>📋 Pending Escrow Deals</h3>

    <label>Filter by Buyer:</label>
    <input v-model="filterBuyer" placeholder="Enter buyer address" />

    <table>
      <thead>
        <tr>
          <th @click="sortBy('tradeId')">Deal ID</th>
          <th @click="sortBy('buyerId')">Buyer</th>
          <th @click="sortBy('sellerId')">Seller</th>
          <th @click="sortBy('amount')">Amount</th>
          <th @click="sortBy('timestamp')">Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="deal in sortedFilteredDeals" :key="deal._id">
          <td>{{ deal.tradeId }}</td>
          <td>{{ deal.buyerId }}</td>
          <td>{{ deal.sellerId }}</td>
          <td>{{ deal.amount }}</td>
          <td>{{ formatDate(deal.timestamp) }}</td>
          <td>
            <button @click="release(deal.tradeId)">Release</button>
            <button @click="refund(deal.tradeId)">Refund</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="txHash">✅ Action complete: {{ txHash }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEscrowContract } from '@/composables/useEscrowContract'

const deals = ref([])
const filterBuyer = ref('')
const sortKey = ref('timestamp')
const sortAsc = ref(false)
const txHash = ref('')
const { releaseDeal, refundDeal } = useEscrowContract()

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/escrow/history?status=pending')
  const allDeals = await res.json()
  deals.value = allDeals.filter(d => !d.isReleased && !d.isRefunded)
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const sortedFilteredDeals = computed(() => {
  let filtered = deals.value
  if (filterBuyer.value) {
    filtered = filtered.filter(d => d.buyerId.includes(filterBuyer.value))
  }
  return filtered.sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    return sortAsc.value
      ? valA > valB ? 1 : -1
      : valA < valB ? 1 : -1
  })
})

async function release(id) {
  txHash.value = await releaseDeal(id)
}

async function refund(id) {
  txHash.value = await refundDeal(id)
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
th {
  cursor: pointer;
  background-color: #f5f5f5;
}
th, td {
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}
button {
  margin-right: 0.5rem;
}
</style>

