<script setup>
import { computed } from 'vue'
import { useOpenApi } from '../../../composables/useOpenApi'

const { getApiInfo } = useOpenApi()
const servers = computed(() => getApiInfo()?.servers || [])
</script>

<template>
  <div v-if="servers.length" :class="$style.container">
    <div :class="$style.serverList">
      <div v-for="server in servers" :key="server.url" :class="$style.server">
        <div :class="$style.description">{{ server.description }}:</div>
        <div :class="$style.url">{{ server.url }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@use 'sass:color';
@use '../../../assets/styles/index.scss' as *;

.container {
  padding: $spacing-lg ($spacing-lg + 50px);
  background-color: rgba($background-color, 0.5);
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  width: 80vw; /* Limit width for better readability */
  min-width: 600px;
}

.serverList {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.server {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.description {
  color: $text-color;
  font-size: $font-size-md;
  font-weight: 500;
}

.url {
  font-family: monospace;
  color: $text-color;
  font-weight: 600;
  padding: $spacing-sm $spacing-md;
  background-color: rgba($text-color, 0.1);
  border-radius: $border-radius-sm;
}
</style>
