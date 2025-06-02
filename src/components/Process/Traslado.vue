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
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="completed">Completados</option>
          <option value="rejected">Rechazados</option>
        </select>
      </div>
    </div>

    <!-- Lista de Traslados -->
    <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Miembro
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origen
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destino
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Solicitud
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
              <div class="font-medium text-gray-900">{{ transfer.memberName }}</div>
              <div class="text-sm text-gray-500">CI: {{ transfer.memberCI }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ transfer.origin }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ transfer.destination }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(transfer.requestDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(transfer.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusText(transfer.status) }}
                </span>
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
              <label class="block text-sm font-medium text-gray-700">Miembro</label>
              <p class="text-sm text-gray-900">{{ selectedTransfer.memberName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CI</label>
              <p class="text-sm text-gray-900">{{ selectedTransfer.memberCI }}</p>
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

    <!-- Notificaciones -->
    <div v-if="notification.show" :class="getNotificationClass()" class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50">
      <div class="flex items-center gap-2">
        <svg v-if="notification.type === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span>{{ notification.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Estado reactivo
const transfers = ref([])
const availableMembers = ref([])
const branches = ref(['Sucursal Centro', 'Sucursal Norte', 'Sucursal Sur', 'Sucursal Este', 'Sucursal Oeste'])
const searchTerm = ref('')
const statusFilter = ref('all')
const showModal = ref(false)
const showDetailsModal = ref(false)
const isLoading = ref(false)
const notification = ref({ show: false, type: '', message: '' })
const selectedTransfer = ref(null)

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

// Datos de ejemplo
const mockTransfers = [
  {
    id: 1,
    memberId: '1',
    memberName: 'Ana María López',
    memberCI: '12345678901',
    origin: 'Sucursal Centro',
    destination: 'Sucursal Norte',
    reason: 'Reestructuración administrativa',
    requestDate: '2024-01-10',
    effectiveDate: '2024-02-01',
    status: 'approved'
  },
  {
    id: 2,
    memberId: '2',
    memberName: 'Carlos Mendoza',
    memberCI: '98765432109',
    origin: 'Sucursal Sur',
    destination: 'Sucursal Este',
    reason: 'Solicitud personal',
    requestDate: '2024-01-15',
    effectiveDate: '2024-02-15',
    status: 'pending'
  }
]

const mockMembers = [
  { id: '1', name: 'Ana María López', ci: '12345678901' },
  { id: '2', name: 'Carlos Mendoza', ci: '98765432109' },
  { id: '3', name: 'Luis Fernández', ci: '11223344556' }
]

// Computed
const filteredTransfers = computed(() => {
  return transfers.value.filter(transfer => {
    const matchesSearch = transfer.memberName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        transfer.memberCI.includes(searchTerm.value)
    const matchesStatus = statusFilter.value === 'all' || transfer.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
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
    await new Promise(resolve => setTimeout(resolve, 1000))

    const member = availableMembers.value.find(m => m.id === currentTransfer.value.memberId)
    if (member) {
      currentTransfer.value.memberName = member.name
      currentTransfer.value.memberCI = member.ci
    }

    currentTransfer.value.id = Date.now()
    transfers.value.push({ ...currentTransfer.value })

    showNotification('success', 'Traslado creado correctamente')
    closeModal()
  } catch (error) {
    showNotification('error', 'Error al crear el traslado')
  } finally {
    isLoading.value = false
  }
}

const approveTransfer = async (id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    const transfer = transfers.value.find(t => t.id === id)
    if (transfer) {
      transfer.status = 'approved'
      showNotification('success', 'Traslado aprobado correctamente')
    }
  } catch (error) {
    showNotification('error', 'Error al aprobar el traslado')
  }
}

const completeTransfer = async (id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    const transfer = transfers.value.find(t => t.id === id)
    if (transfer) {
      transfer.status = 'completed'
      showNotification('success', 'Traslado completado correctamente')
    }
  } catch (error) {
    showNotification('error', 'Error al completar el traslado')
  }
}

const rejectTransfer = async (id) => {
  if (confirm('¿Está seguro de que desea rechazar este traslado?')) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const transfer = transfers.value.find(t => t.id === id)
      if (transfer) {
        transfer.status = 'rejected'
        showNotification('success', 'Traslado rechazado')
      }
    } catch (error) {
      showNotification('error', 'Error al rechazar el traslado')
    }
  }
}

const viewTransferDetails = (transfer) => {
  selectedTransfer.value = transfer
  showDetailsModal.value = true
}

const showNotification = (type, message) => {
  notification.value = { show: true, type, message }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    completed: 'Completado',
    rejected: 'Rechazado'
  }
  return texts[status] || status
}

const getNotificationClass = () => {
  return notification.value.type === 'success'
      ? 'bg-green-500 text-white'
      : 'bg-red-500 text-white'
}

// Inicialización
onMounted(() => {
  transfers.value = mockTransfers
  availableMembers.value = mockMembers
})
</script>