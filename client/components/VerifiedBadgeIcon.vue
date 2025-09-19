<template>
  <span v-if="verified" class="badge-icon">🛡️</span>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({ userId: String })
const verified = ref(false)

onMounted(async () => {
  const res = await fetch(`/api/verified/status?userId=${props.userId}`)
  const data = await res.json()
  verified.value = data.status === 'approved'
})
</script>

<style scoped>
.badge-icon {
  margin-left: 0.3rem;
  color: #2c7be5;
}
</style>
