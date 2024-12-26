<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto max-w-7xl space-y-6">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-3xl text-blue-600 font-bold tracking-tight">Control de Actas</h1>
        <p class="text-gray-500">Gestión y seguimiento de documentación oficial</p>
      </div>

      <!-- Document Type Tabs -->
      <div class="">
        <nav class="flex space-x-4" aria-label="Tabs">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
              'px-3 py-2 text-md font-medium transition-colors',
              activeTab === tab.id
                ? 'border-b shadow-border'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Actions Bar -->
      <div class="flex items-center justify-between">
        <div class="flex space-x-2">
          <Button variant="outline" @click="showUploadDialog = true">
            <UploadIcon class="h-4 w-4 mr-2" />
            Cargar acta
          </Button>
          <Button variant="outline">
            <DownloadIcon class="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
        <Button class="bg-blue-500 hover:bg-blue-600">
          <PlusIcon class="h-4 w-4 mr-2" />
          Crear nueva acta
        </Button>
      </div>

      <!-- Search and Filters -->
      <div class="grid gap-4 md:grid-cols-4">
        <div class="md:col-span-2">
          <div class="relative">
            <SearchIcon class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
                v-model="search"
                type="text"
                placeholder="Buscar por nombre de acta..."
                class="w-full rounded-md pl-9 pr-4 py-2 text-sm"
            />
          </div>
        </div>
        <select
            v-model="selectedNucleo"
            class="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos los núcleos</option>
          <option v-for="nucleo in nucleos" :key="nucleo" :value="nucleo">
            {{ nucleo }}
          </option>
        </select>

        <select
            v-model="selectedStatus"
            class="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <!-- Table -->
      <div class="rounded-lg border bg-white shadow">
        <table class="w-full">
          <thead>
          <tr class="border-b bg-gray-50">
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">No.</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Nombre del acta</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Núcleo</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
            <th class="px-4 py-3 text-center text-sm font-medium text-gray-500">Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="acta in filteredActas" :key="acta.id" class="border-b last:border-0">
            <td class="px-4 py-3 text-sm">{{ acta.id }}</td>
            <td class="px-4 py-3 text-sm font-medium">{{ acta.nombre }}</td>
            <td class="px-4 py-3 text-sm">{{ acta.nucleo }}</td>
            <td class="px-4 py-3 text-sm">{{ acta.fecha }}</td>
            <td class="px-4 py-3 text-sm">
                <span
                    :class="[
                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                    {
                      'bg-green-100 text-green-700': acta.estado === 'Aprobada',
                      'bg-yellow-100 text-yellow-700': acta.estado === 'Pendiente',
                      'bg-red-100 text-red-700': acta.estado === 'En revisión'
                    }
                  ]"
                >
                  {{ acta.estado }}
                </span>
            </td>
            <td class="px-4 py-3 text-center">
              <DropdownMenu>
                <DropdownMenuTrigger as="button" class="text-gray-400  hover:text-gray-500 transition-colors duration-200">
                  <MoreVerticalIcon class="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem v-for="action in actions" :key="action.name" @click="handleAction(action.name, acta)">
                    <component :is="action.icon" class="h-4 w-4 mr-2" />
                    <span>{{ action.name }}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Mostrando {{ startIndex + 1 }} a {{ endIndex }} de {{ totalActas }} resultados
        </p>
        <div class="flex space-x-2">
          <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="rounded-md border border-input px-3 py-2 text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <button
              @click="currentPage++"
              :disabled="endIndex >= totalActas"
              class="rounded-md border border-input px-3 py-2 text-sm disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  UploadIcon,
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  MoreVerticalIcon, EyeIcon, PencilIcon, TrashIcon
} from 'lucide-vue-next'
import Button from "../ui/button/Button.vue";
import DropdownMenuTrigger from "../ui/dropdown-menu/DropdownMenuTrigger.vue";
import DropdownMenuContent from "../ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "../ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenu from "../ui/dropdown-menu/DropdownMenu.vue";

const tabs = [
  { id: 'all', name: 'Todas las actas' },
  { id: 'ro', name: 'Acta RO' },
  { id: 'cp', name: 'Acta CP' }
]
const actions = [
  { name: 'Ver', icon: EyeIcon },
  { name: 'Editar', icon: PencilIcon },
  { name: 'Eliminar', icon: TrashIcon }
]

const nucleos = ['Arquitectura', 'Automática', 'CIPEL']
const statuses = ['Aprobada', 'Pendiente', 'En revisión']

const activeTab = ref('all')
const search = ref('')
const selectedNucleo = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Mock data
const actas = ref([
  {
    id: '001',
    nombre: 'Acta RO Marzo 2024',
    nucleo: 'Arquitectura',
    fecha: '14 de marzo de 2024',
    estado: 'Aprobada'
  },
  {
    id: '002',
    nombre: 'Acta CP Marzo 2024',
    nucleo: 'Automática',
    fecha: '15 de marzo de 2024',
    estado: 'Pendiente'
  },
  {
    id: '003',
    nombre: 'Acta RO Febrero 2024',
    nucleo: 'CIPEL',
    fecha: '27 de febrero de 2024',
    estado: 'En revisión'
  }
])

const filteredActas = computed(() => {
  return actas.value
      .filter(acta => {
        const matchesSearch = acta.nombre.toLowerCase().includes(search.value.toLowerCase())
        const matchesNucleo = !selectedNucleo.value || acta.nucleo === selectedNucleo.value
        const matchesStatus = !selectedStatus.value || acta.estado === selectedStatus.value
        const matchesTab = activeTab.value === 'all' ||
            (activeTab.value === 'ro' && acta.nombre.includes('RO')) ||
            (activeTab.value === 'cp' && acta.nombre.includes('CP'))
        return matchesSearch && matchesNucleo && matchesStatus && matchesTab
      })
})

const totalActas = computed(() => filteredActas.value.length)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalActas.value))
</script>