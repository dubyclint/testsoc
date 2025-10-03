<template>
  <div class="admin-ranks">
    <h2>🏆 Rank Management</h2>
    <p>User rank management will be available here</p>
    <!-- <RankAdminPanel /> -->
  </div>
</template>

<script setup>
// import RankAdminPanel from '~/components/RankAdminPanel.vue'; // Component may not exist
definePageMeta({ middleware: ['admin-auth'] }); // optional: restrict access
</script>

<style scoped>
.admin-ranks {
  padding: 2rem;
}
</style>
