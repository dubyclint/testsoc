<template>
  <div class="group-page">
    <CreateGroup />
    <GroupChat :groupId="groupId" />
    <AdminPanel />
  </div>
</template>

<script setup>
import { useRoute } from '#app'
import GroupChat from '~/components/GroupChat.vue'
import CreateGroup from '~/components/CreateGroup.vue'
import AdminPanel from '~/components/AdminPanel.vue'

const route = useRoute()
const groupId = route.params.id as string
</script>

<style scoped>
.group-page {
  display: grid;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}
</style>
