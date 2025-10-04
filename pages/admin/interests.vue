<template>
  <div class="admin-interests">
    <h1>Manage Interests</h1>
    
    <div class="actions">
      <button @click="showAddForm = true" class="btn-primary">
        Add New Interest
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="showAddForm" class="interest-form">
      <h3>{{ editingInterest ? 'Edit Interest' : 'Add New Interest' }}</h3>
      
      <form @submit.prevent="saveInterest">
        <input 
          v-model="currentInterest.name" 
          placeholder="Interest name" 
          required 
        />
        <textarea 
          v-model="currentInterest.description" 
          placeholder="Description"
          rows="3"
        ></textarea>
        <input 
          v-model="currentInterest.icon" 
          placeholder="Icon (emoji or icon name)"
        />
        <input 
          v-model="currentInterest.sort_order" 
          type="number" 
          placeholder="Sort order"
        />
        
        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editingInterest ? 'Update' : 'Create' }}
          </button>
          <button @click="cancelEdit" type="button" class="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Interests List -->
    <div class="interests-list">
      <div 
        v-for="interest in interests" 
        :key="interest.id"
        class="interest-item"
      >
        <div class="interest-info">
          <span class="icon">{{ interest.icon || '📌' }}</span>
          <div>
            <h4>{{ interest.name }}</h4>
            <p>{{ interest.description }}</p>
            <small>{{ interest.user_count || 0 }} users interested</small>
          </div>
        </div>
        
        <div class="interest-actions">
          <button @click="editInterest(interest)" class="btn-small">
            Edit
          </button>
          <button 
            @click="toggleInterestStatus(interest)" 
            :class="interest.is_active ? 'btn-warning' : 'btn-success'"
            class="btn-small"
          >
            {{ interest.is_active ? 'Deactivate' : 'Activate' }}
          </button>
          <button @click="deleteInterest(interest)" class="btn-danger btn-small">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Admin interface implementation
definePageMeta({
  middleware: 'admin-auth'
})

const interests = ref([])
const showAddForm = ref(false)
const editingInterest = ref(null)
const currentInterest = ref({
  name: '',
  description: '',
  icon: '',
  sort_order: 0
})

// Implementation methods...
</script>
