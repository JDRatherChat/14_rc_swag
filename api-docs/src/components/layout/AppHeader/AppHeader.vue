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
      <div :class="$style.titleContainer">
        <img src="/rc_white_logo.png" alt="RatherChat Logo" :class="$style.logo" />
        <h1 :class="$style.title">RatherChat API Documentation</h1>
      </div>
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
  grid-area: header;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: $header-height;
  background-color: $background-color;
  border-bottom: 1px solid $border-color;
  z-index: 100;
  display: flex;
  justify-content: center;
}

.container {
  width: 80vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: calc($spacing-xl + 32px + #{$spacing-sm});
  gap: $spacing-md;
}

.titleContainer {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  flex: 1;
}

.logo {
  height: 32px;
  width: auto;
  margin-right: $spacing-sm;
  min-width: 32px;
}

.title {
  font-size: calc($font-size-xl + 6px);
  font-weight: 600;
  color: $text-color;
  margin: 0;
  text-decoration: none;
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
