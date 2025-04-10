<script setup>
import { ref } from 'vue'
import AppHeader from './components/layout/AppHeader/AppHeader.vue'
import AppMain from './components/layout/AppMain/AppMain.vue'

const mainRef = ref(null)

function handleSearch(query) {
  if (mainRef.value) {
    mainRef.value.setSearchQuery(query)
  }
}
</script>

<template>
  <div :class="$style.app">
    <AppHeader :onSearch="handleSearch" />
    <AppMain ref="mainRef" />
  </div>
</template>

<style lang="scss" module>
@import './assets/styles/index.scss';

.app {
  min-height: 100vh;
  background-color: $background-color;
  color: $text-color;
}
</style>
