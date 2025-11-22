<template>
  <div class="p-2 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Sanciones</h2>
        <p class="text-gray-600">
          Administra las sanciones disciplinarias de los miembros
        </p>
      </div>
      <div class="flex gap-2">
        <Button
        @click="openAddModal"
        class="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <PlusIcon class="size-4" />
         Sanción
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos los estados</option>
          <option v-for="stat in EstadoSancion" :key="stat" :value="stat">
            {{ stat }}
          </option>
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
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha Inicio
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Duración
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Núcleo
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
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
              v-for="sanction in filteredSanctions"
              :key="sanction.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">
                  {{ sanction.militante.firstname }}
                  {{ sanction.militante.lastname }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs">
                  {{ sanction.causa }}
                </div>
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
              >
                {{ sanction.fecha }}
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
              >
                <div v-if="sanction.duracion > 1">
                  {{ sanction.duracion }} meses
                </div>
                <div v-else>{{ sanction.duracion }} mes</div>
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
              >
                {{ sanction.militante.core.name }}
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ sanction.estado }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-lg font-medium space-x-2 text-center"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger class="focus:outline-none">
                    <Button variant="ghost" size="icon" class="rounded-full">
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="openDetails(sanction)">
                      <Eye class="h-4 w-4" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="editSanction(sanction)">
                      <Pencil class="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="!filteredSanctions?.length"
          class="text-center py-8 text-gray-500 text-lg"
        >
          No hay sanciones
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
            <XIcon class="h-4 w-4" />
          </button>
        </div>

        <form @submit.prevent="saveSanction" class="space-y-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Militante</label
            >
            <select
              v-model="currentSanction.militante.id"
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
              >Motivo</label
            >
            <textarea
              v-model="currentSanction.causa"
              required
              rows="3"
              placeholder="Describe el motivo de la sanción..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div class="flex gap-2 *:flex-1">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Fecha de Inicio</label
              >
              <input
                v-model="currentSanction.fecha"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Duración</label
              >
              <select
                v-model="currentSanction.duracion"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="0">Seleccionar duración</option>
                <option value="1">1 mes</option>
                <option value="3">3 meses</option>
                <option value="6">6 meses</option>
                <option value="12">1 año</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Severidad</label
            >
            <select
              v-model="currentSanction.severidad"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Seleccione la severidad</option>
              <option value="LEVE">Leve</option>
              <option value="MEDIA">Media</option>
              <option value="GRAVE">Grave</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Detalles</label
            >
            <textarea
              v-model="currentSanction.details"
              required
              rows="3"
              placeholder="Escriba los detalles de la sanción..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div class="flex gap-3 justify-end">
            <Button type="button" @click="closeModal" variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" :disabled="isLoading" :loading="isLoading">
              {{
                isLoading
                  ? "Guardando..."
                  : isEditing
                    ? "Actualizar"
                    : "Crear Sanción"
              }}
            </Button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">Detalles de la Sanción</h3>
          <button
            @click="closeDetailsModal"
            class="text-gray-400 hover:text-gray-600"
          >
          <XIcon class="h-4 w-4" />
        </button>
        </div>

        <div v-if="selectSanction" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-lg font-medium text-gray-700"
                >Militante</label
              >
              <div class="flex justify-between">
                <p class="text-lg text-gray-900">
                  {{ selectSanction.militante.firstname }}
                  {{ selectSanction.militante.lastname }}
                </p>
                <p>CI: {{ selectSanction.militante.ci }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-lg font-medium text-gray-700"
                >Causa</label
              >
              <p class="text-lg text-gray-900">{{ selectSanction.causa }}</p>
            </div>
            <div>
              <label class="block text-lg font-medium text-gray-700"
                >Severidad</label
              >
              <p class="text-lg text-gray-900">
                {{ selectSanction.severidad }}
              </p>
            </div>
          </div>
          <div class="pb-2">
            <label class="block text-lg font-medium text-gray-700"
              >Detalles</label
            >
            <p class="text-sm text-gray-900">
              {{ selectSanction.details }}
            </p>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-lg font-medium text-gray-700"
                >Fecha de Solicitud</label
              >
              <p class="text-lg text-gray-900">
                {{ format(selectSanction.fecha, "yyyy-MM-dd") }}
              </p>
            </div>
            <div>
              <label class="block text-lg font-medium text-gray-700"
                >Duración</label
              >
              <p class="text-lg text-gray-900">
                <div v-if="selectSanction.duracion > 1">
                  {{ selectSanction.duracion }} meses
                </div>
                <div v-else>{{ selectSanction.duracion }} mes</div>
              </p>
            </div>
          </div>
          <div>
            <label class="block text-lg font-medium text-gray-700"
              >Estado</label
            >
            <span
              :class="selectSanction.estado"
              class="py-1 text-lg rounded-full"
            >
              {{ selectSanction.estado }}
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

     <!-- Upload Dialog -->
    <Dialog :open="showUploadDialog" @update:open="showUploadDialog = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cargar documento</DialogTitle>
          <DialogDescription>
            Seleccione o arrastre los archivos que desea cargar
          </DialogDescription>
        </DialogHeader>

        <!-- Área de arrastre de archivos -->
        <div class="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center transition-colors duration-200"
             :class="{ 'border-blue-500 bg-blue-50': isDragging }" @drop.prevent="handleFileDrop"
             @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @dragenter.prevent>
          <UploadCloudIcon class="mx-auto h-12 w-12 transition-colors duration-200"
                           :class="isDragging ? 'text-blue-600' : 'text-gray-400'"/>
          <p class="mt-2 text-sm text-gray-600">
            <span class="font-medium hover:text-gray-700">
              Arrastre archivos aquí
            </span>
            o
            <button @click="$refs.fileInput.click()" class="font-medium text-blue-600 hover:text-blue-500">
              seleccione desde su dispositivo
            </button>
          </p>
          <p class="mt-1 text-xs text-gray-500">DOCX, PDF, hasta 10MB por archivo</p>
          <input ref="fileInput" type="file" multiple accept=".pdf,.docx" class="hidden" @change="handleFileSelect"/>
        </div>

        <!-- Lista de archivos -->
        <div v-if="uploadedFiles.length > 0" class="space-y-3 max-h-32 overflow-y-auto">
          <div v-for="(file, index) in uploadedFiles" :key="index"
               class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded flex items-center justify-center">
                <FileTextIcon class="size-5"/>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <button @click="removeFile(file.name)" class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600">
              <Trash2Icon class="size-4"/>
            </button>
          </div>
        </div>

        <DialogFooter>
          <Button type="reset" variant="outline" @click="showUploadDialog = false">
            Cancelar
          </Button>
          <Button @click="handleDrop" :disabled="!uploadedFiles.length || loading"
                  class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" :loading>
            Cargar archivos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Eye, MoreVerticalIcon, Pencil, PlusIcon, UploadIcon, XIcon, FileTextIcon, Trash2Icon, UploadCloudIcon } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/index.js";
