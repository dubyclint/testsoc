<template>
  <div>
    <PostDetail :id="id" />
    <AdSlot page="Post Detail" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PostDetail from '@/components/PostDetail.vue'
import AdSlot from '@/components/AdSlot.vue'

const id = useRoute().params.id
</script>
