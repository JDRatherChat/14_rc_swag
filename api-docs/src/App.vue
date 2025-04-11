<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader/AppHeader.vue'
import AppInfo from './components/layout/AppInfo/AppInfo.vue'
import AppMain from './components/layout/AppMain/AppMain.vue'
import AppServers from './components/layout/AppServers/AppServers.vue'

const mainRef = ref(null)
const projectInfo = ref({
  projectName: 'RatherChat API',
  version: '1.0.7',
  oasVersion: '3.1.0',
  description: 'RatherChat API documentation for developers',
  termsOfService: '/tos.md',
  contactEmail: 'dev@rather.chat'
})

const handleSearch = (query) => {
  mainRef.value?.setSearchQuery(query)
}
</script>

<template>
  <div :class="$style.app">
    <AppHeader :onSearch="handleSearch" />
    <AppInfo v-bind="projectInfo" />
    <AppServers />
    <AppMain ref="mainRef" />
  </div>
</template>

<style lang="scss" module>
@use 'sass:color';
@use './assets/styles/index.scss' as *;

.app {
  min-height: 100vh;
  background-color: $background-color;
  color: $text-color;
}

#app {
  background-color: $background-color;
  color: $text-color;
  min-height: 100vh;
  font-family: $font-family-base;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
