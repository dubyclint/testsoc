<template>
  <div class="admin-verified">
    <h2>🛡️ Verified Badge Requests</h2>
    <p>Verified badge management will be available here</p>
    <!-- <VerifiedBadgeAdmin /> -->
  </div>
</template>

<script setup>
// import VerifiedBadgeAdmin from '~/components/VerifiedBadgeAdmin.vue'; // Component may not exist
definePageMeta({ middleware: ['admin-auth'] }); // optional: restrict access
</script>

<style scoped>
.admin-verified {
  padding: 2rem;
}
</style>

