<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Desactivaciones</h2>
        <p class="text-gray-600">Administra las desactivaciones de miembros de la organización</p>
      </div>
      <button
          @click="openAddModal"
          class="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        Nueva Desactivación
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
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <select v-model="currentNucleos">
          <option value="">Todos los núcleos</option>
          <option v-for="core in cores" :key="core.id" :value="core.id"></option>
        </select>
        <select
            v-model="reasonFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="">Todos los motivos</option>
          <option value="retirement">Jubilación</option>
          <option value="resignation">Renuncia</option>
          <option value="disciplinary">Acción Disciplinaria</option>
          <option value="transfer_out">Traslado Externo</option>
          <option value="other">Otro</option>
        </select>
        <input
            v-model="dateFilter"
            type="month"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
    </div>

    <!-- Lista de Desactivaciones -->
    <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Miembro
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Motivo
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Desactivación
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
          <tr v-for="deactivation in desactivations" :key="deactivation.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ deactivation.militante.name }}</div>
              <div class="text-sm text-gray-500">CI: {{ deactivation.militante.ci }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900">{{ getReasonText(deactivation.motivo) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ deactivation.fecha }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ deactivation.militante.core }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                  {{ deactivation.estado }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                  @click="viewDeactivationDetails(deactivation)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
              >
                Ver Detalles
              </button>
              <button
                  v-if="deactivation.status === 'pending'"
                  @click="confirmDeactivation(deactivation.id)"
                  class="text-green-600 hover:text-green-900 transition-colors"
              >
                Confirmar
              </button>
              <button
                  v-if="deactivation.status === 'confirmed' && deactivation.reason !== 'disciplinary'"
                  @click="reactivateMember(deactivation.id)"
                  class="text-orange-600 hover:text-orange-900 transition-colors"
              >
                Reactivar
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Nueva Desactivación -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Nueva Desactivación</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveDeactivation" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Miembro</label>
            <select
                v-model="currentDeactivation.memberId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Seleccionar miembro</option>
              <option v-for="member in availableMembers" :key="member.id" :value="member.id">
                {{ member.name }} - CI: {{ member.ci }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo de Desactivación</label>
            <select
                v-model="currentDeactivation.reason"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Seleccionar motivo</option>
              <option value="retirement">Jubilación</option>
              <option value="resignation">Renuncia</option>
              <option value="disciplinary">Acción Disciplinaria</option>
              <option value="transfer_out">Traslado Externo</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Desactivación</label>
            <input
                v-model="currentDeactivation.deactivationDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
            <textarea
                v-model="currentDeactivation.notes"
                rows="3"
                placeholder="Información adicional sobre la desactivación..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Documentos de Respaldo</label>
            <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.png"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <p class="text-xs text-gray-500 mt-1">Formatos permitidos: PDF, DOC, DOCX, JPG, PNG</p>
          </div>

          <div class="flex gap-3 pt-4">
            <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
            >
              {{ isLoading ? 'Procesando...' : 'Crear Desactivación' }}
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
          <h3 class="text-lg font-semibold">Detalles de la Desactivación</h3>
          <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedDeactivation" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Miembro</label>
              <p class="text-sm text-gray-900">{{ selectedDeactivation.memberName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CI</label>
              <p class="text-sm text-gray-900">{{ selectedDeactivation.memberCI }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Motivo</label>
              <p class="text-sm text-gray-900">{{ getReasonText(selectedDeactivation.reason) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha</label>
              <p class="text-sm text-gray-900">{{ formatDate(selectedDeactivation.deactivationDate) }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Procesado Por</label>
            <p class="text-sm text-gray-900">{{ selectedDeactivation.processedBy }}</p>
          </div>

          <div v-if="selectedDeactivation.notes">
            <label class="block text-sm font-medium text-gray-700">Notas</label>
            <p class="text-sm text-gray-900">{{ selectedDeactivation.notes }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <span :class="getStatusBadgeClass(selectedDeactivation.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getStatusText(selectedDeactivation.status) }}
            </span>
          </div>

          <div v-if="selectedDeactivation.reactivationDate">
            <label class="block text-sm font-medium text-gray-700">Fecha de Reactivación</label>
            <p class="text-sm text-gray-900">{{ formatDate(selectedDeactivation.reactivationDate) }}</p>
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import {toast} from "vue-sonner";

const { cores, desactivations } = defineProps<{
  cores: any;
  desactivations: any;
}>();

const currentNucleos = ref('')
// Estado reactivo
const deactivations = ref([])
const availableMembers = ref([])
const searchTerm = ref('')
const reasonFilter = ref('all')
const dateFilter = ref('')
const showModal = ref(false)
const showDetailsModal = ref(false)
const isLoading = ref(false)
const selectedDeactivation = ref(null)

const currentDeactivation = ref({
  id: null,
  memberId: '',
  memberName: '',
  memberCI: '',
  reason: '',
  deactivationDate: '',
  notes: '',
  processedBy: 'Administrador Sistema',
  status: 'pending'
})

// Computed
const filteredDeactivations = computed(() => {
  return deactivations.value.filter(deactivation => {
    const matchesSearch = deactivation.memberName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        deactivation.memberCI.includes(searchTerm.value)
    const matchesReason = reasonFilter.value === 'all' || deactivation.reason === reasonFilter.value
    const matchesDate = !dateFilter.value || deactivation.deactivationDate.startsWith(dateFilter.value)
    return matchesSearch && matchesReason && matchesDate
  })
})

// Métodos
const openAddModal = () => {
  currentDeactivation.value = {
    id: null,
    memberId: '',
    memberName: '',
    memberCI: '',
    reason: '',
    deactivationDate: new Date().toISOString().split('T')[0],
    notes: '',
    processedBy: 'Administrador Sistema',
    status: 'pending'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedDeactivation.value = null
}

const saveDeactivation = async () => {
  isLoading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const member = availableMembers.value.find(m => m.id === currentDeactivation.value.memberId)
    if (member) {
      currentDeactivation.value.memberName = member.name
      currentDeactivation.value.memberCI = member.ci
    }

    currentDeactivation.value.id = Date.now()
    deactivations.value.push({ ...currentDeactivation.value })

    showNotification('success', 'Desactivación creada correctamente')
    closeModal()
  } catch (error) {
    showNotification('error', 'Error al crear la desactivación')
  } finally {
    isLoading.value = false
  }
}

const confirmDeactivation = async (id) => {
  if (confirm('¿Está seguro de que desea confirmar esta desactivación?')) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const deactivation = deactivations.value.find(d => d.id === id)
      if (deactivation) {
        deactivation.status = 'confirmed'
        toast.success('Desactivación confirmada correctamente')
      }
    } catch (error) {
      toast.error('Error al confirmar la desactivación')
    }
  }
}

const reactivateMember = async (id) => {
  if (confirm('¿Está seguro de que desea reactivar este miembro?')) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const deactivation = deactivations.value.find(d => d.id === id)
      if (deactivation) {
        deactivation.status = 'reactivated'
        deactivation.reactivationDate = new Date().toISOString().split('T')[0]
        toast.success( 'Miembro reactivado correctamente')
      }
    } catch (error) {
      toast.error('Error al reactivar el miembro')
    }
  }
}

const viewDeactivationDetails = (deactivation) => {
  selectedDeactivation.value = deactivation
  showDetailsModal.value = true
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

const getReasonText = (reason) => {
  const texts = {
    retirement: 'Jubilación',
    resignation: 'Renuncia',
    disciplinary: 'Acción Disciplinaria',
    transfer_out: 'Traslado Externo',
    other: 'Otro'
  }
  return texts[reason] || reason
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-red-100 text-red-800',
    reactivated: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    reactivated: 'Reactivado'
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
  deactivations.value = mockDeactivations
  availableMembers.value = mockMembers
})
</script>