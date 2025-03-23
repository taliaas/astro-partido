<template>
  <div class="w-full">
    <!-- Search Bar with Filter Button -->
    <div class="relative">
      <div class="flex items-center gap-2 border px-3 py-2 rounded-md w-full">
        <SearchIcon class="h-4 w-4 text-gray-400" />
        <input
            v-model="searchQuery"
            class="flex-1 border-0 outline-none bg-transparent placeholder:text-gray-400"
            placeholder="Buscar..."
            @keyup.enter="search"
        />
        <button
            @click="isAdvancedSearchOpen = !isAdvancedSearchOpen"
            class="h-7 w-7 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500"
        >
          <FilterIcon class="h-4 w-4" />
        </button>
      </div>

      <!-- Advanced Search Popover -->
      <div
          v-if="isAdvancedSearchOpen"
          class="absolute right-0 z-10 mt-2 w-[400px] rounded-md border bg-white p-4 shadow-md"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-medium leading-none">Búsqueda avanzada</h4>
            <button @click="isAdvancedSearchOpen = false" class="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-100">
              <XIcon class="h-4 w-4" />
            </button>
          </div>
          <div class="h-px bg-gray-200"></div>

          <div class="grid gap-3">
            <!-- Document Type -->
            <div class="grid gap-1.5">
              <label class="text-sm font-medium">Tipo de documento</label>
              <select
                  v-model="filters.documentType"
                  class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
              >
                <option value="">Todos los documentos</option>
                <option value="acta">Actas</option>
                <option value="informe">Informes</option>
                <option value="reporte">Reportes</option>
              </select>
            </div>

            <!-- Status -->
            <div class="grid gap-1.5">
              <label class="text-sm font-medium">Estado</label>
              <select
                  v-model="filters.status"
                  class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
              >
                <option value="">Cualquier estado</option>
                <option value="pending">Pendiente</option>
                <option value="processed">Procesado</option>
                <option value="alert">Con alertas</option>
              </select>
            </div>

            <!-- Date Range -->
            <div class="grid gap-1.5">
              <label class="text-sm font-medium">Periodo</label>
              <div class="flex gap-2">
                <div class="flex-1">
                  <label class="text-xs text-gray-500">Desde</label>
                  <input
                      v-model="filters.dateFrom"
                      type="date"
                      class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                  />
                </div>
                <div class="flex-1">
                  <label class="text-xs text-gray-500">Hasta</label>
                  <input
                      v-model="filters.dateTo"
                      type="date"
                      class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>

            <!-- Keywords -->
            <div class="grid gap-1.5">
              <label class="text-sm font-medium">Palabras clave</label>
              <input
                  v-model="filters.keywords"
                  class="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                  placeholder="Ej: presupuesto, recursos, inversión"
              />
            </div>

            <!-- Include Archived -->
            <div class="flex items-center space-x-2">
              <input
                  id="archived"
                  v-model="filters.includeArchived"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="archived" class="text-sm font-medium">
                Incluir documentos archivados
              </label>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between mt-2">
              <button
                  @click="resetFilters"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2"
              >
                Limpiar
              </button>
              <button
                  @click="applyFilters"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 bg-button hover:bg-button-foreground text-gray-50 h-10 px-4 py-2"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 mt-2">
        <div
            v-for="(filter, index) in activeFilters"
            :key="index"
            class="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
        >
          {{ filter.label }}
          <button
              @click="removeFilter(index)"
              class="ml-1 h-3.5 w-3.5 rounded-full hover:bg-gray-100 inline-flex items-center justify-center"
          >
            <XIcon class="h-3 w-3" />
          </button>
        </div>
        <button
            v-if="activeFilters.length > 0"
            @click="clearAllFilters"
            class="text-xs text-gray-500 hover:text-gray-900"
        >
          Limpiar todos
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { SearchIcon, FilterIcon, XIcon } from 'lucide-vue-next'

