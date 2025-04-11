<script setup>
import { computed } from 'vue'
import { useOpenApi } from '../../../composables/useOpenApi'

const { loading, error, getApiInfo } = useOpenApi()

const apiInfo = computed(() => getApiInfo())

const openTermsOfService = () => {
  window.open('https://rather.chat/terms-conditions/', '_blank')
}

const openPrivacyPolicy = () => {
  window.open('https://rather.chat/privacy-policy/', '_blank')
}

const contactDeveloper = () => {
  if (apiInfo.value?.contact?.email) {
    window.location.href = `mailto:${apiInfo.value.contact.email}`
  } else if (apiInfo.value?.contact?.url) {
    window.open(apiInfo.value.contact.url, '_blank')
  }
}
</script>

<template>
  <section :class="$style.info">
    <div v-if="loading" :class="$style.loading">Loading API information...</div>
    <div v-else-if="error" :class="$style.error">{{ error }}</div>
    <div v-else-if="apiInfo" :class="$style.content">
      <div :class="$style.row">
        <h1 :class="$style.title">{{ apiInfo.title }}</h1>
        <div :class="$style.versions">
          <span :class="$style.version">v{{ apiInfo.version }}</span>
          <span :class="$style.separator">•</span>
          <span :class="$style.version">OAS {{ apiInfo.openApiVersion }}</span>
        </div>
      </div>

      <p v-if="apiInfo.description" :class="$style.description">
        {{ apiInfo.description }}
      </p>

      <div :class="$style.actions">
        <button :class="$style.button" @click="openTermsOfService">Terms of Service</button>
        <button :class="$style.button" @click="openPrivacyPolicy">Privacy Policy</button>
        <button
          v-if="apiInfo.contact"
          :class="[$style.button, $style.primary]"
          @click="contactDeveloper"
        >
          Contact Developer
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" module>
@import '../../../assets/styles/index.scss';

.info {
  grid-area: info;
  padding: $spacing-xl;
  padding-left: calc($spacing-xl + 32px + #{$spacing-sm}); /* Match AppMain padding */
  border-bottom: 1px solid $border-color;
  background-color: lighten($background-color, 2%); /* Slightly lighter than background */
  margin-top: calc($spacing-xl / 2); /* Reduced margin by half */
}

.loading, .error {
  color: $text-color;
  font-size: $font-size-md;
}

.error {
  color: $accent-color;
}

.content {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  margin-top: $spacing-md;
}

.row {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.title {
  font-size: $font-size-xl;
  font-weight: 600;
  color: $text-color;
  margin: 0;
}

.versions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.version {
  font-size: $font-size-sm;
  color: $secondary-color;
  padding: $spacing-xs $spacing-sm;
  background-color: rgba($secondary-color, 0.1);
  border-radius: $border-radius-sm;
}

.separator {
  color: rgba($text-color, 0.3);
}

.description {
  font-size: $font-size-md;
  color: $text-color;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
  text-align: left;
  max-width: 800px; /* Limit width for better readability */
}

.actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-sm;
}

.button {
  padding: $spacing-sm $spacing-lg;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  background-color: transparent;
  color: $text-color;
  font-size: $font-size-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background-color: rgba($text-color, 0.05);
  }

  &.primary {
    background-color: $primary-color;
    border-color: $primary-color;
    color: white;

    &:hover {
      background-color: darken($primary-color, 5%);
    }
  }
}
</style>
