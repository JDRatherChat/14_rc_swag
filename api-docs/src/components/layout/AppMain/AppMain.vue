<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const expandedEndpoints = ref(new Set())

const endpoints = [
  {
    id: 'list-users',
    method: 'GET',
    path: '/api/v1/users',
    description: 'Returns a list of users with pagination support.',
    parameters: [
      { name: 'page', type: 'integer', required: false, description: 'Page number for pagination' },
      { name: 'limit', type: 'integer', required: false, description: 'Number of items per page' },
      { name: 'sort', type: 'string', required: false, description: 'Sort field (e.g., name, created_at)' }
    ],
    responses: [
      { 
        code: '200', 
        description: 'Returns array of users', 
        type: 'success',
        example: {
          users: [
            {
              id: "123",
              name: "John Doe",
              email: "john@example.com"
            }
          ],
          pagination: {
            total: 50,
            page: 1,
            limit: 10
          }
        }
      },
      { 
        code: '400', 
        description: 'Bad Request', 
        type: 'error',
        example: {
          error: "Invalid parameters",
          details: "Page number must be positive"
        }
      },
      { 
        code: '401', 
        description: 'Unauthorized', 
        type: 'error',
        example: {
          error: "Authentication required",
          details: "Please provide valid credentials"
        }
      }
    ]
  },
  {
    id: 'get-user',
    name: 'Get User',
    method: 'GET',
    path: '/api/v1/users/{id}',
    description: 'Returns a specific user by their ID.',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'The unique identifier of the user' }
    ],
    responses: [
      { code: '200', description: 'Success - Returns user object', type: 'success', example: { data: {} } },
      { code: '404', description: 'User not found', type: 'error' },
      { code: '401', description: 'Unauthorized', type: 'error' }
    ]
  }
]

const filteredEndpoints = computed(() => {
  if (!searchQuery.value) return endpoints
  const query = searchQuery.value.toLowerCase()
  return endpoints.filter(endpoint => 
    endpoint.path.toLowerCase().includes(query) ||
    endpoint.description.toLowerCase().includes(query) ||
    endpoint.method.toLowerCase().includes(query) ||
    endpoint.name?.toLowerCase().includes(query)
  )
})

function toggleEndpoint(id) {
  const newSet = new Set(expandedEndpoints.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  } else {
    newSet.add(id)
  }
  expandedEndpoints.value = newSet
}

function isExpanded(id) {
  return expandedEndpoints.value.has(id)
}

function getMethodColor(method) {
  const colors = {
    GET: '#4CAF50',
    POST: '#FF9800',
    PUT: '#2196F3',
    DELETE: '#F44336',
    PATCH: '#9C27B0'
  }
  return colors[method] || '#757575'
}

defineExpose({
  setSearchQuery: (query) => {
    searchQuery.value = query
  }
})
</script>

<template>
  <main :class="$style.main">
    <div :class="$style.container">
      <div v-for="endpoint in filteredEndpoints" :key="endpoint.id" :class="$style.endpoint">
        <header 
          :class="$style.endpointHeader"
          :style="{ backgroundColor: `${getMethodColor(endpoint.method)}10` }"
          @click="toggleEndpoint(endpoint.id)"
        >
          <div :class="$style.endpointHeaderContent">
            <div :class="$style.methodPath">
              <div 
                :class="$style.method"
                :style="{ backgroundColor: getMethodColor(endpoint.method) }"
              >
                {{ endpoint.method }}
              </div>
              <code :class="$style.path">{{ endpoint.path }}</code>
              <span :class="$style.arrow">→</span>
              <span :class="$style.description">{{ endpoint.description }}</span>
            </div>
          </div>
          <button :class="[$style.toggleButton, { [$style.expanded]: isExpanded(endpoint.id) }]">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </header>

        <div v-if="isExpanded(endpoint.id)" :class="$style.endpointContent">
          <section :class="$style.section">
            <h2 :class="$style.sectionTitle">Parameters</h2>
            <div :class="$style.table">
              <div :class="$style.tableHeader">
                <div :class="$style.tableCell">Name</div>
                <div :class="$style.tableCell">Type</div>
                <div :class="$style.tableCell">Required</div>
                <div :class="$style.tableCell">Description</div>
              </div>
              <div v-for="param in endpoint.parameters" :key="param.name" :class="$style.tableRow">
                <div :class="$style.tableCell"><code>{{ param.name }}</code></div>
                <div :class="$style.tableCell">{{ param.type }}</div>
                <div :class="$style.tableCell">{{ param.required ? 'Yes' : 'No' }}</div>
                <div :class="$style.tableCell">{{ param.description }}</div>
              </div>
            </div>
          </section>

          <section :class="$style.section">
            <h2 :class="$style.sectionTitle">Response</h2>
            <div :class="$style.responses">
              <div 
                v-for="response in endpoint.responses" 
                :key="response.code" 
                :class="$style.response"
              >
                <div :class="$style.responseHeader">
                  <div :class="[$style.responseCode, response.type === 'success' ? $style.success : $style.error]">
                    {{ response.code }}
                  </div>
                  <div :class="$style.responseTitle">
                    {{ response.description }}
                  </div>
                </div>
                <div v-if="response.example" :class="$style.responseExampleContainer">
                  <pre :class="$style.responseExample"><code>{{ JSON.stringify(response.example, null, 2) }}</code></pre>
                </div>
              </div>
            </div>
          </section>
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
}

.container {
  padding: $spacing-xl;
  max-width: $container-max-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.endpoint {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  border: 1px solid $border-color;
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

.endpointHeaderContent {
  flex: 1;
  min-width: 0;
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
}

.section {
  padding: $spacing-xl;
  border-bottom: 1px solid $border-color;

  &:last-child {
    border-bottom: none;
  }
}

.sectionTitle {
  font-size: $font-size-lg;
  color: $text-color;
  margin-bottom: $spacing-lg;
  text-align: left;
  font-weight: 600;
}

.table {
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  overflow: hidden;
  width: 100%;
}

.tableHeader {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  background-color: rgba($text-color, 0.05);
  border-bottom: 1px solid $border-color;
  text-align: left;
}

.tableRow {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  border-bottom: 1px solid $border-color;

  &:last-child {
    border-bottom: none;
  }
}

.tableCell {
  padding: $spacing-md;
  color: $text-color;
  text-align: left;

  code {
    background-color: rgba($text-color, 0.1);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
  }
}

.responses {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.response {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.responseHeader {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.responseCode {
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  font-family: monospace;
  font-weight: 600;
  min-width: 48px;
  text-align: center;

  &.success {
    background-color: rgba($secondary-color, 0.1);
    color: $secondary-color;
  }

  &.error {
    background-color: rgba($accent-color, 0.1);
    color: $accent-color;
  }
}

.responseTitle {
  color: $text-color;
  font-weight: 500;
}

.responseExampleContainer {
  padding-left: calc($spacing-md + 48px + $spacing-md);
  text-align: left;
  width: 100%;
}

.responseExample {
  background-color: rgba($text-color, 0.05);
  padding: $spacing-md;
  border-radius: $border-radius-md;
  font-family: monospace;
  font-size: $font-size-sm;
  margin: 0;
  text-align: left;
  
  code {
    white-space: pre;
    color: $text-color;
    text-align: left;
    display: block;
  }
}
</style>
