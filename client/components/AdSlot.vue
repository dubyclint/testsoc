<template>
  <div v-if="shouldRender" class="ad-slot">
    <div v-if="ad.type === 'image'">
      <img :src="ad.mediaUrl" :alt="ad.altText" />
    </div>

    <div v-else-if="ad.type === 'video'">
      <video controls :src="ad.mediaUrl" :poster="ad.thumbnail" />
    </div>

    <div v-else-if="ad.type === 'text'">
      <h4>{{ ad.headline }}</h4>
      <p>{{ ad.description }}</p>
      <button @click="clickAd">{{ ad.cta }}</button>
    </div>

    <div v-else-if="ad.type === 'audio'">
      <audio controls :src="ad.mediaUrl" />
    </div>

    <small class="promoted-label">Promoted</small>
  </div>
</template>

<script setup>
import { useAdStore } from '@/stores/ads'
import { onMounted, ref } from 'vue'

const props = defineProps({ page: String })
const store = useAdStore()
const ad = ref(null)
const shouldRender = ref(false)

onMounted(async () => {
  await store.fetchServedAds()
  const candidates = store.servedAds.filter(a =>
    store.isAdAllowedOnPage(props.page, a.type)
  )
  if (candidates.length > 0) {
    ad.value = candidates[0]
    shouldRender.value = true
    store.trackAd(ad.value.id, 'impression')
  }
})

function clickAd() {
  store.trackAd(ad.value.id, 'click')
  window.open(ad.value.link, '_blank')
}
</script>

<style scoped>
.ad-slot {
  border: 1px solid #ddd;
  padding: 1rem;
  margin: 1rem 0;
  background: #fff;
}
.promoted-label {
  font-size: 0.75rem;
  color: #888;
}
</style>
