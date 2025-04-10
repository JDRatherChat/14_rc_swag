<script setup>
import { ref } from 'vue'
import AppHeader from './components/layout/AppHeader/AppHeader.vue'
import AppInfo from './components/layout/AppInfo/AppInfo.vue'
import AppMain from './components/layout/AppMain/AppMain.vue'
import { info } from './components/layout/AppInfo/AppInfo.vue'

const mainRef = ref(null)

function handleSearch(query) {
  if (mainRef.value) {
    mainRef.value.setSearchQuery(query)
  }
}

// These values would typically come from your OpenAPI spec
const projectInfo = {
  projectName: 'Example Petstore',
  version: '1.0.7',
  oasVersion: '3.1.1',
  description: 'This is a sample server Pet store.',
  termsOfService: 'path/to/md/file',
  contactEmail: 'dev@rather.chat'
}

const infoData = info
</script>

<template>
  <div :class="$style.app">
    <AppHeader :onSearch="handleSearch" />
    <AppInfo v-bind="projectInfo" />
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
