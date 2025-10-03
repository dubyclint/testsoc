<template>
  <div class="group-page">
    <h2>Group Chat</h2>
    <p>Group ID: {{ groupId }}</p>
    <!-- <GroupChat :groupId="groupId" /> -->
    <!-- <CreateGroup /> -->
    <!-- <AdminPanel /> -->
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
// import GroupChat from '~/components/GroupChat.vue';
// import CreateGroup from '~/components/CreateGroup.vue';
// import AdminPanel from '~/components/AdminPanel.vue';

const route = useRoute();
const groupId = route.params.id as string;
</script>

<style scoped>
.group-page {
  padding: 2rem;
}
</style>
