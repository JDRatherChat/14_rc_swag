<script setup>
import AppHeader from './components/layout/AppHeader/AppHeader.vue'
import AppMain from './components/layout/AppMain/AppMain.vue'
import { ref } from 'vue'

const mainRef = ref(null)

const handleSearch = (query) => {
  mainRef.value?.onSearch(query)
}
</script>

<template>
  <div class="layout">
    <AppHeader @search="handleSearch" />
    <AppMain ref="mainRef">
      <!-- Main content will be rendered here -->
    </AppMain>
  </div>
</template>

<style lang="scss">
@import './assets/styles/index.scss';

.layout {
  display: grid;
  grid-template-areas:
    "header"
    "main";
  grid-template-columns: 1fr;
  grid-template-rows: $header-height 1fr;
  height: 100vh;
  background-color: $background-color;
}
</style>
