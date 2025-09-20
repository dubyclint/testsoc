<template>
  <div class="chat-layout">
    <ChatWindow />
    <aside class="chat-sidebar">
      <AdSlot page="Chat Sidebar" />
    </aside>
  </div>
</template>

<script setup>
import ChatWindow from '@/components/ChatWindow.vue'
import AdSlot from '@/components/AdSlot.vue'
</script>

<style scoped>
.chat-layout {
  display: flex;
}
.chat-sidebar {
  width: 300px;
  padding-left: 1rem;
}
</style>
