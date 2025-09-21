<template>
  <div>
    <h2>Contact Support</h2>
    <ul>
      <li v-for="c in contacts" :key="c.label">
        <strong>{{ c.label }}</strong> ({{ c.type }}) → {{ c.value }}
        <span v-if="c.region">[{{ c.region }}]</span>
      </li>
    </ul>

    <div v-if="isAdmin">
      <h3>Edit Support Contacts</h3>
      <form @submit.prevent="saveContacts">
        <div v-for="(c, index) in editContacts" :key="index" class="contact-block">
          <input v-model="c.label" placeholder="Label" />
          <input v-model="c.value" placeholder="Value" />
          <select v-model="c.type">
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="other">Other</option>
          </select>
          <input v-model="c.region" placeholder="Region (optional)" />
        </div>
        <button @click="addContact">Add Contact</button>
        <button type="submit">Save All</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const contacts = ref([])
const editContacts = ref([])
const isAdmin = true // Replace with actual role check

async function fetchContacts() {
  const res = await fetch('/api/admin/support')
  contacts.value = await res.json()
  editContacts.value = JSON.parse(JSON.stringify(contacts.value))
}

function addContact() {
  editContacts.value.push({
    label: '',
    value: '',
    type: 'email',
    region: ''
  })
}

async function saveContacts() {
  await fetch('/api/admin/support', {
    method: 'POST',
    body: JSON.stringify(editContacts.value),
    headers: { 'Content-Type': 'application/json' }
  })
  fetchContacts()
}

onMounted(fetchContacts)
</script>

<style scoped>
.contact-block {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}
</style>
