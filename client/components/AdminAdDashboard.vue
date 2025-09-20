<script setup>
const adTypes = ['image', 'video', 'text', 'audio', 'external']
</script>

<!-- Inside template -->
<div v-for="type in adTypes" :key="type">
  <label>
    <input type="checkbox" v-model="page.allowed[type]" />
    {{ type }}
  </label>
</div>

