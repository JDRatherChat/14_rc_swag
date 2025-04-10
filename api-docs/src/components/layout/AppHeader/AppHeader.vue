<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const emit = defineEmits(['search'])

const onSearch = (e) => {
  emit('search', searchQuery.value)
}

const downloadSchema = () => {
  // Add download functionality here
  console.log('Downloading schema...')
}
</script>

<template>
  <header :class="$style.header">
    <div :class="$style.container">
      <div :class="$style.leftSection">
        <img src="/rc_white_logo.png" alt="RatherChat Logo" :class="$style.logoImage" />
        <span :class="$style.logoText">API Documentation</span>
      </div>
      <div :class="$style.rightSection">
        <a :class="$style.downloadButton" @click="downloadSchema" href="#">
          Download Schema
        </a>
        <div :class="$style.search">
          <input 
            type="text" 
            :class="$style.searchInput" 
            placeholder="Search endpoints..."
            v-model="searchQuery"
            @input="onSearch"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" module>
@import '../../../assets/styles/index.scss';

.header {
  grid-area: header;
  height: $header-height;
  background-color: rgba($background-color, 0.95);
  border-bottom: 1px solid $border-color;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-index-header;
  backdrop-filter: blur(8px);
}

.container {
  @include flex-between;
  height: 100%;
  padding: 0 $spacing-md;
  max-width: $container-max-width;
  margin: 0 auto;
}

.leftSection {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.rightSection {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.logoImage {
  height: 30px;
  width: auto;
}

.logoText {
  color: $text-color;
  font-size: $font-size-2xl;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.search {
  position: relative;
  width: 200px;
}

.searchInput {
  width: 100%;
  padding: $spacing-xs $spacing-sm;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  background-color: rgba(255, 255, 255, 0.1);
  color: $text-color;
  font-size: $font-size-sm;

  &::placeholder {
    color: rgba($text-color, 0.6);
  }

  &:focus {
    outline: none;
    border-color: $secondary-color;
    background-color: rgba(255, 255, 255, 0.15);
  }
}

.downloadButton {
  background-color: $secondary-color;
  color: white;
  text-decoration: none;
  padding: $spacing-xs $spacing-md;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background-color: lighten($secondary-color, 10%);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}
</style>
