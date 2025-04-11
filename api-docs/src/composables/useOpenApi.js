import yaml from 'js-yaml'
import { onMounted, ref } from 'vue'

export function useOpenApi() {
  const apiSpec = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const endpoints = ref([])

  const loadApiSpec = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch('/test.yaml')
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
    if (!apiSpec.value) return null;
    
    const { info, servers, tags } = apiSpec.value;
    return {
      title: info?.title,
      description: info?.description,
      version: info?.version,
      termsOfService: info?.termsOfService,
      privacyPolicy: info?.privacyPolicy,
      contact: info?.contact,
      servers: servers || [],
      tags: tags || []
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
    return Object.entries(responses).reduce((acc, [status, details]) => {
      acc[status] = {
        status,
        description: details.description,
        content: details.content,
        headers: details.headers
      }
      return acc
    }, {})
  }

  // Process and store endpoints
  const processEndpoints = () => {
    if (!apiSpec.value) return

    const processed = []
    const paths = apiSpec.value.paths || {}
    const tagDescriptions = {}

    // First, collect tag descriptions
    apiSpec.value.tags?.forEach(tag => {
      tagDescriptions[tag.name.toLowerCase()] = tag.description
    })

    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, details] of Object.entries(methods)) {
        // Skip if it's a parameter object
        if (method === 'parameters') continue

        const tags = details.tags || ['Other']
        
        processed.push({
          path,
          method: method.toUpperCase(),
          tags,
          tagDescription: tagDescriptions[tags[0]?.toLowerCase()],
          summary: details.summary,
          description: details.description || details.summary,
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
          security: details.security,
          expanded: false
        })
      }
    }

    // Sort endpoints by path
    processed.sort((a, b) => a.path.localeCompare(b.path))
    endpoints.value = processed
  }

  // Get endpoints
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
    apiSpec,
    getApiInfo,
    getEndpoints,
    toggleEndpoint,
    downloadSpec
  }
}
