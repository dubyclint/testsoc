<template>
  <div class="admin-escrow-page">
    <h2>🛡️ Escrow Admin Dashboard</h2>
    <EscrowAdminActions />
  </div>
</template>

<script setup>
import EscrowAdminActions from '@/components/EscrowAdminActions.vue'
</script>

<style scoped>
.admin-escrow-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 2px solid #eee;
  border-radius: 8px;
  background: #fafafa;
}
</style>
