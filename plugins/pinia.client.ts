import { createPinia } from 'pinia';

export default defineNuxtPlugin(() => {
  const pinia = createPinia();
  return {
    provide: {
      pinia
    }
  };
});
