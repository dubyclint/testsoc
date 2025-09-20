<template>
  <div v-if="shouldRender" class="ad-slot">
    <component :is="renderComponent" />
    <small class="promoted-label">Promoted</small>
  </div>
</template>

<script setup>
import { useAdStore } from '@/stores/ads'
import { onMounted, ref, h } from 'vue'

const props = defineProps({ page: String })
const store = useAdStore()
const ad = ref(null)
const shouldRender = ref(false)
const renderComponent = ref(null)

onMounted(async () => {
  await store.fetchServedAds(props.page)
  const candidates = store.servedAds.filter(a =>
    store.isAdAllowedOnPage(props.page, a.type)
  )

  if (candidates.length > 0) {
    ad.value = candidates[0]
    shouldRender.value = true

    if (ad.value.type === 'external') {
      try {
        renderComponent.value = {
          render: () => h('div', { innerHTML: ad.value.html })
        }
      } catch {
        fallbackToInternal()
      }
    } else {
      fallbackToInternal()
    }

    if (ad.value.type !== 'external') {
      store.trackAd(ad.value.id, 'impression')
    }
  }
})

function fallbackToInternal() {
  const internal = store.servedAds.find(a => a.type !== 'external')
  if (internal) {
    ad.value = internal
    renderComponent.value = {
      render: () => h('div', {}, [
        internal.type === 'image' ? h('img', { src: internal.mediaUrl, alt: internal.altText }) :
        internal.type === 'video' ? h('video', { controls: true, src: internal.mediaUrl }) :
        internal.type === 'text' ? h('div', {}, [
          h('h4', internal.headline),
          h('p', internal.description),
          h('button', { onClick: clickAd }, internal.cta)
        ]) :
        internal.type === 'audio' ? h('audio', { controls: true, src: internal.mediaUrl }) :
        null
      ])
    }
  }
}

function clickAd() {
  store.trackAd(ad.value.id, 'click')
  window.open(ad.value.link, '_blank')
}
</script>

