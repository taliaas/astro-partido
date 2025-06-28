<template>
  <div class="p-2 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Traslados</h2>
        <p class="text-gray-600">
          Administra los traslados de miembros entre sucursales
        </p>
      </div>
      <div class="flex gap-2">
        <Button
          @click="openAddModal"
          class="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon class="size-4" />
          Traslado
        </Button>
        <Button @click="saveMinute">
          <UploadIcon class="size-4" />
          Documento
        </Button>
      </div>
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
          <option :value="Estado[0]">{{ Estado[0] }}</option>
          <option :value="Estado[1]">{{ Estado[1] }}</option>
        </select>
        <select
          v-model="selectNucleo"
          class="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos los núcleos</option>
          <option v-for="nucleo in cores" :key="nucleo.id" :value="nucleo.id">
            {{ nucleo.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Lista de Traslados -->
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
                Origen
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Destino
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Núcleo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="transfer in filteredTransfers"
              :key="transfer.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">
                  {{ transfer.militante.firstname }}
                  {{ transfer.militante.lastname }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                {{ transfer.origen }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                {{ transfer.destino }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                {{ format(transfer.fecha, "yyyy-MM-dd") }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                {{ transfer.militante.core.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ transfer.estado }}
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-md font-medium space-x-2"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger class="focus:outline-none">
                    <Button variant="ghost" size="icon" class="rounded-full">
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="openDetails(transfer)">
                      <Eye class="h-4 w-4" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="openEdit(transfer)">
                      <Pencil class="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
            <tr v-if="!filteredTransfers?.length">
              <td colspan="6" class="text-center py-8 text-gray-500">
                No hay traslados registrados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Nuevo Traslado -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            {{ isEdit ? "Editar Traslado" : "Nuevo Traslado" }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XIcon class="h-4 w-4" />
          </button>
        </div>

        <form @submit.prevent="saveTransfer()" class="space-y-4">
          <div>
            <label class="block text-md font-medium text-gray-700 mb-1"
              >Militante</label
            >
            <select
              name="militante"
              v-model="currentTransfer.militante.id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label class="block text-md font-medium text-gray-700 mb-1"
              >Sucursal de Origen</label
            >
            <Input
              name="origen"
              type="text"
              v-model="currentTransfer.origen"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label class="block text-md font-medium text-gray-700 mb-1"
              >Sucursal de Destino</label
            >
            <Input
              type="text"
              name="destino"
              v-model="currentTransfer.destino"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            </Input>
          </div>

          <div>
            <label class="block text-md font-medium text-gray-700 mb-1"
              >Motivo del Traslado</label
            >
            <textarea
              v-model="currentTransfer.details"
              name="details"
              required
              rows="3"
              placeholder="Describe el motivo del traslado..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-md font-medium text-gray-700 mb-1"
              >Fecha
            </label>
            <input
              v-model="currentTransfer.fecha"
              name="fecha"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div class="flex gap-3 pt-4 justify-end">
            <Button
              type="button"
              @click="closeModal"
              class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              :disabled="isLoading"
              :loading="isLoading"
              class="bg-primary"
            >
              {{
                isLoading
                  ? "Guardando..."
                  : isEdit
                    ? "Actualizar"
                    : "Crear Traslado"
              }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Detalles del Traslado</h3>
          <button
            @click="closeDetailsModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <XIcon class="h-4 w-4" />
          </button>
        </div>

        <div v-if="selectedTransfer" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-md font-medium text-gray-700"
                >Militante</label
              >
              <div class="flex justify-between">
                <p class="text-md text-gray-900">
                  {{ selectedTransfer.militante.firstname }}
                  {{ selectedTransfer.militante.lastname }}
                </p>
                <p class="text-md text-gray-900">
                  CI: {{ selectedTransfer.militante.ci }}
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-md font-medium text-gray-700"
                >Origen</label
              >
              <p class="text-md text-gray-900">{{ selectedTransfer.origen }}</p>
            </div>
            <div>
              <label class="block text-md font-medium text-gray-700"
                >Destino</label
              >
              <p class="text-md text-gray-900">
                {{ selectedTransfer.destino }}
              </p>
            </div>
          </div>

          <div>
            <label class="block text-md font-medium text-gray-700"
              >Motivo</label
            >
            <p class="text-md text-gray-900">{{ selectedTransfer.details }}</p>
          </div>
          <div>
            <label class="block text-md font-medium text-gray-700"
              >Fecha de Solicitud</label
            >
            <p class="text-md text-gray-900">
              {{ format(selectedTransfer.fecha, "yyyy-MM-dd") }}
            </p>
          </div>
          <div>
            <label class="block text-md font-medium text-gray-700"
              >Estado</label
            >
            <span
              :class="selectedTransfer.estado"
              class="py-1 text-md rounded-full"
            >
              {{ selectedTransfer.estado }}
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

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue";
import Input from "@/components/ui/input/Input.vue";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { format } from "date-fns";
import { Eye, MoreVerticalIcon, Pencil, PlusIcon, UploadIcon, XIcon } from "lucide-vue-next";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";

const { traslados, members, cores } = defineProps<{
  traslados: any;
  members: any[];
  cores: any;
}>();

// Estado reactivo
const searchTerm = ref("");
const statusFilter = ref("");
const showModal = ref(false);
const showDetailsModal = ref(false);
const isLoading = ref(false);
const selectNucleo = ref("");
const isEdit = ref(false);

const Estado = ["Pendiente", "Completado"] as const;

const selectedTransfer = ref({
  origen: "",
  destino: "",
  details: "",
  militante: { id: 0, firstname: "", lastname: "", ci: "" },
  fecha: "",
  estado: Estado[0],
});

const currentTransfer = ref({
  origen: "",
  destino: "",
  details: "",
  militante: { id: "" },
  fecha: new Date(),
  estado: Estado[0],
});

// Computed
const filteredTransfers = computed(() => {
  return traslados.data.filter((transfer: any) => {
    const matchesSearch =
      transfer?.militante.firstname
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      transfer.militante.lastname.includes(searchTerm.value);
    const matchedCores =
      selectNucleo.value === "" ||
      transfer?.militante.core.id === selectNucleo.value;
    const matchesStatus =
      statusFilter.value === "" || transfer.estado === statusFilter.value;
    return matchesSearch && matchesStatus && matchedCores;
  });
});

// Métodos
const openAddModal = () => {
  currentTransfer.value = {
    origen: "",
    destino: "",
    details: "",
    militante: { id: "" },
    fecha: new Date(),
    estado: Estado[0],
  };
  showModal.value = true;
};

const openDetails = (transfer: any) => {
  selectedTransfer.value = {
    ...transfer,
  };
  showDetailsModal.value = true;
};

const openEdit = (transfer: any) => {
  isEdit.value = true;
  currentTransfer.value = {
    ...transfer,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEdit.value = false;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedTransfer.value = {
    origen: "",
    destino: "",
    details: "",
    militante: { id: 0, firstname: "", lastname: "", ci: "" },
    fecha: "",
    estado: Estado[0],
  };
};

const saveTransfer = async () => {
  isLoading.value = true;
  try {
    if (!isEdit.value) {
      console.log(currentTransfer.value);
      await actions.transfer.createTransfer(currentTransfer.value as any);
      toast.success("Traslado creado correctamente");
    } else {
      await actions.transfer.updateTransfer(currentTransfer.value as any);
      toast.success("El traslado fue editado correctamente");
    }
    closeModal();
    navigate("");
  } catch (error) {
    toast.error("Error al guardar el traslado");
  } finally {
    isLoading.value = false;
  }
};

const saveMinute = async () => {

}
</script>
