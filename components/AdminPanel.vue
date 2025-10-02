<template>
  <div class="admin-panel">
    <h1>Admin Dashboard</h1>
    <div class="admin-sections">
      <section class="users-section">
        <h2>User Management</h2>
        <p>Manage users, verify badges, handle reports</p>
      </section>
      <section class="content-section">
        <h2>Content Moderation</h2>
        <p>Review posts, manage ads, handle flags</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { gun } from '~/gundb/client'

const users = ref([])
const posts = ref([])

// Admin functionality will be implemented here
</script>

<style scoped>
.admin-panel {
  padding: 2rem;
}
.admin-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
section {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
