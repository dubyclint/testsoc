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
        
        <div v-if="user" class="user-menu">
          <span class="user-email">{{ user.email }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
        <NuxtLink v-else to="/auth" class="auth-link">Sign In</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
const user = useSupabaseUser();
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
};
</script>

<style scoped>
.app-header {
  background: #2563eb;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.9;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.2s;
  padding: 0.5rem 0;
  position: relative;
}

.nav-links a:hover {
  opacity: 0.8;
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: white;
  border-radius: 1px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
}

.user-email {
  font-size: 0.875rem;
  opacity: 0.9;
}

.logout-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.3);
}

.auth-link {
  background: rgba(255,255,255,0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: background 0.2s;
}

.auth-link:hover {
  background: rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-links {
    gap: 1rem;
    font-size: 0.875rem;
  }
  
  .user-email {
    display: none;
  }
}
</style>
