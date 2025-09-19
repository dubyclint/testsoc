<template>
  <div class="admin-verified">
    <h2>🛡️ Verified Badge Requests</h2>
    <VerifiedBadgeAdmin />
  </div>
</template>

<script setup>
import VerifiedBadgeAdmin from '@/components/VerifiedBadgeAdmin.vue'
definePageMeta({ middleware: ['admin-auth'] }) // optional: restrict access
</script>

<style scoped>
.admin-verified {
  padding: 2rem;
}
</style>
