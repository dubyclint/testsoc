<template>
  <div :class="{ mobile: isMobile }">
    <header>
      <h1>SocialVerse</h1>
      <button v-if="isMobile" @click="toggleMenu">☰</button>
    </header>

    <nav v-if="!isMobile || menuOpen">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/support">Support</router-link></li>
        <li><router-link to="/settings">Settings</router-link></li>
      </ul>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { isMobile } from '@/composables/useDevice'

const menuOpen = ref(false)
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>

<style scoped>
.mobile header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mobile nav ul {
  flex-direction: column;
}
nav ul {
  display: flex;
  gap: 1rem;
}
main {
  padding: 1rem;
}
</style>
