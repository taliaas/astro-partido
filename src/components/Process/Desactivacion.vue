<script setup lang="ts">
import { actions } from 'astro:actions';
import { ref, computed, onMounted, reactive } from 'vue'
import { toast } from "vue-sonner";

const { cores, desactivations, members } = defineProps<{
  cores: any[];
  desactivations: any;
  members: any[];
}>();

const currentNucleos = ref('');
const searchTerm = ref('');
const reasonFilter = ref('');
const dateFilter = ref('');
const showModal = ref(false);
const showDetailsModal = ref(false);
const isLoading = ref(false);
const selectedDeactivation = ref<null | {
  id: number | null;
  motivo: string;
  fecha: string;
  estado: string;
  militante: any;
  notas: string;
  reactivationDate?: string;
}>(null);

const availableMembers = ref<any[]>([]);

const currentDeactivation = ref({
  id: null,
  motivo: '',
  fecha: '',
  estado: 'pending',
  militante: '',
  notas: ''
});

// Computed
const filteredDeactivations = computed(() => {
  return desactivations?.data.filter(deactivation => {
    const matchesSearch =
      deactivation.militante?.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      deactivation.militante?.ci?.includes(searchTerm.value);
    const matchesReason = !reasonFilter.value || deactivation.motivo === reasonFilter.value;
    const matchesDate = !dateFilter.value || (deactivation.fecha && deactivation.fecha.startsWith(dateFilter.value));
    const matchesCore = !currentNucleos.value || deactivation.militante?.core == currentNucleos.value;
    return matchesSearch && matchesReason && matchesDate && matchesCore;
  });
});

// Métodos
const openAddModal = () => {
  currentDeactivation.value = {
    id: null,
    motivo: '',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'pending',
    militante: '',
    notas: ''
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedDeactivation.value = null;
};

const saveDeactivation = async () => {
  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const member = availableMembers.value.find(m => m.id === currentDeactivation.value.militante);
    if (!member) {
      toast.error('Debe seleccionar un miembro');
      isLoading.value = false;
      return;
    }
    const newDeactivation = {
      id: Date.now(),
      motivo: currentDeactivation.value.motivo,
      fecha: currentDeactivation.value.fecha,
      estado: 'pending',
      militante: member,
    };
    actions.militants.deactiveMili(newDeactivation);
    toast.success('Desactivación creada correctamente');
    closeModal();
  } catch (error) {
    toast.error('Error al crear la desactivación');
  } finally {
    isLoading.value = false;
  }
};

const confirmDeactivation = async (id: number) => {
  if (confirm('¿Está seguro de que desea confirmar esta desactivación?')) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const deactivation = deactivations.value.find(d => d.id === id);
      if (deactivation) {
        deactivation.estado = 'confirmed';
        toast.success('Desactivación confirmada correctamente');
      }
    } catch (error) {
      toast.error('Error al confirmar la desactivación');
    }
  }
};

const reactivateMember = async (id: number) => {
  if (confirm('¿Está seguro de que desea reactivar este miembro?')) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const deactivation = deactivations.value.find(d => d.id === id);
      if (deactivation) {
        deactivation.estado = 'reactivated';
        deactivation.reactivationDate = new Date().toISOString().split('T')[0];
        toast.success('Miembro reactivado correctamente');
      }
    } catch (error) {
      toast.error('Error al reactivar el miembro');
    }
  }
};

const viewDeactivationDetails = (deactivation: any) => {
  selectedDeactivation.value = deactivation;
  showDetailsModal.value = true;
};

const getReasonText = (reason: string) => {
  const texts: Record<string, string> = {
    retirement: 'Jubilación',
    resignation: 'Renuncia',
    disciplinary: 'Acción Disciplinaria',
    transfer_out: 'Traslado Externo',
    other: 'Otro'
  };
  return texts[reason] || reason;
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-red-100 text-red-800',
    reactivated: 'bg-green-100 text-green-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    reactivated: 'Reactivado'
  };
  return texts[status] || status;
};

// Inicialización
onMounted(() => {
  availableMembers.value = members;
});
</script>

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

    {{ desactivations }}
    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg border shadow-sm">
      <div class="flex gap-4 items-center">
        <div class="flex-1">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nombre del miembro..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <select v-model="currentNucleos" class="px-3 py-2 border border-gray-300 rounded-md">
          <option value="">Todos los núcleos</option>
          <option v-for="core in cores" :key="core.id" :value="core.id">{{ core.name }}</option>
        </select>
        <select
          v-model="reasonFilter"
          class="px-3 py-2 border border-gray-300 rounded-md"
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
          class="px-3 py-2 border border-gray-300 rounded-md "
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
                Militante
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
            <tr v-for="deactivation in filteredDeactivations" :key="deactivation.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ deactivation.militante?.name }}</div>
                <div class="text-sm text-gray-500">CI: {{ deactivation.militante?.ci }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ getReasonText(deactivation.motivo) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ deactivation.fecha }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ deactivation.militante?.core }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(deactivation.estado)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusText(deactivation.estado) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="viewDeactivationDetails(deactivation)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Ver Detalles
                </button>
                <button
                  v-if="deactivation.estado === 'pending'"
                  @click="confirmDeactivation(deactivation.id)"
                  class="text-green-600 hover:text-green-900 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  v-if="deactivation.estado === 'confirmed' && deactivation.motivo !== 'disciplinary'"
                  @click="reactivateMember(deactivation.id)"
                  class="text-orange-600 hover:text-orange-900 transition-colors"
                >
                  Reactivar
                </button>
              </td>
            </tr>
            <tr v-if="desactivations?.data.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500">No hay desactivaciones registradas.</td>
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
              v-model="currentDeactivation.militante"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md "
            >
              <option value="">Seleccionar miembro</option>
              <option v-for="member in members" :key="member.id" :value="member.id">
                {{ member.firstname }} {{ member.lastname }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo de Desactivación</label>
            <select
              v-model="currentDeactivation.motivo"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              v-model="currentDeactivation.fecha"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
            <textarea
              v-model="currentDeactivation.notas"
              rows="3"
              placeholder="Información adicional sobre la desactivación..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            ></textarea>
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
              <p class="text-sm text-gray-900">{{ selectedDeactivation.militante?.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CI</label>
              <p class="text-sm text-gray-900">{{ selectedDeactivation.militante?.ci }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Motivo</label>
              <p class="text-sm text-gray-900">{{ getReasonText(selectedDeactivation.motivo) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha</label>
              <p class="text-sm text-gray-900">{{ selectedDeactivation.fecha }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <span :class="getStatusBadgeClass(selectedDeactivation.estado)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getStatusText(selectedDeactivation.estado) }}
            </span>
          </div>

          <div v-if="selectedDeactivation.reactivationDate">
            <label class="block text-sm font-medium text-gray-700">Fecha de Reactivación</label>
            <p class="text-sm text-gray-900">{{ selectedDeactivation.reactivationDate }}</p>
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