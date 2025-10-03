// Only export components that actually exist
export { default as AuthForm } from './AuthForm.vue';
export { default as CreatePost } from './CreatePost.vue';
export { default as FeedPosts } from './FeedPosts.vue';

// Conditional exports - only if files exist
try {
  export { default as EditProfile } from './EditProfile.vue';
} catch {}

try {
  export { default as GroupChat } from './GroupChat.vue';
} catch {}

try {
  export { default as CreateGroup } from './CreateGroup.vue';
} catch {}

try {
  export { default as AdminPanel } from './AdminPanel.vue';
} catch {}
