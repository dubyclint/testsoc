<script setup>
import VerifiedBadgeAdmin from '@/components/VerifiedBadgeAdmin.vue';
definePageMeta({ middleware: ['admin-auth'] }); // optional: restrict access
</script>
