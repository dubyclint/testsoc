<template>
  <div class="group-chat" v-if="!userProfile.chatDisabled">
    <div class="header">
      <h2>{{ groupMeta?.name || groupId }}</h2>
      <span v-if="groupMeta?.blocked" class="badge blocked">Blocked</span>
      <span v-if="groupMeta?.deleted" class="badge deleted">Deleted</span>
    </div>

    <div class="admin-tools" v-if="isOwner && !groupMeta?.deleted">
      <form @submit.prevent="inviteMember" class="invite-form">
        <input v-model="inviteUserId" placeholder="Invite user ID" />
        <button type="submit">Invite</button>
      </form>
      <div class="members">
        <h4>Members</h4>
        <ul>
          <li v-for="m in members" :key="m">
            {{ m }}
            <button class="remove" @click="removeMember(m)" :disabled="m === ownerId">Remove</button>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="groupMeta?.deleted" class="notice">This group has been deleted.</div>
    <div v-else-if="groupMeta?.blocked" class="notice">This group is blocked by admin.</div>
    <div v-else>
      <ul class="messages">
        <li v-for="msg in messages" :key="msg.id">
          <img v-if="msg.avatar" :src="msg.avatar" class="avatar" />
          <div class="bubble">
            <div class="meta">
              <strong>{{ msg.from }}</strong>
              <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
            </div>
            <div class="content" v-html="renderContent(msg.text)"></div>
          </div>
        </li>
      </ul>

      <form @submit.prevent="sendMessage" class="send-form">
        <textarea v-model="draft" placeholder="Type a message..." />
        <button type="submit" :disabled="sending">Send</button>
      </form>
    </div>
  </div>

  <div v-else class="notice">Your chat privileges have been disabled by an admin.</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuth } from '#imports';
import MarkdownIt from 'markdown-it';
import emojione from 'emojione';
import { gun, sea, ensureUserPair, getUserPub } from '~/gundb/client';

const md = new MarkdownIt({ breaks: true, linkify: true });

// ✅ Fixed: must call defineProps as a function
const props = defineProps<{ groupId: string }>();
const groupId = props.groupId;

const { data: session } = useAuth();
const currentUser = session.value?.user?.id;
const isAdmin = computed(() => session.value?.user?.role === 'admin');

const ownerId = ref<string | null>(null);
const groupMeta = ref<any>(null);
const userProfile = ref<any>({});
const members = ref<string[]>([]);
const messages = ref<any[]>([]);
const draft = ref('');
const sending = ref(false);

const inviteUserId = ref('');
const isOwner = computed(() => currentUser && ownerId.value === currentUser);

function formatTime(ts: number) {
  return new Date(ts).toLocaleString();
}

function renderContent(text: string) {
  const html = md.render(text || '');
  return emojione.shortnameToImage(html);
}

// … rest of logic unchanged …
</script>

<style scoped>
/* styles unchanged */
</style>
