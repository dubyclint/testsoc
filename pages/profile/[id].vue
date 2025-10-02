<script setup>
import { useRoute } from 'vue-router';
import UserProfile from '@/components/UserProfile.vue';
import AdSlot from '@/components/AdSlot.vue';

const id = useRoute().params.id;
</script>
