<template>
  <div>
    <h2>Translation Manager</h2>
    <form @submit.prevent="saveTranslation">
      <input v-model="entry.key" placeholder="Key (e.g. support.title)" />
      <select v-model="entry.language">
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="ha">Hausa</option>
        <option value="zh">中文</option>
      </select>
      <input v-model="entry.value" placeholder="Translated text" />
      <button type="submit">Save</button>
    </form>

    <h3>Current Translations</h3>
    <ul>
      <li v-for="t in translations" :key="t.key + t.language">
        {{ t.language }} → {{ t.key }} = {{ t.value }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const entry = ref({ key: '', language: 'en', value: '' })
const translations = ref([])

async function fetchTranslations() {
  const res = await fetch('/api/admin/translations?lang=en')
  translations.value = await res.json()
}

async function saveTranslation() {
  await fetch('/api/admin/translations', {
    method: 'POST',
    body: JSON.stringify(entry.value),
    headers: { 'Content-Type': 'application/json' }
  })
  fetchTranslations()
}

onMounted(fetchTranslations)
</script>
