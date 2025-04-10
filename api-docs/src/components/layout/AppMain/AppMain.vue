<script setup>
import { ref, computed, watch } from 'vue'

// Sample endpoints data for testing
const endpoints = ref([
  {
    method: 'GET',
    path: '/users',
    description: 'List all users',
    expanded: false,
    responses: [
      {
        status: 200,
        description: 'A list of users',
        example: {
          users: [
            {
              id: "123",
              username: "john_doe",
              email: "john@example.com"
            }
          ],
          total: 50,
          page: 1
        }
      }
    ]
  },
  {
    method: 'POST',
    path: '/users',
    description: 'Create a new user',
    expanded: false,
    responses: [
      {
        status: 201,
        description: 'User created successfully',
        example: {
          id: "123",
          username: "john_doe",
          email: "john@example.com",
          createdAt: "2025-04-10T20:00:00Z"
        }
      }
    ]
  }
])

const searchQuery = ref('')

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
    endpoint.description.toLowerCase().includes(query) ||
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

defineExpose({ setSearchQuery })
</script>

<template>
  <main :class="$style.main">
    <div :class="$style.container">
      <div v-for="endpoint in filteredEndpoints" :key="endpoint.path" :class="$style.endpoint">
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
          <div :class="$style.section">
            <h3 :class="$style.sectionTitle">Responses</h3>
            <div v-for="response in endpoint.responses" :key="response.status" :class="$style.responseExampleContainer">
              <div :class="$style.responseExample">
                <code>{{ JSON.stringify(response.example, null, 2) }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" module>
@import '../../../assets/styles/index.scss';

.main {
  grid-area: main;
  margin-top: $header-height;
  min-height: calc(100vh - $header-height);
  background-color: $background-color;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.container {
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  padding-left: calc($spacing-xl + 32px + #{$spacing-sm}); /* Match AppMain padding */
  width: 80vw;
}

.endpoint {
  position: relative;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  border: 1px solid $border-color;
  margin-left: calc(-32px - #{$spacing-sm}); /* Pull back by logo width */
  width: calc(100% + 32px + #{$spacing-sm}); /* Extend width to compensate for margin */
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
  text-align: left;
  font-weight: 600;
}

.responseExampleContainer {
  width: 100%;
  text-align: left;
}

.responseExample {
  background-color: rgba($text-color, 0.05);
  padding: $spacing-md;
  border-radius: $border-radius-md;
  font-family: monospace;
  font-size: $font-size-sm;
  margin: 0;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  
  code {
    white-space: pre;
    color: $text-color;
    text-align: left;
    display: block;
  }
}
</style>