// Search query
const searchQuery = ref('')
const isAdvancedSearchOpen = ref(false)

// Filter state
const filters = reactive({
  documentType: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  keywords: '',
  includeArchived: false
})

// Active filters
const activeFilters = ref([])

// Apply filters
const applyFilters = () => {
  // Clear existing filters
  activeFilters.value = []

  // Add document type filter if selected
  if (filters.documentType) {
    const documentTypeLabels = {
      'acta': 'Actas',
      'informe': 'Informes',
      'reporte': 'Reportes'
    }
    activeFilters.value.push({
      type: 'documentType',
      value: filters.documentType,
      label: `Tipo: ${documentTypeLabels[filters.documentType]}`
    })
  }

  // Add status filter if selected
  if (filters.status) {
    const statusLabels = {
      'pending': 'Pendiente',
      'processed': 'Procesado',
      'alert': 'Con alertas'
    }
    activeFilters.value.push({
      type: 'status',
      value: filters.status,
      label: `Estado: ${statusLabels[filters.status]}`
    })
  }

  // Add date range filter if selected
  if (filters.dateFrom && filters.dateTo) {
    activeFilters.value.push({
      type: 'dateRange',
      value: { from: filters.dateFrom, to: filters.dateTo },
      label: `Periodo: ${formatDate(filters.dateFrom)} - ${formatDate(filters.dateTo)}`
    })
  } else if (filters.dateFrom) {
    activeFilters.value.push({
      type: 'dateFrom',
      value: filters.dateFrom,
      label: `Desde: ${formatDate(filters.dateFrom)}`
    })
  } else if (filters.dateTo) {
    activeFilters.value.push({
      type: 'dateTo',
      value: filters.dateTo,
      label: `Hasta: ${formatDate(filters.dateTo)}`
    })
  }

  // Add keywords filter if entered
  if (filters.keywords) {
    activeFilters.value.push({
      type: 'keywords',
      value: filters.keywords,
      label: `Palabras: ${filters.keywords}`
    })
  }

  // Add archived filter if checked
  if (filters.includeArchived) {
    activeFilters.value.push({
      type: 'includeArchived',
      value: true,
      label: 'Incluye archivados'
    })
  }

  // Close the advanced search panel
  isAdvancedSearchOpen.value = false

  // Perform the search
  search()
}

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Remove a specific filter
const removeFilter = (index) => {
  const filter = activeFilters.value[index]

  // Reset the corresponding filter in the form
  switch (filter.type) {
    case 'documentType':
      filters.documentType = ''
      break
    case 'status':
      filters.status = ''
      break
    case 'dateRange':
      filters.dateFrom = ''
      filters.dateTo = ''
      break
    case 'dateFrom':
      filters.dateFrom = ''
      break
    case 'dateTo':
      filters.dateTo = ''
      break
    case 'keywords':
      filters.keywords = ''
      break
    case 'includeArchived':
      filters.includeArchived = false
      break
  }

  // Remove the filter from active filters
  activeFilters.value.splice(index, 1)

  // Perform the search again with updated filters
  search()
}

// Clear all filters
const clearAllFilters = () => {
  activeFilters.value = []
  resetFilters()
  search()
}

// Reset filter form
const resetFilters = () => {
  filters.documentType = ''
  filters.status = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.keywords = ''
  filters.includeArchived = false
}

// Perform search with current query and filters
const search = () => {
  // Here you would implement the actual search functionality
  // For example, emit an event with search parameters
  const searchParams = {
    query: searchQuery.value,
    filters: activeFilters.value.reduce((acc, filter) => {
      acc[filter.type] = filter.value
      return acc
    }, {})
  }

  console.log('Searching with params:', searchParams)
  emit('search', searchParams)
}

// Define emits
const emit = defineEmits(['search'])

// Expose component methods
defineExpose({
  search,
  resetFilters,
  clearAllFilters
})
</script>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>