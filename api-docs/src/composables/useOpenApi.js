import { ref, onMounted } from 'vue'
import yaml from 'js-yaml'

export function useOpenApi() {
  const apiSpec = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const loadApiSpec = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch('/endpoints.yaml')
      const yamlText = await response.text()
      apiSpec.value = yaml.load(yamlText)
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

  // Extract endpoints for AppMain component
  const getEndpoints = () => {
    if (!apiSpec.value) return []

    const endpoints = []
    const paths = apiSpec.value.paths || {}

    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, details] of Object.entries(methods)) {
        endpoints.push({
          path,
          method: method.toUpperCase(),
          description: details.summary || details.description,
          operationId: details.operationId,
          parameters: details.parameters || [],
          requestBody: details.requestBody,
          responses: Object.entries(details.responses || {}).map(([code, response]) => ({
            status: code,
            description: response.description,
            content: response.content
          }))
        })
      }
    }

    return endpoints
  }

  onMounted(() => {
    loadApiSpec()
  })

  return {
    apiSpec,
    loading,
    error,
    getApiInfo,
    getEndpoints,
    loadApiSpec
  }
}
