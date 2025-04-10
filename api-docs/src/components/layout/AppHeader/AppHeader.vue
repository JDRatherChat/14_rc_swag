<script setup>
import { ref } from 'vue'

defineProps({
  onSearch: {
    type: Function,
    required: true
  }
})

const searchQuery = ref('')

function handleSearch(event) {
  const query = event.target.value
  searchQuery.value = query
  onSearch(query)
}
</script>

<template>
  <header :class="$style.header">
    <div :class="$style.container">
      <h1 :class="$style.title">API Documentation</h1>
      <a :class="$style.downloadButton" href="/openapi.yaml" download>
        Download Schema
      </a>
      <div :class="$style.search">
        <input
          type="text"
          :class="$style.searchInput"
          placeholder="Search endpoints..."
          :value="searchQuery"
          @input="handleSearch"
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss" module>
@import '../../../assets/styles/index.scss';

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: $header-height;
  background-color: $background-color;
  border-bottom: 1px solid $border-color;
  z-index: 100;
}

.container {
  max-width: $container-max-width;
  height: 100%;
  margin: 0 auto;
  padding: 0 $spacing-xl;
  display: flex;
  align-items: center;
  gap: $spacing-xl;
}

.title {
  font-size: $font-size-xl;
  color: $text-color;
  margin: 0;
  flex: 1;
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

.search {
  width: 200px;
}

.searchInput {
  width: 100%;
  padding: $spacing-xs $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  background-color: rgba($text-color, 0.05);
  color: $text-color;
  font-size: $font-size-sm;
  outline: none;
  transition: all $transition-fast;

  &:focus {
    border-color: $secondary-color;
    background-color: rgba($text-color, 0.1);
  }

  &::placeholder {
    color: rgba($text-color, 0.5);
  }
}
</style>
