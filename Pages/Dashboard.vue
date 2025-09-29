<template>
  <div>
    <Navbar />
    <h2>Welcome back, {{ user.name }}</h2>
    <p>Your personalized feed is loading...</p>
  </div>
</template>

<script setup>
const user = useUser() // composable or store
</script>
