<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p>&copy; 2024 SocialVerse. All rights reserved.</p>
      <div class="footer-links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/support">Support</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #1f2937;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}
.footer-links {
  display: flex;
  gap: 2rem;
}
.footer-links a {
  color: white;
  text-decoration: none;
}
</style>
