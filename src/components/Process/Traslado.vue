<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Traslados</h2>
        <p class="text-gray-600">Administra los traslados de miembros entre sucursales</p>
      </div>
      <button
          @click="openAddModal"
          class="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        Nuevo Traslado
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg border shadow-sm">
      <div class="flex gap-4 items-center">
        <div class="flex-1">
          <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nombre del miembro..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="completed">Completados</option>
        </select>
        <select
            v-model="selectNucleo"
            class="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos los núcleos</option>
          <option
              v-for="nucleo in cores"
              :key="nucleo.id"
              :value="nucleo.id"
          >
            {{ nucleo.name }}
          </option>
        </select>
      </div>
    </div>
{{ traslados.data }}
    <!-- Lista de Traslados -->
    <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Militante
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origen
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destino
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Núcleo
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transfer in filteredTransfers" :key="transfer.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ transfer.militante.firstname }} {{ transfer.militante.lastname }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ transfer.origen }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ transfer.destino }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ transfer.fecha }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ transfer.militante.core.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                {{ transfer.estado }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                  v-if="transfer.status === 'pending'"
                  @click="approveTransfer(transfer.id)"
                  class="text-green-600 hover:text-green-900 transition-colors"
              >
                Aprobar
              </button>
              <button
                  v-if="transfer.status === 'approved'"
                  @click="completeTransfer(transfer.id)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
              >
                Completar
              </button>
              <button
                  v-if="transfer.status === 'pending'"
                  @click="rejectTransfer(transfer.id)"
                  class="text-red-600 hover:text-red-900 transition-colors"
              >
                Rechazar
              </button>
              <button
                  @click="viewTransferDetails(transfer)"
                  class="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Ver Detalles
              </button>
            </td>
          </tr>
          <tr v-if="!filteredTransfers?.length">
              <td colspan="6" class="text-center py-8 text-gray-500">No hay traslados registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Nuevo Traslado -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Nuevo Traslado</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveTransfer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Miembro</label>
            <select
                v-model="currentTransfer.memberId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar miembro</option>
              <option v-for="member in availableMembers" :key="member.id" :value="member.id">
                {{ member.name }} - CI: {{ member.ci }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sucursal de Origen</label>
            <select
                v-model="currentTransfer.origin"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar origen</option>
              <option v-for="branch in branches" :key="branch" :value="branch">
                {{ branch }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sucursal de Destino</label>
            <select
                v-model="currentTransfer.destination"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar destino</option>
              <option v-for="branch in branches" :key="branch" :value="branch" :disabled="branch === currentTransfer.origin">
                {{ branch }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo del Traslado</label>
            <textarea
                v-model="currentTransfer.reason"
                required
                rows="3"
                placeholder="Describe el motivo del traslado..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Efectiva</label>
            <input
                v-model="currentTransfer.effectiveDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex gap-3 pt-4">
            <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md transition-colors"
            >
              {{ isLoading ? 'Procesando...' : 'Crear Traslado' }}
            </button>
            <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Detalles del Traslado</h3>
          <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedTransfer" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Militante</label>
              <p class="text-sm text-gray-900">{{ selectedTransfer.memberName }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Origen</label>
              <p class="text-sm text-gray-900">{{ selectedTransfer.origin }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Destino</label>
              <p class="text-sm text-gray-900">{{ selectedTransfer.destination }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Motivo</label>
            <p class="text-sm text-gray-900">{{ selectedTransfer.reason }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha de Solicitud</label>
              <p class="text-sm text-gray-900">{{ formatDate(selectedTransfer.requestDate) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <span :class="getStatusBadgeClass(selectedTransfer.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusText(selectedTransfer.status) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button
              @click="closeDetailsModal"
              class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'

const { traslados, members, cores } = defineProps<{
  traslados: any;
  members: any[];
  cores: any;
}>();

// Estado reactivo
const searchTerm = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const showDetailsModal = ref(false)
const isLoading = ref(false)
const selectedTransfer = ref(null)
const selectNucleo = ref("");

const currentTransfer = ref({
  id: null,
  memberId: '',
  memberName: '',
  memberCI: '',
  origin: '',
  destination: '',
  reason: '',
  requestDate: '',
  effectiveDate: '',
  status: 'pending'
})

// Computed
const filteredTransfers = computed(() => {
  return traslados.data;
})

// Métodos
const openAddModal = () => {
  currentTransfer.value = {
    id: null,
    memberId: '',
    memberName: '',
    memberCI: '',
    origin: '',
    destination: '',
    reason: '',
    requestDate: new Date().toISOString().split('T')[0],
    effectiveDate: '',
    status: 'pending'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedTransfer.value = null
}

const saveTransfer = async () => {
  isLoading.value = true

  try {
    
    toast.success('Traslado creado correctamente')
    closeModal()
  } catch (error) {
    toast.error('Error al crear el traslado')
  } finally {
    isLoading.value = false
  }
}

const approveTransfer = async () => {
  try {
    
  } catch (error) {
    toast.error('Error al aprobar el traslado')
  }
}

const completeTransfer = async () => {
  try {
   
  } catch (error) {
    toast.error('Error al completar el traslado')
  }
}
const viewTransferDetails = async () => {

}
const rejectTransfer = async () => {

}
</script>