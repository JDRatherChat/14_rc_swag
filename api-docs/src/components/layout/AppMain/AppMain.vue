<script setup>
import { ref, computed } from 'vue'
import { useOpenApi } from '../../../composables/useOpenApi'

const { loading, error, getEndpoints } = useOpenApi()
const searchQuery = ref('')

const endpoints = computed(() => getEndpoints())

function setSearchQuery(query) {
  searchQuery.value = query
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

const groupEndpointsByTag = computed(() => {
  const groups = {};
  endpoints.value.forEach(endpoint => {
    const tag = endpoint.tags?.[0] || 'Other';
    if (!groups[tag]) {
      groups[tag] = [];
    }
    groups[tag].push(endpoint);
  });
  return groups;
});

const filteredGroups = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const groups = {};

  Object.entries(groupEndpointsByTag.value).forEach(([tag, endpoints]) => {
    const filteredEndpoints = endpoints.filter(endpoint =>
      endpoint.path.toLowerCase().includes(query) ||
      endpoint.description?.toLowerCase().includes(query) ||
      endpoint.method.toLowerCase().includes(query)
    );

    if (filteredEndpoints.length > 0) {
      groups[tag] = filteredEndpoints;
    }
  });

  return groups;
});

const expandedTags = ref(new Set(['Pets', 'Store', 'Users'])); // Start with all tags expanded

const toggleTag = (tag) => {
  if (expandedTags.value.has(tag)) {
    expandedTags.value.delete(tag);
  } else {
    expandedTags.value.add(tag);
  }
};

const isTagExpanded = (tag) => expandedTags.value.has(tag);

const expandedEndpoints = ref({});

const toggleEndpoint = (endpoint) => {
  const key = `${endpoint.method}-${endpoint.path}`;
  if (expandedEndpoints.value[key]) {
    expandedEndpoints.value[key] = false;
  } else {
    expandedEndpoints.value[key] = true;
  }
};

const isEndpointExpanded = (endpoint) => {
  const key = `${endpoint.method}-${endpoint.path}`;
  return expandedEndpoints.value[key] ?? false;
};

const methodColors = {
  GET: '#2196F3',    // Light blue
  POST: '#4CAF50',   // Green
  PUT: '#FF9800',    // Orange
  DELETE: '#F44336', // Red
  PATCH: '#9C27B0'   // Purple
}

const getMethodBackgroundColor = (method) => {
  const color = methodColors[method]
  return color ? `${color}10` : 'transparent' // 10 is hex for 6% opacity
}

const getResponseClass = (status) => {
  const statusCode = parseInt(status)
  if (statusCode >= 200 && statusCode < 300) return '$style.success'
  if (statusCode >= 300 && statusCode < 400) return '$style.redirect'
  if (statusCode >= 400 && statusCode < 500) return '$style.clientError'
  if (statusCode >= 500) return '$style.serverError'
  return ''
}

defineExpose({ setSearchQuery, getMethodBackgroundColor })
</script>

<template>
  <main :class="$style.main">
    <div :class="$style.container">
      <div v-if="loading" :class="$style.loading">Loading endpoints...</div>
      <div v-else-if="error" :class="$style.error">{{ error }}</div>
      <div v-else-if="endpoints.length === 0" :class="$style.empty">No endpoints found</div>
      <template v-else>
        <div v-for="(endpoints, tag) in filteredGroups" :key="tag" :class="$style.tagGroup">
          <div :class="$style.tagHeader" @click="toggleTag(tag)">
            <h2 :class="$style.tagTitle">{{ tag }}</h2>
            <span :class="[$style.tagToggle, { [$style.expanded]: isTagExpanded(tag) }]">▼</span>
          </div>
          <div v-show="isTagExpanded(tag)" :class="$style.tagContent">
            <div
              v-for="endpoint in endpoints"
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
                <button :class="[$style.toggleButton, { [$style.expanded]: isEndpointExpanded(endpoint) }]">
                  ▼
                </button>
              </div>
              <div v-if="isEndpointExpanded(endpoint)" :class="$style.endpointContent">
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
                        <div :class="$style.parameterType">
                          {{ param.in }} - {{ param.schema?.type || param.type }}
                          <span v-if="param.schema?.format">({{ param.schema.format }})</span>
                        </div>
                        <div :class="$style.parameterDescription">{{ param.description }}</div>
                        <div v-if="param.schema?.default" :class="$style.parameterDefault">
                          Default: {{ param.schema.default }}
                        </div>
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
                        <code>{{ JSON.stringify(schema.example, null, 2).trim() }}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <!-- Responses Section -->
                <div v-if="endpoint.responses" :class="$style.section">
                  <h3 :class="$style.sectionTitle">Responses</h3>
                  <div :class="$style.responses">
                    <div v-for="(response, status) in endpoint.responses" :key="status" :class="$style.response">
                      <div :class="[$style.responseHeader, getResponseClass(response.status)]">
                        <div :class="$style.responseStatus">{{ status }}</div>
                        <div :class="$style.responseDescription">{{ response.description }}</div>
                      </div>
                      <div v-if="response.content" :class="$style.responseContent">
                        <div v-for="(schema, contentType) in response.content" :key="contentType">
                          <div :class="$style.contentType">{{ contentType }}</div>
                          <pre v-if="schema.example" :class="$style.example">
                            <code>{{ JSON.stringify(schema.example, null, 2).trim() }}</code>
                          </pre>
                        </div>
                      </div>
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

