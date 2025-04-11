import { ref, onMounted } from 'vue'
import yaml from 'js-yaml'

export function useOpenApi() {
  const apiSpec = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const endpoints = ref([])

  const loadApiSpec = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch('/endpoints.yaml')
      const yamlText = await response.text()
      apiSpec.value = yaml.load(yamlText)
      
      // Process endpoints after loading
      processEndpoints()
    } catch (e) {
      error.value = e.message
      console.error('Failed to load API spec:', e)
    } finally {
      loading.value = false
    }
  }

  // Extract info for AppInfo component
  const getApiInfo = () => {
    if (!apiSpec.value) return null
    
    return {
      title: apiSpec.value.info.title,
      version: apiSpec.value.info.version,
      description: apiSpec.value.info.description,
      openApiVersion: apiSpec.value.openapi,
      termsOfService: apiSpec.value.info.termsOfService,
      contact: apiSpec.value.info.contact
    }
  }

  // Format parameters for better display
  const formatParameters = (parameters = []) => {
    return parameters.map(param => ({
      name: param.name,
      in: param.in,
      required: param.required || false,
      description: param.description,
      schema: param.schema || { type: param.type }
    }))
  }

  // Format responses for better display
  const formatResponses = (responses = {}) => {
    return Object.entries(responses).map(([status, details]) => ({
      status,
      description: details.description,
      content: details.content
    }))
  }

  // Process and store endpoints
  const processEndpoints = () => {
    if (!apiSpec.value) return

    const processed = []
    const paths = apiSpec.value.paths || {}

    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, details] of Object.entries(methods)) {
        // Skip if it's a parameter object
        if (method === 'parameters') continue

        processed.push({
          path,
          method: method.toUpperCase(),
          summary: details.summary,
          description: details.description,
          operationId: details.operationId,
          // Combine path-level and operation-level parameters
          parameters: formatParameters([
            ...(methods.parameters || []),
            ...(details.parameters || [])
          ]),
          requestBody: details.requestBody ? {
            description: details.requestBody.description,
            required: details.requestBody.required,
            content: details.requestBody.content
          } : null,
          responses: formatResponses(details.responses),
          deprecated: details.deprecated || false,
          expanded: false // UI state for expandable sections
        })
      }
    }

    // Sort endpoints by path for better organization
    endpoints.value = processed.sort((a, b) => a.path.localeCompare(b.path))
  }

  // Get endpoints (now returns the ref)
  const getEndpoints = () => endpoints.value

  // Toggle endpoint expansion
  const toggleEndpoint = (endpoint) => {
    endpoint.expanded = !endpoint.expanded
  }

  // Download OpenAPI spec as YAML
  const downloadSpec = () => {
    if (!apiSpec.value) return

    const yamlStr = yaml.dump(apiSpec.value)
    const blob = new Blob([yamlStr], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'openapi-spec.yaml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  onMounted(() => {
    loadApiSpec()
  })

  return {
    loading,
    error,
    getApiInfo,
    getEndpoints,
    toggleEndpoint,
    downloadSpec
  }
}
