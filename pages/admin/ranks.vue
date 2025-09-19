<template>
  <div class="admin-ranks">
    <RankAdminPanel />
  </div>
</template>

<script setup>
import RankAdminPanel from '@/components/RankAdminPanel.vue'
definePageMeta({ middleware: ['admin-auth'] })
</script>
