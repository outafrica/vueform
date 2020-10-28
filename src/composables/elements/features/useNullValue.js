import { computed, toRefs } from 'composition-api'

export default function useNullValue(props, context, dependencies)
{
  // ============== COMPUTED ===============

  const nullValue = computed(() => {
    return null
  })
  
  return {
    // Computed
    nullValue,
  }
}