import { Button } from "@/components/ui/button/index.js";
import { toast } from "vue-sonner";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { format } from "date-fns";
import {Dialog, DialogFooter, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";

const { sanciones, members, cores } = defineProps<{
  sanciones: any;
  members: any[];
  cores: any[];
}>();

// Estado reactivo
const searchTerm = ref("");
const showDetailsModal = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const selectNucleo = ref("");
const statusFilter = ref("");
const EstadoSancion = ["APROBADA", "DENEGADA", "CUMPLIDA"] as const;
const showUploadDialog = ref(false);
const uploadedFiles = ref([]);
const isDragging = ref(false);
const loading = ref(false)

const currentSanction = ref({
  causa: "",
  fecha: "",
  details: "",
  severidad: "LEVE",
  duracion: 0,
  estado: EstadoSancion[0],
  militante: { id: "" },
});

const selectSanction = ref({
  causa: "",
  fecha: "",
  details: "",
  severidad: "LEVE",
  duracion: 0,
  estado: EstadoSancion[0],
  militante: { id: "", firstname: '', lastname: '', ci: '' },
});

// Computed
const filteredSanctions = computed(() => {
  return sanciones?.data?.filter((sanction: any) => {
    const matchesSearch =
      sanction?.militante.firstname
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      sanction.militante.lastname.includes(searchTerm.value);
    const matchedCores =
      selectNucleo.value === "" ||
      sanction?.militante.core.id === selectNucleo.value;
    const matchesStatus =
      statusFilter.value === "" || sanction.estado === statusFilter.value;
    return matchesSearch && matchesStatus && matchedCores;
  });
});

// Métodos
const openAddModal = () => {
  isEditing.value = false;
  currentSanction.value = {
    militante: { id: "" },
    causa: "",
    fecha: "",
    details: "",
    severidad: "",
    duracion: 0,
    estado: EstadoSancion[0],
  };
  showModal.value = true;
};

const openDetails = (sancion: any) => {
  selectSanction.value = {
    ...sancion,
  };
  showDetailsModal.value = true;
};

const editSanction = (sanction: any) => {
  isEditing.value = true;
  currentSanction.value = { ...sanction };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectSanction.value = {
    militante:  { id: "", firstname: '', lastname: '', ci: '' },
    causa: "",
    fecha: "",
    details: "",
    severidad: "",
    duracion: 0,
    estado: EstadoSancion[0],
  };
};

const saveSanction = async () => {
  isLoading.value = true;
  try {
    if (isEditing.value) {
      await actions.sancion.updateSancion(currentSanction.value as any);
      toast.success("Sanción actualizada correctamente");
    } else {
      await actions.sancion.createSancion(currentSanction.value as any);
      toast.success("Sanción creada correctamente");
    }
    closeModal();
    navigate("");
  } catch (error) {
    toast.error("Error al guardar la sanción");
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const saveMinute = async () => {
  showUploadDialog.value = true
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  uploadedFiles.value = [...uploadedFiles.value, ...files];
};

const handleFiles = (files) => {
  uploadedFiles.value = [...uploadedFiles.value, ...files];
}

const handleFileDrop = (e) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  handleFiles(files)
}

</script>
