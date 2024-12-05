<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Header Section -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-semibold text-gray-900">Listado de Actas</h1>
                <p class="mt-1 text-sm text-gray-500">Gestiona y visualiza todas las actas del sistema</p>
              </div>
              <div class="flex gap-3">
                <button class="inline-flex items-center px-4 py-2 border border-gray-200 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <UploadIcon class="h-4 w-4 mr-2" />
                  Cargar Acta
                </button>
                <button class="inline-flex items-center px-4 py-2 border border-gray-200 rounded shadow-sm text-sm font-medium text-gray-700 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Nueva Acta
                </button>
              </div>
            </div>
  
            <!-- Search and Filters -->
            <div class="mt-6 flex items-center gap-4">
              <div class="flex-1 relative">
                <SearchIcon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar actas..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  v-model="searchQuery"
                >
              </div>
              <select
                v-model="selectedDepartment"
                class="px-4 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Todos los núcleos</option>
                <option value="innovacion">Innovación</option>
                <option value="desarrollo">Desarrollo</option>
                <option value="gestion">Gestión</option>
              </select>
              <select
                v-model="selectedMonth"
                class="px-4 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Todos los meses</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
              </select>
            </div>
          </div>
  
          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Núcleo</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado por</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="acta in filteredActas" :key="acta.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ acta.titulo }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ acta.nucleo }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ formatDate(acta.fecha) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ acta.creador }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(acta.estado)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ acta.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-gray-400 hover:text-gray-500">
                      <MoreVerticalIcon class="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Empty State -->
          <div v-if="filteredActas.length === 0" class="text-center py-12">
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay actas</h3>
            <p class="mt-1 text-sm text-gray-500">Comienza creando una nueva acta o cargando un documento existente.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { SearchIcon, PlusIcon, UploadIcon, MoreVerticalIcon } from 'lucide-vue-next'
  
  const searchQuery = ref('')
  const selectedDepartment = ref('')
  const selectedMonth = ref('')
  
  const actas = ref([
    {
      id: 1,
      titulo: 'Acta Reunión Enero',
      nucleo: 'Desarrollo',
      fecha: '2024-01-14',
      creador: 'Juan',
      estado: 'Aprobada'
    },
    {
      id: 2,
      titulo: 'Acta Planificación Q1',
      nucleo: 'Gestión',
      fecha: '2024-01-09',
      creador: 'Pedro',
      estado: 'Pendiente'
    },
    {
      id: 3,
      titulo: 'Acta Revisión Proyectos',
      nucleo: 'Innovación',
      fecha: '2024-01-04',
      creador: 'Teresa',
      estado: 'Rechazada'
    }
  ])
  
  const filteredActas = computed(() => {
    return actas.value.filter(acta => {
      const matchesSearch = acta.titulo.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesDepartment = !selectedDepartment.value || acta.nucleo.toLowerCase() === selectedDepartment.value
      const matchesMonth = !selectedMonth.value || new Date(acta.fecha).getMonth() + 1 === parseInt(selectedMonth.value)
      return matchesSearch && matchesDepartment && matchesMonth
    })
  })
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const getStatusClass = (status) => {
    const classes = {
      'Aprobada': 'bg-green-100 text-green-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Rechazada': 'bg-red-100 text-red-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  </script>
  
  <style>
  :root {
    --primary-50: #f0f9ff;
    --primary-100: #e0f2fe;
    --primary-500: #0ea5e9;
    --primary-600: #0284c7;
    --primary-700: #0369a1;
  }
  </style>