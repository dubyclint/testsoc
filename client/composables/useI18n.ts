import { ref } from 'vue'

const currentLang = ref('en')
const translations = ref({})

export async function loadTranslations(lang: string) {
  const res = await fetch(`/api/admin/translations?lang=${lang}`)
  const entries = await res.json()
  translations.value = Object.fromEntries(entries.map(e => [e.key, e.value]))
  currentLang.value = lang
}

export function t(key: string) {
  return translations.value[key] || key
}
