<template>
  <div class="profile-page">
    <h2>User Profile</h2>
    <p>Profile for user ID: {{ id }}</p>
    <!-- <UserProfile :userId="id" /> -->
    <!-- <AdSlot page="Profile" /> -->
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
// import UserProfile from '~/components/UserProfile.vue'; // Component may not exist
// import AdSlot from '~/components/AdSlot.vue'; // Component may not exist

const route = useRoute();
const id = route.params.id;
</script>

<style scoped>
.profile-page {
  padding: 2rem;
}
</style>
