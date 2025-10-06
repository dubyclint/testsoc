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
            :disabled="loading"
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
            :disabled="loading"
            minlength="6"
          />
        </div>
        
        <button type="submit" :disabled="loading" class="auth-button">
          {{ loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In') }}
        </button>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
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

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'default'
});

const { login, signup } = useAuth();

const isSignUp = ref(false);
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleAuth = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }
  
  loading.value = true;
  error.value = '';
  success.value = '';
  
  try {
    let result;
    
    if (isSignUp.value) {
      result = await signup(email.value, password.value);
      
      if (result.success) {
        if (result.needsConfirmation) {
          success.value = 'Please check your email to confirm your account';
        } else {
          success.value = 'Account created successfully!';
          setTimeout(() => navigateTo('/feed'), 1500);
        }
      }
    } else {
      result = await login(email.value, password.value);
      
      if (result.success) {
        success.value = 'Signed in successfully!';
        setTimeout(() => navigateTo('/feed'), 1000);
      }
    }
    
    if (!result.success) {
      error.value = result.error || 'Authentication failed';
    }
    
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};

const toggleMode = () => {
  isSignUp.value = !isSignUp.value;
  error.value = '';
  success.value = '';
  email.value = '';
  password.value = '';
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.75rem;
}

.auth-card p {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.auth-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #fcc;
  text-align: center;
  font-size: 0.875rem;
}

.success-message {
  background: #efe;
  color: #393;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #cfc;
  text-align: center;
  font-size: 0.875rem;
}

.auth-toggle {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e5e9;
}

.auth-toggle p {
  margin: 0;
  color: #666;
}

.toggle-button {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  margin-left: 0.25rem;
}

.toggle-button:hover {
  color: #5a67d8;
}
</style>
