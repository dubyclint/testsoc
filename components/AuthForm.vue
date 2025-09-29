<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-if="needsPassword" v-model="password" type="password" placeholder="Password" required />
    <button type="submit">{{ buttonLabel }}</button>
    <p v-if="mode === 'signin'"><NuxtLink to="/recover">Forgot Password?</NuxtLink></p>
  </form>
</template>

<script setup>
const props = defineProps({ mode: String })
const email = ref('')
const password = ref('')
const needsPassword = ['signup', 'signin', 'admin'].includes(props.mode)
const buttonLabel = {
  signup: 'Create Account',
  signin: 'Sign In',
  recover: 'Send Recovery Link',
  admin: 'Admin Login'
}[props.mode]

function handleSubmit() {
  // Call backend route based on mode
}
</script>
