<script setup>
defineProps({
  projectName: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  oasVersion: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  termsOfService: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <section :class="$style.info">
    <div :class="$style.container">
      <div :class="$style.metadata">
        <h2 :class="$style.projectName">{{ projectName }}</h2>
        <div :class="$style.versions">
          <span :class="$style.version">Documentation v{{ version }}</span>
          <span :class="$style.separator">•</span>
          <span :class="$style.oasVersion">OpenAPI {{ oasVersion }}</span>
        </div>
      </div>
      
      <div :class="$style.content">
        <p v-if="description" :class="$style.description">{{ description }}</p>
        <div v-if="termsOfService" :class="$style.terms">
          <a :href="termsOfService" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        </div>
      </div>

      <div v-if="contactEmail" :class="$style.contact">
        <a :href="`mailto:${contactEmail}`" :class="$style.contactLink">
          Contact Developer
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" module>
@import '../../../assets/styles/index.scss';

.info {
  background-color: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid $border-color;
  padding: $spacing-xl 0;
  margin-top: $header-height;
  text-align: left;
}

.container {
  width: 80vw;
  margin: 0 auto;
  padding-left: calc($spacing-xl + 32px + #{$spacing-sm}); /* Match AppMain padding */
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
  text-align: left;
}

.metadata {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  text-align: left;
}

.projectName {
  font-size: $font-size-2xl;
  font-weight: 600;
  color: $text-color;
  margin: 0;
  text-align: left;
}

.versions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: rgba($text-color, 0.7);
  font-size: $font-size-sm;
  text-align: left;
}

.separator {
  color: rgba($text-color, 0.3);
}

.content {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  text-align: left;
}

.description {
  color: rgba($text-color, 0.9);
  font-size: $font-size-md;
  line-height: 1.6;
  margin: 0;
  max-width: 800px;
  text-align: left;
}

.terms {
  text-align: left;
  
  a {
    color: $secondary-color;
    text-decoration: none;
    font-size: $font-size-sm;
    text-align: left;

    &:hover {
      text-decoration: underline;
    }
  }
}

.contact {
  margin-top: $spacing-md;
  text-align: left;
}

.contactLink {
  display: inline-block;
  color: $secondary-color;
  text-decoration: none;
  font-size: $font-size-sm;
  padding: $spacing-xs $spacing-sm;
  border: 1px solid $secondary-color;
  border-radius: $border-radius-sm;
  transition: all $transition-fast;
  text-align: left;

  &:hover {
    background-color: rgba($secondary-color, 0.1);
  }
}
</style>
