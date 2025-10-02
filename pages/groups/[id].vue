<script setup>
import { useRoute } from '#app';
import GroupChat from '~/components/GroupChat.vue';
import CreateGroup from '~/components/CreateGroup.vue';
import AdminPanel from '~/components/AdminPanel.vue';

const route = useRoute();
const groupId = route.params.id as string;
</script>
