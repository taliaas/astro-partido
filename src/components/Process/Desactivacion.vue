<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
import { actions } from 'astro:actions';
import { Eye, MoreVerticalIcon, Pencil } from 'lucide-vue-next';
import { ref, computed, onMounted, reactive } from 'vue'
import { toast } from "vue-sonner";
import {navigate} from "astro:transitions/client";

const { cores, desactivations, members } = defineProps<{
  cores: any[];
  desactivations: any;
  members: any[];
}>();

const currentNucleos = ref('');
const searchTerm = ref('');
const reasonFilter = ref('');
const showModal = ref(false);
const showDetailsModal = ref(false);
const isLoading = ref(false);

const selectedDeactivation = ref<null | {
  id: number | null;
  motivo: string;
  details: string;
  fecha: string;
  estado: string;
  militante: any;
}>(null);

const availableMembers = ref<any[]>([]);

const currentDeactivation = ref({
  id: null,
  motivo: '',
  fecha: '',
  estado: 'APROBADA',
  militante: '',
  details: ''
});

// Computed
const filteredDeactivations = computed(() => {
  if (!desactivations?.data) return [];
  return desactivations.data.filter((deactivation: any) => {
    const member = deactivation.militante || {};
    const fullName = `${member.firstname || ''} ${member.lastname || ''}`.toLowerCase();
    const matchesSearch = !searchTerm.value || fullName.includes(searchTerm.value.toLowerCase());
    const matchesCore = !currentNucleos.value || member.core === currentNucleos.value;
    const matchesReason = !reasonFilter.value || deactivation.motivo === reasonFilter.value;

    return matchesSearch && matchesCore && matchesReason;
  });
});

// Métodos
const openAddModal = () => {
  currentDeactivation.value = {
    id: null,
    motivo: '',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'APROBADA',
    militante: '',
    details: ''
  };
  showModal.value = true;
};

const editModal = (deactivation: any) => {
  currentDeactivation.value = {
    id: null,
    motivo: deactivation.motivo,
    fecha: deactivation.fecha,
    estado: deactivation.status,
    militante: deactivation.militante.name,
    details: deactivation.details
  };
  showModal.value = true;
}

const viewDeactivationDetails = (deactivation: any) => {
  selectedDeactivation.value = deactivation;
  showDetailsModal.value = true;
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
      motivo: currentDeactivation.value.motivo,
      details: currentDeactivation.value.details, 
      fecha: currentDeactivation.value.fecha,
      estado: currentDeactivation.value.estado,
      militante: member,
    };
    await actions.militants.deactiveMili(newDeactivation);
    toast.success('Desactivación creada correctamente');
    showModal.value = false;
    navigate("")
  } catch (error) {
    toast.error('Error al crear la desactivación');
  } finally {
    isLoading.value = false;
  }
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
            <tr v-for="deactivation in filteredDeactivations" :key="deactivation.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ deactivation.militante?.firstname }} {{ deactivation.militante?.lastname }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{deactivation.motivo }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ deactivation.fecha }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {{ deactivation.militante?.core.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="deactivation.estado" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ deactivation.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <!--acciones que se deben ejecutar-->
                <DropdownMenu>
                      <DropdownMenuTrigger class="focus:outline-none">
                        <Button
                            variant="ghost"
                            size="icon"
                            class="rounded-full"
                        >
                          <MoreVerticalIcon class="h-4 w-4"/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="showDetailsModal = true">
                          <Eye class="h-4 w-4"/>
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="editModal(deactivation)">
                          <Pencil class="h-4 w-4"/>
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
              </td>
            </tr>
            <tr v-if="filteredDeactivations?.length === 0">
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
          <button @click="showModal = false;" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveDeactivation" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Militante</label>
            <select
              v-model="currentDeactivation.militante"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md "
            >
              <option value="">Seleccionar militante</option>
              <option v-for="member in members" :key="member.id" :value="member.id">
                {{ member.firstname }} {{ member.lastname }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo de Desactivación</label>
            <input
              v-model="currentDeactivation.motivo"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
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
              v-model="currentDeactivation.details"
              rows="3"
              placeholder="Información adicional sobre la desactivación..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4">
            
            <button
              type="button"
              @click="showModal = false;"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 bg-primary hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
            >
              {{ isLoading ? 'Procesando...' : 'Crear Desactivación' }}
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
              <label class="block text-sm font-medium text-gray-700">Militante</label>
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
              <p class="text-sm text-gray-900">{{ selectedDeactivation.motivo }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Detalles</label>
              <p class="text-sm text-gray-900">{{ selectedDeactivation.details }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha</label>
              <p class="text-sm text-gray-900">{{ selectedDeactivation.fecha }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <span :class="selectedDeactivation.estado" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ selectedDeactivation.estado }}
            </span>
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