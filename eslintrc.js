// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'semi': ['error', 'always'],
    'vue/multi-word-component-names': 0
  }
};