<style module lang="scss">
@use '../../../assets/styles/index.scss' as *;

.main {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-sm;
}

.container {
  width: 75vw;
  margin: 0 auto;
  padding-left: calc($spacing-xl + 10px + #{$spacing-sm}); /* Match AppHeader padding */
}

.loading {
  text-align: center;
  padding: $spacing-xl;
  color: $text-color;
}

.error {
  text-align: center;
  padding: $spacing-xl;
  color: $accent-color;
}

.empty {
  text-align: center;
  padding: $spacing-xl;
  color: $accent-color;
}

.tagGroup {
  margin-bottom: $spacing-xl;
  text-align: left;
  border-bottom: 1px solid $border-color;
  width: 100%;

  &:last-child {
    border-bottom: none;
  }
}

.tagHeader {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  cursor: pointer;
  padding: $spacing-md;
  border-radius: $border-radius-md;
  transition: background-color $transition-fast;
  width: 100%;

  &:hover {
    background-color: rgba($text-color, 0.05);
  }
}

.tagTitle {
  font-size: $font-size-lg;
  color: $text-color;
  margin: 0;
  font-weight: 600;
  flex: 1;
}

.tagToggle {
  color: $text-color;
  transition: transform $transition-fast;
  font-size: $font-size-md;

  &.expanded {
    transform: rotate(180deg);
  }
}

.tagContent {
  padding: $spacing-md 0;
}

.endpoint {
  position: relative;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-md;
  background-color: white;
  box-shadow: $shadow-sm;
  overflow: hidden;

  &:hover {
    box-shadow: $shadow-md;
  }
}

.endpointHeader {
  padding: $spacing-lg;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-lg;

  &:hover {
    background-color: rgba($text-color, 0.05);
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
  text-transform: uppercase;
  font-size: $font-size-sm;
  min-width: 60px;
  text-align: center;
  flex-shrink: 0;
}

.path {
  color: $text-color;
  font-family: monospace;
  font-size: $font-size-md;
  font-weight: 500;
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
  background-color: white;
  padding: $spacing-xl;
}

.section {
  padding-bottom: $spacing-xl;
  border-bottom: 1px solid $border-color;
  text-align: left;

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
  text-align: left;
}

.parameters {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  text-align: left;
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
  text-align: left;
}

.required {
  color: $accent-color;
  margin-left: 4px;
}

.parameterDetails {
  flex: 1;
  text-align: left;
}

.parameterType {
  font-size: $font-size-sm;
  color: $secondary-color;
  margin-bottom: $spacing-xs;
  text-align: left;
}

.parameterDescription {
  color: rgba($text-color, 0.7);
  font-size: $font-size-sm;
  text-align: left;
}

.parameterDefault {
  color: rgba($text-color, 0.6);
  font-size: $font-size-sm;
  font-style: italic;
  margin-top: $spacing-xs;
}

.responses {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  text-align: left;
}

.response {
  background-color: rgba($text-color, 0.05);
  border-radius: $border-radius-md;
  overflow: hidden;
  text-align: left;
}

.responseHeader {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: rgba($text-color, 0.1);
  text-align: left;
}

.responseStatus {
  font-family: monospace;
  font-weight: 600;
  color: $secondary-color;
  text-align: left;
}

.responseDescription {
  color: rgba($text-color, 0.9);
  font-size: $font-size-sm;
  text-align: left;
}

.responseContent {
  padding: $spacing-md;
  text-align: left;
}

.contentType {
  font-family: monospace;
  font-size: $font-size-sm;
  color: rgba($text-color, 0.7);
  margin-bottom: $spacing-sm;
  text-align: left;
}

.example {
  background-color: rgba($text-color, 0.05);
  padding: $spacing-md;
  border-radius: $border-radius-md;
  font-family: monospace;
  color: $text-color;
  font-size: $font-size-sm;
  margin: 0;
  overflow-x: auto;
  text-align: left;

  code {
    white-space: pre;
    color: inherit;
    text-align: left;
    display: block;
    padding: 0;
  }
}

.success {
  background-color: rgba($secondary-color, 0.1) !important;
  .responseStatus {
    color: $secondary-color !important;
  }
}

.clientError {
  background-color: rgba(#f44336, 0.1) !important;
  .responseStatus {
    color: #f44336 !important;
  }
}

.serverError {
  background-color: rgba(#ff9800, 0.1) !important;
  .responseStatus {
    color: #ff9800 !important;
  }
}

.redirect {
  background-color: rgba(#9c27b0, 0.1) !important;
  .responseStatus {
    color: #9c27b0 !important;
  }
}
</style>
