<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup>
// Initialize user store on app start
const userStore = useUserStore();

onMounted(async () => {
  await userStore.initialize();
});
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
