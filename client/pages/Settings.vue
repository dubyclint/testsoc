<template>
  <div>
    <h2>{{ t('settings.title') }}</h2>
    <label>{{ t('settings.language') }}</label>
    <select v-model="lang" @change="changeLang">
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="ha">Hausa</option>
      <option value="zh">中文</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loadTranslations, t } from '@/composables/useI18n'

const lang = ref('en')

function changeLang() {
  loadTranslations(lang.value)
}
</script>
