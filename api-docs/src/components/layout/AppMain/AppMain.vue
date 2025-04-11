<script setup>
import { ref, computed } from 'vue'
import { useOpenApi } from '../../../composables/useOpenApi'

const { loading, error, getEndpoints } = useOpenApi()
const searchQuery = ref('')

const endpoints = computed(() => getEndpoints())

function setSearchQuery(query) {
  searchQuery.value = query
}

function toggleEndpoint(endpoint) {
  endpoint.expanded = !endpoint.expanded
}

const filteredEndpoints = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return endpoints.value
  
  return endpoints.value.filter(endpoint => 
    endpoint.path.toLowerCase().includes(query) ||
    endpoint.description?.toLowerCase().includes(query) ||
    endpoint.method.toLowerCase().includes(query)
  )
})

const methodColors = {
  GET: '#4CAF50',
  POST: '#FF9800',
  PUT: '#2196F3',
  DELETE: '#F44336',
  PATCH: '#9C27B0'
}

const getMethodBackgroundColor = (method) => {
  const color = methodColors[method]
  return color ? `${color}10` : 'transparent' // 10 is hex for 6% opacity
}

defineExpose({ setSearchQuery, getMethodBackgroundColor })
</script>

<template>
  <main :class="$style.main">
    <div :class="$style.container">
      <div v-if="loading" :class="$style.loading">Loading API endpoints...</div>
      <div v-else-if="error" :class="$style.error">{{ error }}</div>
      <div v-else-if="endpoints.length === 0" :class="$style.empty">No endpoints found</div>
      <template v-else>
        <div 
          v-for="endpoint in filteredEndpoints" 
          :key="`${endpoint.method}-${endpoint.path}`" 
          :class="$style.endpoint"
          :style="{ backgroundColor: getMethodBackgroundColor(endpoint.method) }"
        >
          <div :class="$style.endpointHeader" @click="toggleEndpoint(endpoint)">
            <div :class="$style.methodPath">
              <span :class="$style.method" :style="{ backgroundColor: methodColors[endpoint.method] }">
                {{ endpoint.method }}
              </span>
              <span :class="$style.path">{{ endpoint.path }}</span>
              <span :class="$style.arrow">→</span>
              <span :class="$style.description">{{ endpoint.description }}</span>
            </div>
            <button :class="[$style.toggleButton, { [$style.expanded]: endpoint.expanded }]">
              ▼
            </button>
          </div>
          <div v-if="endpoint.expanded" :class="$style.endpointContent">
            <!-- Parameters Section -->
            <div v-if="endpoint.parameters?.length" :class="$style.section">
              <h3 :class="$style.sectionTitle">Parameters</h3>
              <div :class="$style.parameters">
                <div v-for="param in endpoint.parameters" :key="param.name" :class="$style.parameter">
                  <div :class="$style.parameterName">
                    {{ param.name }}
                    <span v-if="param.required" :class="$style.required">*</span>
                  </div>
                  <div :class="$style.parameterDetails">
                    <div :class="$style.parameterType">{{ param.schema?.type || param.type }}</div>
                    <div :class="$style.parameterDescription">{{ param.description }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Request Body Section -->
            <div v-if="endpoint.requestBody" :class="$style.section">
              <h3 :class="$style.sectionTitle">Request Body</h3>
              <div v-if="endpoint.requestBody.content" :class="$style.requestBody">
                <div v-for="(schema, contentType) in endpoint.requestBody.content" :key="contentType">
                  <div :class="$style.contentType">{{ contentType }}</div>
                  <pre v-if="schema.example" :class="$style.example">
                    <code>{{ JSON.stringify(schema.example, null, 2) }}</code>
                  </pre>
                </div>
              </div>
            </div>

            <!-- Responses Section -->
            <div v-if="endpoint.responses?.length" :class="$style.section">
              <h3 :class="$style.sectionTitle">Responses</h3>
              <div :class="$style.responses">
                <div v-for="response in endpoint.responses" :key="response.status" :class="$style.response">
                  <div :class="$style.responseHeader">
                    <div :class="$style.responseStatus">{{ response.status }}</div>
                    <div :class="$style.responseDescription">{{ response.description }}</div>
                  </div>
                  <div v-if="response.content" :class="$style.responseContent">
                    <div v-for="(schema, contentType) in response.content" :key="contentType">
                      <div :class="$style.contentType">{{ contentType }}</div>
                      <pre v-if="schema.example" :class="$style.example">
                        <code>{{ JSON.stringify(schema.example, null, 2) }}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<style lang="scss" module>
@import '../../../assets/styles/index.scss';

.main {
  grid-area: main;
  margin-top: $header-height;
  min-height: calc(100vh - $header-height);
  background-color: $background-color; // Back to original color
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.container {
  padding: $spacing-xl;
  padding-top: calc($spacing-xl / 2); // Reduced top padding to match AppInfo margin
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  padding-left: calc($spacing-xl + 32px + #{$spacing-sm}); /* Match AppMain padding */
  width: 80vw;
}

.loading, .error, .empty {
  color: $text-color;
  font-size: $font-size-md;
  text-align: center;
  padding: $spacing-xl;
}

.error {
  color: $accent-color;
}

.endpoint {
  position: relative;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  border: 1px solid $border-color;
  transition: background-color $transition-fast;

  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
}

.endpointHeader {
  padding: $spacing-lg;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
}

.methodPath {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  overflow: hidden;
}

.method {
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  color: white;
  font-weight: 600;
  font-size: $font-size-sm;
  min-width: 60px;
  text-align: center;
  flex-shrink: 0;
}

.path {
  color: $text-color;
  font-family: monospace;
  font-size: $font-size-md;
  flex-shrink: 0;
}

.arrow {
  color: rgba($text-color, 0.5);
  margin: 0 $spacing-sm;
  flex-shrink: 0;
}

.description {
  color: rgba($text-color, 0.7);
  font-size: $font-size-md;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toggleButton {
  background: none;
  border: none;
  color: $text-color;
  padding: $spacing-xs;
  cursor: pointer;
  transition: transform $transition-fast;
  flex-shrink: 0;

  &.expanded {
    transform: rotate(180deg);
  }

  &:hover {
    color: $secondary-color;
  }
}

.endpointContent {
  border-top: 1px solid $border-color;
  padding: $spacing-xl;
}

.section {
  padding-bottom: $spacing-xl;
  border-bottom: 1px solid $border-color;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.sectionTitle {
  font-size: $font-size-lg;
  color: $text-color;
  margin-bottom: $spacing-lg;
  font-weight: 600;
}

.parameters {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.parameter {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-md;
  background-color: rgba($text-color, 0.05);
  border-radius: $border-radius-md;
}

.parameterName {
  flex: 0 0 200px;
  font-family: monospace;
  color: $text-color;
  font-weight: 600;
}

.required {
  color: $accent-color;
  margin-left: 4px;
}

.parameterDetails {
  flex: 1;
}

.parameterType {
  font-size: $font-size-sm;
  color: $secondary-color;
  margin-bottom: $spacing-xs;
}

.parameterDescription {
  color: rgba($text-color, 0.7);
  font-size: $font-size-sm;
}

.responses {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.response {
  background-color: rgba($text-color, 0.05);
  border-radius: $border-radius-md;
  overflow: hidden;
}

.responseHeader {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: rgba($text-color, 0.1);
}

.responseStatus {
  font-family: monospace;
  font-weight: 600;
  color: $secondary-color;
}

.responseDescription {
  color: rgba($text-color, 0.9);
  font-size: $font-size-sm;
}

.responseContent {
  padding: $spacing-md;
}

.contentType {
  font-family: monospace;
  font-size: $font-size-sm;
  color: rgba($text-color, 0.7);
  margin-bottom: $spacing-sm;
}

.example {
  background-color: rgba($text-color, 0.05);
  padding: $spacing-md;
  border-radius: $border-radius-md;
  font-family: monospace;
  font-size: $font-size-sm;
  margin: 0;
  overflow-x: auto;
  
  code {
    white-space: pre;
    color: $text-color;
  }
}
</style>
