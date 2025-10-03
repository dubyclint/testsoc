<template>
  <div class="group-detail">
    <div v-if="loading" class="loading">Loading group...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="group" class="group-content">
      <h1>{{ group.name }}</h1>
      <p>{{ group.description }}</p>
      <!-- Add your group content here -->
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const groupId = route.params.id as string;

const { data: group, pending: loading, error } = await $fetch(`/api/groups/${groupId}`).catch(() => ({
  data: null,
  pending: false,
  error: 'Failed to load group'
}));
</script>

<style scoped>
.group-detail {
  padding: 1rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: red;
}
</style>

