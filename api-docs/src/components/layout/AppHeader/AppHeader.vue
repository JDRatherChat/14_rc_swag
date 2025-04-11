<script setup>
import { ref } from 'vue'

const props = defineProps({
  onSearch: {
    type: Function,
    required: true
  }
})

const searchQuery = ref('')

function handleSearch(event) {
  const query = event.target.value
  searchQuery.value = query
  props.onSearch(query)
}

function handleSubmit(event) {
  event.preventDefault()
  props.onSearch(searchQuery.value)
}
</script>

<template>
  <header :class="$style.header">
    <div :class="$style.container">
      <div :class="$style.titleContainer">
        <img src="/rc_white_logo.png" alt="RatherChat Logo" :class="$style.logo" />
        <h1 :class="$style.title">RatherChat API Documentation</h1>
      </div>
      <a :class="[$style.downloadButton, $style.primary]" href="/test.yaml" download>
        Download Schema
      </a>
      <form :class="$style.search" @submit="handleSubmit">
        <input
          type="text"
          :class="$style.searchInput"
          placeholder="Search endpoints, parameters, tags..."
          v-model="searchQuery"
          @input="handleSearch"
        />
      </form>
    </div>
  </header>
</template>

<style lang="scss" module>
@use 'sass:color';
@use '../../../assets/styles/index.scss' as *;

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
    background-color: rgba($text-color, 0.05);
  }

  &.primary {
    background-color: $secondary-color;
    border-color: $primary-color;
    color: white;

    &:hover {
      background-color: color.adjust($secondary-color, $lightness: -20%);
    }
  }
}

.search {
  position: relative;
  width: 300px;
  margin-left: auto;
}

.searchInput {
  width: 100%;
  padding: $spacing-xs $spacing-md;
  font-size: $font-size-sm;
  color: $text-color;
  background-color: rgba($text-color, 0.1);
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba($text-color, 0.5);
  }

  &:focus {
    background-color: rgba($text-color, 0.15);
    border-color: $secondary-color;
  }
}
</style>
