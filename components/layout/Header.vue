<template>
  <header class="app-header">
    <nav class="nav-container">
      <NuxtLink to="/" class="logo">SocialVerse</NuxtLink>
      <div class="nav-links">
        <NuxtLink to="/feed">Feed</NuxtLink>
        <NuxtLink to="/explore">Explore</NuxtLink>
        <NuxtLink to="/chat">Chat</NuxtLink>
        <NuxtLink to="/trade">Trade</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
// Header logic here
</script>

<style scoped>
.app-header {
  background: #2563eb;
  color: white;
  padding: 1rem 0;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}
.nav-links {
  display: flex;
  gap: 2rem;
}
.nav-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.2s;
}
.nav-links a:hover {
  opacity: 0.8;
}
</style>
