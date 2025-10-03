<template>
  <div class="home-page">
    <header class="header">
      <h1>Welcome to Socialverse</h1>
      <nav class="nav">
        <NuxtLink to="/feed" class="nav-link">Feed</NuxtLink>
        <NuxtLink to="/profile" class="nav-link">Profile</NuxtLink>
        <NuxtLink to="/explore" class="nav-link">Explore</NuxtLink>
      </nav>
    </header>
    
    <main class="main-content">
      <section class="hero">
        <h2>Connect, Share, and Discover</h2>
        <p>Your decentralized social platform</p>
        <NuxtLink to="/feed" class="cta-button">Get Started</NuxtLink>
      </section>
    </main>
  </div>
</template>

<script setup>
// Set page meta
useHead({
  title: 'Socialverse - Decentralized Social Platform',
  meta: [
    { name: 'description', content: 'Connect, share, and discover on the decentralized social web' }
  ]
});
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  border-bottom: 1px solid #e1e5e9;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #007bff;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #f8f9fa;
}

.main-content {
  padding: 4rem 0;
}

.hero {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.hero h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: background-color 0.2s;
}

.cta-button:hover {
  background-color: #0056b3;
}
</style>

