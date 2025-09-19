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
            <button @click="confirmAction('release', deal.tradeId)">Release</button>
            <button @click="confirmAction('refund', deal.tradeId)">Refund</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h4>Confirm {{ actionType }} Deal</h4>
        <p>Are you sure you want to {{ actionType }} deal #{{ selectedDealId }}?</p>
        <button @click="executeAction">Yes, Confirm</button>
        <button @click="cancelAction">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEscrowContract } from '@/composables/useEscrowContract'
import { useToast } from 'vue-toastification'

const deals = ref([])
const filterBuyer = ref('')
const sortKey = ref('timestamp')
const sortAsc = ref(false)
const showModal = ref(false)
const selectedDealId = ref(null)
const actionType = ref('')
const toast = useToast()
const { releaseDeal, refundDeal } = useEscrowContract()

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/escrow/history?status=pending')
    const allDeals = await res.json()
    deals.value = allDeals.filter(d => !d.isReleased && !d.isRefunded)
  } catch (err) {
    toast.error(`Failed to load deals: ${err.message}`)
  }
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

function confirmAction(type, id) {
  actionType.value = type
  selectedDealId.value = id
  showModal.value = true
}

function cancelAction() {
  showModal.value = false
  selectedDealId.value = null
  actionType.value = ''
}

async function executeAction() {
  try {
    if (actionType.value === 'release') {
      await releaseDeal(selectedDealId.value)
      toast.success(`✅ Deal #${selectedDealId.value} released`)
    } else if (actionType.value === 'refund') {
      await refundDeal(selectedDealId.value)
      toast.success(`✅ Deal #${selectedDealId.value} refunded`)
    }
  } catch (err) {
    toast.error(`❌ Failed to ${actionType.value} deal: ${err.message}`)
  }
  cancelAction()
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}
</style>



