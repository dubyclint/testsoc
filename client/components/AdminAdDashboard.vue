<template>
  <div>
    <h3>Ad Control Panel</h3>

    <h4>Ad Types Allowed Per Page</h4>
    <div v-for="page in pages" :key="page.name">
      <strong>{{ page.name }}</strong>
      <div v-for="type in adTypes" :key="type">
        <label>
          <input type="checkbox" v-model="page.allowed[type]" />
          {{ type }}
        </label>
      </div>
    </div>

    <h4>Pricing</h4>
    <div v-for="type in adTypes" :key="type">
      <label>{{ type }} CPM</label>
      <input v-model.number="pricing[type].cpm" type="number" />
      <label>{{ type }} CPC</label>
      <input v-model.number="pricing[type].cpc" type="number" />
      <label>{{ type }} CPA</label>
      <input v-model.number="pricing[type].cpa" type="number" />
    </div>

    <button @click="saveSettings">Save</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const adTypes = ['image', 'video', 'text', 'audio']
const pages = ref([])
const pricing = ref({})

onMounted(async () => {
  const res = await fetch('/api/ads/pricing')
  pricing.value = await res.json()
  const pageRes = await fetch('/api/ads/pages')
  pages.value = await pageRes.json()
})

async function saveSettings() {
  await fetch('/api/ads/pricing', {
    method: 'POST',
    body: JSON.stringify(pricing.value),
    headers: { 'Content-Type': 'application/json' }
  })
  await fetch('/api/ads/pages', {
    method: 'POST',
    body: JSON.stringify(pages.value),
    headers: { 'Content-Type': 'application/json' }
  })
}
</script>
