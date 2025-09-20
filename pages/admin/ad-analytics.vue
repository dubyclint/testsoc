<template>
  <AdminAdAnalytics />
</template>

<script setup>
import AdminAdAnalytics from '@/components/AdminAdAnalytics.vue'
definePageMeta({ middleware: ['admin-auth'] })
</script>
