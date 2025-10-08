<template>
  <div class="app-layout">
    <LayoutHeader />
    <main class="main-content">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
// No imports needed - Nuxt auto-imports components
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
}
</style>
