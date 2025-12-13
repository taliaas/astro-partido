<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  Eye,
  MoreVerticalIcon,
  Pencil,
  PlusIcon,
  UploadIcon,
  XIcon,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const { cores, desactivations, members } = defineProps<{
  cores: any;
  desactivations: any;
  members: any;
}>();
const EstadoDesactivacion = ["APROBADA", "RECHAZADA"] as const;

const currentNucleos = ref("");
const searchTerm = ref("");
const showModal = ref(false);
const showDetailmdodal = ref(false);
const isLoading = ref(false);
const isEditing = ref(false);
const statusFilter = ref("");

const selectedDeactivation = ref({
  motivo: "",
  fecha: "",
  estado: EstadoDesactivacion[0],
  militante: { id: "", firstname: "", lastname: "", ci: "" },
  details: "",
});

const currentDeactivation = ref({
  motivo: "",
  fecha: "",
  estado: EstadoDesactivacion[0],
  militante: { id: "" },
  details: "",
});

const filteredDeactivations = computed(() => {
  if (!desactivations?.data) return [];
  return desactivations.data.filter((deactivation: any) => {
    const matchesSearch =
      deactivation?.militante.firstname
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      deactivation.militante.lastname.includes(searchTerm.value) ||
      deactivation?.motivo.includes(searchTerm.value);
    const matchesCore =
      !currentNucleos.value ||
      deactivation.militante.core.id === currentNucleos.value;
    const matchesStatus =
      statusFilter.value === "" || deactivation.estado === statusFilter.value;
    return matchesSearch && matchesCore && matchesStatus;
  });
});

// Métodos
const openAddModal = () => {
  currentDeactivation.value = {
    motivo: "",
    fecha: "",
    estado: EstadoDesactivacion[0],
    militante: { id: "" },
    details: "",
  };
  showModal.value = true;
};

const editModal = (deactivation: any) => {
  isEditing.value = true;
  currentDeactivation.value = {
    ...deactivation,
  };
  showModal.value = true;
};

const viewDeactivationDetails = (deactivation: any) => {
  selectedDeactivation.value = { ...deactivation };
  showDetailmdodal.value = true;
};

const closeDetailmdodal = () => {
  showDetailmdodal.value = false;
  selectedDeactivation.value = {
    motivo: "",
    fecha: "",
    estado: EstadoDesactivacion[0],
    militante: { id: "", firstname: "", lastname: "", ci: "" },
    details: "",
  };
};

const saveDeactivation = async () => {
  isLoading.value = true;
  try {
    if (!isEditing.value) {
      await actions.militants.deactiveMili(currentDeactivation.value as any);
      toast.success("Desactivación creada correctamente");
    } else {
      await actions.militants.updateDeactivation(
        currentDeactivation.value as any
      );
      toast.success("Desactivación actualizada correctamente");
    }
    showModal.value = false;
    navigate("");
  } catch (error) {
    toast.error("Error al crear la desactivación");
  } finally {
    isLoading.value = false;
  }
};

const saveMinute = async () => {};
</script>

<template>
  <div class="p-2 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          Gestión de Desactivaciones
        </h2>
        <p class="text-gray-600">
          Administra las desactivaciones de miembros de la organización
        </p>
      </div>
      <div class="flex gap-2">
        <Button
          @click="openAddModal"
          class="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon class="size-4" />
          Desactivación
        </Button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg border shadow-md">
      <div class="flex gap-4 items-center">
        <div class="flex-1">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nombre del miembro..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos los estados</option>
          <option v-for="stat in EstadoDesactivacion" :key="stat" :value="stat">
            {{ stat }}
          </option>
        </select>
        <select
          v-model="currentNucleos"
          class="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos los núcleos</option>
          <option v-for="core in cores" :key="core.id" :value="core.id">
            {{ core.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Lista de Desactivaciones -->
    <div class="bg-white rounded-lg border shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Militante
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Motivo
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Núcleo
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="deactivation in filteredDeactivations"
              :key="deactivation.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">
                  {{ deactivation.militante?.firstname }}
                  {{ deactivation.militante?.lastname }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{
                  deactivation.motivo
                }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ deactivation.fecha }}
              </td>
              <td
                class="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900"
              >
                {{ deactivation.militante?.core.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="deactivation.estado"
                  class="py-1 text-sm rounded-full"
                >
                  {{ deactivation.estado }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm font-medium space-x-2"
              >
                <!--acciones que se deben ejecutar-->
                <DropdownMenu>
                  <DropdownMenuTrigger class="focus:outline-none">
                    <Button variant="ghost" size="icon" class="rounded-full">
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      @click="viewDeactivationDetails(deactivation)"
                    >
                      <Eye class="h-4 w-4" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="editModal(deactivation)">
                      <Pencil class="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
            <tr v-if="filteredDeactivations?.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500">
                No hay desactivaciones registradas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Nueva Desactivación -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Nueva Desactivación</h3>
          <button
            @click="showModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XIcon class="h-4 w-4" />
          </button>
        </div>

        <form @submit.prevent="saveDeactivation" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Militante</label
            >
            <select
              v-model="currentDeactivation.militante.id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Seleccionar militante</option>
              <option
                v-for="member in members"
                :key="member.id"
                :value="member.id"
              >
                {{ member.firstname }} {{ member.lastname }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Motivo de Desactivación</label
            >
            <input
              v-model="currentDeactivation.motivo"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Fecha de Desactivación</label
            >
            <input
              v-model="currentDeactivation.fecha"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Notas Adicionales</label
            >
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
              @click="showModal = false"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 bg-primary hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
            >
              {{ isLoading ? "Procesando..." : "Crear Desactivación" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div
      v-if="showDetailmdodal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Detalles de la Desactivación</h3>
          <button
            @click="closeDetailmdodal"
            class="text-gray-400 hover:text-gray-600"
          >
            <XIcon class="h-4 w-4" />
          </button>
        </div>

        <div v-if="selectedDeactivation" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Militante</label
              >
              <p class="text-sm text-gray-900">
                {{ selectedDeactivation.militante?.firstname }}
                {{ selectedDeactivation.militante?.lastname }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CI</label>
              <p class="text-sm text-gray-900">
                {{ selectedDeactivation.militante?.ci }}
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Motivo</label
            >
            <p class="text-sm text-gray-900">
              {{ selectedDeactivation.motivo }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Detalles</label
            >
            <p class="text-sm text-gray-900">
              {{ selectedDeactivation.details }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Fecha</label>
            <p class="text-sm text-gray-900">
              {{ selectedDeactivation.fecha }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Estado</label
            >
            <span
              :class="selectedDeactivation.estado"
              class="y-1 text-sm rounded-full"
            >
              {{ selectedDeactivation.estado }}
            </span>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button
            @click="closeDetailmdodal"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
