<script setup>
// Redirect to current user's profile or show profile selection
const { data: user } = await useSupabaseUser()

if (user.value) {
  // Redirect to user's own profile
  await navigateTo(`/profile/${user.value.id}`)
} else {
  // Redirect to auth if not logged in
  await navigateTo('/auth')
}
</script>

<template>
  <div>
    <p>Redirecting to your profile...</p>
  </div>
</template>
