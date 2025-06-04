<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Sanciones</h2>
        <p class="text-gray-600">
          Administra las sanciones disciplinarias de los miembros
        </p>
      </div>
      <button
        @click="openAddModal"
        class="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        Nueva Sanción
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
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="completed">Completadas</option>
          <option value="suspended">Suspendidas</option>
        </select>
        <select
          v-model="selectNucleo"
          class="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">Todos los núcleos</option>
          <option
            v-for="nucleo in nucleos"
            :key="nucleo.id"
            :value="nucleo.id"
          >
            {{ nucleo.nombre }}
          </option>
        </select>
      </div>
    </div>

    <!-- Lista de Sanciones -->
    <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Militante
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Motivo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha Inicio
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Duración
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="sanction in filteredSanctions"
              :key="sanction.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">
                  {{ sanction.memberName }}
                </div>
                <div class="text-sm text-gray-500">
                  CI: {{ sanction.memberCI }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs">
                  {{ sanction.reason }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(sanction.startDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ sanction.duration }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusBadgeClass(sanction.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusText(sanction.status) }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-md font-medium space-x-2 text-center"
              >
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
                    <DropdownMenuItem >
                      <Eye class="h-4 w-4"/>
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="editSanction(sanction)">
                      <Pencil class="h-4 w-4"/>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        class="text-red-600 border-t focus:text-red-600"
                    >
                      <TrashIcon class="h-4 w-4"/>
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredSanctions.length === 0" class="text-center py-8 text-gray-500 text-lg">
          No hay sanciones.
        </div>
      </div>
    </div>

    <!-- Modal para Agregar/Editar Sanción -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            {{ isEditing ? "Editar Sanción" : "Nueva Sanción" }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XIcon class="h-4 w-4"/>
          </button>
        </div>

        <form @submit.prevent="saveSanction" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Militante</label
            >
            <select
              v-model="currentSanction.memberId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Seleccionar militante</option>
              <option
                v-for="member in availableMembers"
                :key="member.id"
                :value="member.id"
              >
                {{ member.name }} - CI: {{ member.ci }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Motivo</label
            >
            <textarea
              v-model="currentSanction.reason"
              required
              rows="3"
              placeholder="Describe el motivo de la sanción..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Fecha de Inicio</label
            >
            <input
              v-model="currentSanction.startDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Duración</label
            >
            <select
              v-model="currentSanction.duration"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Seleccionar duración</option>
              <option value="1 mes">1 mes</option>
              <option value="3 meses">3 meses</option>
              <option value="6 meses">6 meses</option>
              <option value="1 año">1 año</option>
              <option value="Indefinida">Indefinida</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 bg-primary hover:bg-blue-400 text-white py-2 px-4 rounded-md transition-colors"
            >
              {{
                isLoading
                  ? "Guardando..."
                  : isEditing
                    ? "Actualizar"
                    : "Crear Sanción"
              }}
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Eye, MoreVerticalIcon, Pencil, TrashIcon, XIcon} from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu/index.js";
import {Button} from "@/components/ui/button/index.js";
import {toast} from "vue-sonner";
import { actions } from "astro:actions";

const { sanciones } = defineProps<{
  sanciones: any[];
}>();

// Estado reactivo
const availableMembers = ref([]);
const searchTerm = ref("");
const statusFilter = ref("all");
const showModal = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const selectNucleo = ref("all");

const currentSanction = ref({
  id: null,
  memberId: "",
  memberName: "",
  memberCI: "",
  reason: "",
  startDate: "",
  duration: "",
  status: "active",
});

// Computed
const filteredSanctions = computed(() => {
  return sanciones?.filter((sanction) => {
    const matchesSearch =
      sanction.memberName
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      sanction.memberCI.includes(searchTerm.value);
    const matchesStatus =
      statusFilter.value === "all" || sanction.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

// Métodos
const openAddModal = () => {
  isEditing.value = false;
  currentSanction.value = {
    id: null,
    memberId: "",
    memberName: "",
    memberCI: "",
    reason: "",
    startDate: new Date().toISOString().split("T")[0],
    duration: "",
    status: "active",
  };
  showModal.value = true;
};

const editSanction = (sanction) => {
  isEditing.value = true;
  currentSanction.value = { ...sanction };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
};

const saveSanction = async () => {
  isLoading.value = true;
  try {

    if (isEditing.value) {
      await actions.sancion.update()
      toast.success("Sanción actualizada correctamente");
    } else {
      await actions.sancion.createSancion()
      toast.success("Sanción creada correctamente");
    }
    closeModal();
  } catch (error) {
    toast.error("Error al guardar la sanción");
  } finally {
    isLoading.value = false;
  }
};

const deleteSanction = async (id) => {
  if (confirm("¿Está seguro de que desea eliminar esta sanción?")) {
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 500));

      sanctions.value = sanctions.value.filter((s) => s.id !== id);
      toast.success( "Sanción eliminada correctamente");
    } catch (error) {
      toast.error( "Error al eliminar la sanción");
    }
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("es-ES");
};

const getStatusBadgeClass = (status) => {
  const classes = {
    active: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
    suspended: "bg-yellow-100 text-yellow-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getStatusText = (status) => {
  const texts = {
    active: "Activa",
    completed: "Completada",
    suspended: "Suspendida",
  };
  return texts[status] || status;
};

</script>