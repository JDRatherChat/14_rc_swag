import yaml from 'js-yaml'
import { onMounted, ref } from 'vue'

export function useOpenApi() {
  const apiSpec = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const endpoints = ref([])

  async function loadOpenApiSpec() {
    try {
      loading.value = true
      error.value = null

      // Load and parse the main OpenAPI file
      const mainResponse = await fetch('/test.yaml')
      const mainYaml = await mainResponse.text()
      const mainSpec = yaml.load(mainYaml)

      // Function to resolve $ref in an object
      async function resolveRefs(obj) {
        if (!obj) return obj

        if (typeof obj === 'object') {
          // Handle $ref
          if (obj.$ref) {
            const refPath = obj.$ref
            if (refPath.startsWith('./')) {
              const response = await fetch(`/openapi/${refPath.slice(2)}`)
              const yaml = await response.text()
              return yaml.load(yaml)
            }
            return obj
          }

          // Recursively resolve refs in object properties
          for (const key in obj) {
            obj[key] = await resolveRefs(obj[key])
          }
        }
        return obj
      }

      // Resolve all refs in the main spec
      apiSpec.value = await resolveRefs(mainSpec)

      // Process endpoints after loading
      processEndpoints()
    } catch (e) {
      console.error('Error loading OpenAPI spec:', e)
      error.value = 'Failed to load API documentation'
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
    loadOpenApiSpec()
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
