<script setup>
import { ref, computed } from 'vue'
import { useOpenApi } from '../../../composables/useOpenApi'

const { loading, error, getEndpoints, apiSpec } = useOpenApi()
const searchQuery = ref('')

const endpoints = computed(() => getEndpoints())

function setSearchQuery(query) {
  searchQuery.value = query
}

const tagDescriptions = computed(() => {
  const descriptions = {};
  apiSpec.value?.tags?.forEach(tag => {
    descriptions[tag.name.toLowerCase()] = tag.description;
  });
  return descriptions;
});

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
      groups[tag] = {
        endpoints: [],
        description: tagDescriptions.value[tag.toLowerCase()]
      };
    }
    groups[tag].endpoints.push(endpoint);
  });
  return groups;
});

const filteredGroups = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const groups = {};

  Object.entries(groupEndpointsByTag.value).forEach(([tag, group]) => {
    const filteredEndpoints = group.endpoints.filter(endpoint =>
      endpoint.path.toLowerCase().includes(query) ||
      endpoint.description?.toLowerCase().includes(query) ||
      endpoint.method.toLowerCase().includes(query)
    );

    if (filteredEndpoints.length > 0) {
      groups[tag] = {
        endpoints: filteredEndpoints,
        description: group.description
      };
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
  return color ? `${color}20` : 'transparent' // 10 is hex for 6% opacity
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
        <div v-for="(group, tag) in filteredGroups" :key="tag" :class="$style.tagGroup">
          <div :class="$style.tagHeader" @click="toggleTag(tag)">
            <div :class="$style.tagTitleWrapper">
              <h2 :class="$style.tagTitle">{{ tag }}</h2>
              <span v-if="group.description" :class="$style.tagDescription">
                - {{ group.description }}
              </span>
            </div>
            <span :class="[$style.tagToggle, { [$style.expanded]: isTagExpanded(tag) }]">▼</span>
          </div>
          <div v-show="isTagExpanded(tag)" :class="$style.tagContent">
            <div
              v-for="endpoint in group.endpoints"
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
                    <div :class="$style.parameterHeaders">
                      <h5 :class="$style.sectionName">Name</h5>
                      <h5 :class="$style.sectionType">Type</h5>
                      <h5 :class="$style.sectionDetail">Description</h5>
                    </div>
                    <div v-for="param in endpoint.parameters" :key="param.name" :class="$style.parameter">
                      <div :class="$style.parameterName">
                        {{ param.name }}
                        <span v-if="param.required" :class="$style.required">*</span>
                      </div>
                      <div :class="$style.parameterType">
                        {{ param.schema?.type || param.type }}
                        <span v-if="param.schema?.format">({{ param.schema.format }})</span>
                        <span :class="$style.parameterLocation">({{ param.in }})</span>
                      </div>
                      <div :class="$style.parameterDetails">
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
@use 'sass:color';
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

.tagTitleWrapper {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
}

.tagTitle {
  font-size: $font-size-lg;
  color: $text-color;
  margin: 0;
  font-weight: 600;
}

.tagDescription {
  font-size: $font-size-sm;
  color: rgba($text-color, 0.6);
  font-weight: normal;
  font-style: italic;
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
  background-color: rgba($text-color, 0.05);
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
  background-color: rgba($primary-color, 0.02);
  padding: $spacing-xl;
}

.section {
  margin-bottom: $spacing-xl;
  padding: $spacing-lg;
  background-color: color.adjust($background-color, $lightness: 5%);
  border-radius: $border-radius-md;
  box-shadow: $shadow-sm;

  &:last-child {
    margin-bottom: 0;
  }
}

.sectionTitle {
  font-size: $font-size-lg;
  color: $text-color;
  margin-bottom: $spacing-lg;
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid $border-color;
  padding-bottom: $spacing-sm;
}

.sectionName {
  font-weight: 600;
  color: $text-color;
  margin: 0;
  font-size: $font-size-sm;
}

.sectionType {
  font-weight: 600;
  color: $text-color;
  margin: 0;
  font-size: $font-size-sm;
}

.sectionDetail {
  font-weight: 500;
  margin: 0;
  font-size: $font-size-sm;
}

.parameters {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.parameterHeaders {
  display: grid;
  grid-template-columns: 200px 180px 1fr;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-md;
  border-bottom: 1px solid $border-color;
}

.parameter {
  display: grid;
  grid-template-columns: 200px 180px 1fr;
  gap: $spacing-md;
  padding: $spacing-md;
  border-radius: $border-radius-sm;
  background-color: rgba($text-color, 0.02);

  &:hover {
    background-color: rgba($text-color, 0.05);
  }
}

.parameterName {
  font-family: monospace;
  font-weight: 500;
  color: $text-color;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.required {
  color: $accent-color;
  font-weight: bold;
}

.parameterType {
  font-family: monospace;
  font-size: $font-size-sm;
  color: $secondary-color;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.parameterLocation {
  color: rgba($text-color, 0.7);
}

.parameterDetails {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.parameterDescription {
  color: rgba($text-color, 0.8);
  font-size: $font-size-sm;
}

.parameterDefault {
  font-family: monospace;
  font-size: $font-size-sm;
  color: rgba($text-color, 0.6);
}

.contentType {
  font-family: monospace;
  font-size: $font-size-sm;
  color: $secondary-color;
  margin-bottom: $spacing-sm;
}

.example {
  background-color: rgba($text-color, 0.05);
  padding: $spacing-md;
  border-radius: $border-radius-md;
  font-family: monospace;
  font-size: $font-size-sm;
  color: $text-color;
  overflow-x: auto;
  white-space: pre-wrap;
}

.responses {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.response {
  border-radius: $border-radius-md;
  overflow: hidden;
  background-color: rgba($text-color, 0.02);
}

.responseHeader {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: rgba($text-color, 0.05);
}

.responseStatus {
  font-family: monospace;
  font-weight: 500;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  background-color: rgba($text-color, 0.1);
}

.responseDescription {
  color: rgba($text-color, 0.8);
  font-size: $font-size-sm;
}

.responseContent {
  padding: $spacing-md;
}

.success .responseStatus {
  background-color: rgba($secondary-color, 0.2);
  color: $secondary-color;
}

.redirect .responseStatus {
  background-color: rgba($warning-color, 0.2);
  color: $warning-color;
}

.clientError .responseStatus {
  background-color: rgba($accent-color, 0.2);
  color: $accent-color;
}

.serverError .responseStatus {
  background-color: rgba($error-color, 0.2);
  color: $error-color;
}
</style>
