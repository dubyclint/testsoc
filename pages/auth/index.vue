<script setup>
import { ref } from 'vue'

const isSignUp = ref(false) // Toggle between sign up and sign in
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const supabase = useSupabaseClient()

const handleAuth = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (isSignUp.value) {
      // Sign Up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      
      if (signUpError) throw signUpError
      
      if (data.user && !data.user.email_confirmed_at) {
        error.value = 'Please check your email to confirm your account'
      } else {
        await navigateTo('/feed')
      }
    } else {
      // Sign In  
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      
      if (signInError) throw signInError
      await navigateTo('/feed')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  error.value = ''
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>{{ isSignUp ? 'Create Account' : 'Welcome Back' }}</h1>
      <p>{{ isSignUp ? 'Join SocialVerse today' : 'Sign in to your account' }}</p>
      
      <form @submit.prevent="handleAuth" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            required 
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            :placeholder="isSignUp ? 'Create a password' : 'Enter your password'"
            :minlength="isSignUp ? 6 : undefined"
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="auth-button"
        >
          {{ loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In') }}
        </button>
      </form>
      
      <div class="auth-toggle">
        <p>
          {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
          <button @click="toggleMode" type="button" class="toggle-button">
            {{ isSignUp ? 'Sign In' : 'Sign Up' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-form {
  margin: 1.5rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.auth-button {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.auth-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-button {
  color: #3b82f6;
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
}

.error-message {
  color: #dc2626;
  background: #fef2f2;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}
</style>
