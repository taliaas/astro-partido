<template>
  <div class="min-h-screen bg-linear-to-b from-gray-50 to-white dark:bg-zinc-800">
    <div class="max-w-[1600px] mx-auto p-6">
      <!-- Main Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <!-- Header Section -->
        <div class="p-8 border-b border-gray-100">
          <div class="flex flex-col space-y-1">
            <h1 class="text-3xl font-bold text-gray-900">Control de Actas</h1>
            <p class="text-gray-500">
              Gestión y seguimiento de documentación oficial
            </p>
          </div>
        </div>

        <!-- Content Area -->
        <div class="divide-y divide-gray-100">
          <!-- Actions Bar -->
          <div class="p-6" v-if="hasPermission('Documentos', 'create')">
            <div class="flex justify-between items-center">
              <div class="flex gap-3">
                <Button variant="outline" @click="showUploadDialog = true">
                  Cargar acta
                </Button>
              </div>
              <div class="flex gap-3">
                <a href="/addRO" class="flex gap-2 text-white rounded text-sm font-medium px-4 py-2 mr-4 bg-button">
                  <PlusIcon class="h-4 w-4 mr-2"/>
                  Ordinaria
                </a>
                <a href="/addCP" class="px-4 py-2 mr-4 flex bg-button gap-2 text-white rounded text-sm font-medium">
                  <PlusIcon class="h-4 w-4 mr-2"/>
                  C. Político
                </a>
              </div>
            </div>
          </div>

          <!-- Improved Filters -->
          <div class="p-6 bg-gray-50/50">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <div class="relative">
                  <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input id="search" v-model="filters.search" placeholder="Buscar por nombre..." class="pl-9"/>
                </div>
              </div>
              <div class="gap-4 flex">
                <select v-model="selectType" class="rounded-md border px-3 py-2 mx-1.5 text-sm w-full">
                  <option value="">Todas las actas</option>
                  <option v-for="type in typeMinutes" :key="type" :value="type">
                    {{ type === 'ro' ? 'Acta Ordinaria' : type === 'cp' ? 'Círculo Político' : type }}
                  </option>
                </select>
                <!-- Nucleo -->
                <select v-model="selectedNucleo" class="rounded-md border px-3 py-2 mx-1.5 text-sm w-full">
                  <option value="">Todos los núcleos</option>
                  <option v-for="nucleo in nucleos" :key="nucleo" :value="nucleo">
                    {{ nucleo }}
                  </option>
                </select>
                <!-- Status -->
                <select v-model="selectedStatus" class="rounded-md border px-3 py-2 mx-1.5 text-sm w-full">
                  <option value="">Todos los estados</option>
                  <option v-for="status in statuses" :key="status" :value="status">

                    {{ status }}
                  </option>
                </select>
                <!-- Date -->
                <input type="month" v-model="selectFecha" class="border rounded-md p-2"></input>
              </div>
            </div>
          </div>

          <!-- Enhanced Table -->
          <div class="overflow-x-auto p-6">
            <Table class="p-2">
              <TableHeader class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <TableRow>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ tableHeaders[0] }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ tableHeaders[1] }}
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ tableHeaders[2] }}
                  </th>
                  <th :data-sort="sort" @click="handleSort"
                      class="group cursor-pointer px-6 py-3 flex text-left text-xs font-medium text-gray-500 uppercase tracking-wider justify-between">
                    {{ tableHeaders[3] }}
                    <ArrowUp v-if="sort === 'DESC' || sort === null" class="w-4 h-4"
                             :class="{ 'stroke-blue-500': sort === 'DESC' }"/>
                    <ArrowDown v-if="sort === 'ASC'" class="w-4 h-4 stroke-blue-500"/>
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ tableHeaders[4] }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(acta, index) in filteredActas" :key="acta.id"
                          class="hover:bg-gray-50/50 transition-colors duration-200">
                  <TableCell class="font-medium pl-8">{{ index + 1 }}</TableCell>
                  <TableCell class="pl-6">{{ acta.name }}</TableCell>
                  <TableCell class=" pl-6 text-left"> {{ acta.core?.name }}</TableCell>
                  <TableCell class="text-left">{{ acta.fecha }}</TableCell>
                  <TableCell class="text-center">
                    <Badge :class="getStatusClass(acta.status)">
                      <Loader2 v-if="acta.status === 'Procesando'" class="animate-spin"/>
                      {{ acta.status }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger class="focus:outline-none">
                        <Button variant="ghost" size="icon" class="rounded-full">
                          <MoreVerticalIcon class="h-4 w-4"/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="handleAction('ver', acta)">
                          <Eye class="h-4 w-4"/>
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="handleAction('editar', acta)"
                                          v-if="hasPermission('Documentos', 'update') && !acta.isLoaded  ">
                          <Pencil class="h-4 w-4"/>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem v-if="
                          acta.type === 'ro' &&
                          acta.status === 'Procesada'
                        " @click="handleAction('procesar', acta)">
                          <Edit class="h-4 w-4"/>
                          Procesar
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="handleAction('export', acta)"
                                          v-if="hasPermission('Documentos', 'export')">
                          <Download class="h-4 w-4"/>
                          Exportar
                        </DropdownMenuItem>
                        <DropdownMenuItem v-if="hasPermission('Documentos', 'delete')"
                                          @click="handleAction('eliminar', acta)"
                                          class="text-red-600 border-t focus:text-red-600">
                          <TrashIcon class="h-4 w-4"/>
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <!-- Empty State -->
            <div v-if="filteredActas?.length === 0" class="text-center py-16">
              <div class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center">
                <SearchIcon class="h-6 w-6"/>
              </div>
              <h3 class="mt-4 text-sm font-medium text-gray-900">
                No se encontraron actas
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Ajuste los filtros o cree una nueva acta para comenzar.
              </p>
            </div>

            <div class="flex justify-between">
              <div v-if="actas?.total === 0"></div>
              <div v-else class="text-md text-muted-foreground p-4">
                Mostrando <span class="font-medium">{{ page || 1 }}</span> de <span class="font-medium">{{
                  actas?.total || 1
                }}</span> páginas
              </div>
              <div class="flex justify-end gap-4 p-4">
                <button class="rounded-md border px-3 py-1" :disabled="currentPage === 1"
                        :class="{ 'bg-muted': currentPage === 1 }" @click="goToPreviousPage">
                  Anterior
                </button>
                <button class="rounded-md border px-3 py-1" :disabled="currentPage >= hasNextPage"
                        :class="{ 'bg-muted': currentPage >= hasNextPage }" @click="goToNextPage">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Dialog -->
    <Dialog :open="showUploadDialog" @update:open="showUploadDialog = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cargar actas</DialogTitle>
          <DialogDescription>
            Seleccione o arrastre los archivos que desea cargar
          </DialogDescription>
        </DialogHeader>

        <!-- Selector de tipo de acta (obligatorio) -->
        <div class="">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Seleccione el tipo de acta: <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-3 text-sm">
            <label :class="[
              'flex items-center justify-center border rounded-md cursor-pointer flex-1',
              tipoActa === 'ro'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]">
              <input type="radio" name="tipoActa" value="ro" v-model="tipoActa" class="sr-only"/>
              Acta Ordinaria
            </label>
            <label :class="[
              'flex items-center justify-center py-1.5 border rounded-md cursor-pointer flex-1',
              tipoActa === 'cp'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]">
              <input type="radio" name="tipoActa" value="cp" v-model="tipoActa" class="sr-only"/>
              Círculo Político
            </label>
          </div>
          <label class="block text-sm font-medium text-gray-700 mb-2 mt-2">
            Seleccione el tipo de procesamiento:
          </label>
          <div class="space-x-2 ">
            <Button @click="mode = 'spacy'" :disabled="mode === 'spacy'" :data-disabled="mode === 'spacy'" class="opacity-50 data-[disabled=true]:opacity-100">Spacy</Button>
            <Button @click="mode = 'model'" :disabled="mode === 'model'" :data-disabled="mode === 'model'" class="opacity-50 data-[disabled=true]:opacity-100">Model</Button>
          </div>
        </div>

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

    <div v-if="showDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded p-4 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Eliminar</h3>
        <form @submit.prevent="handleDelete" class="space-y-4 p-4">
          <div>¿Estás seguro que desea eliminar el acta?
            <p class="font-semibold">{{ currentsMinute.name }}</p>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="submit"
                    class="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button class="px-4 py-2 mr-4 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                    @click="eliminarActa()">
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { exportar } from "@/lib/export_cp.ts";
import { exportarRO } from "@/lib/export_ro.ts";
import { usePermissions } from "@/utils/auth-client.ts";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
ArrowDown,
ArrowUp,
Download,
Edit,
Eye,
FileTextIcon,
Loader2,
MoreVerticalIcon,
Pencil,
PlusIcon,
SearchIcon,
Trash2Icon,
TrashIcon,
UploadCloudIcon
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../ui/table";

const {actas, page} = defineProps<{
  actas: any;
  tyactaspe: string;
  page: number;
}>();
console.log(actas)
const mode = ref('spacy')

const hasPermission = usePermissions()

const tipoActa = ref('ro'); // Valor por defecto: Acta Ordinaria
const showUploadDialog = ref(false);
const uploadedFiles = ref([]);
const isDragging = ref(false);
const showDelete = ref(false);
const currentPage = ref(page)
const hasNextPage = ref(actas?.total)
const loading = ref(false)

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const removeFile = (fileName) => {
  uploadedFiles.value = uploadedFiles.value.filter((file) => file.name !== fileName)
}

const tableHeaders = [
  "No.",
  "Nombre del acta",
  "Núcleo",
  "Fecha",
  "Estado",
  "",
];

const currentsMinute = ref(null);
const selectType = ref("");
const selectFecha = ref('');
const selectedNucleo = ref("");
const selectedStatus = ref("");

const sort = ref<"ASC" | "DESC" | null>(null);

function handleSort() {
  if (sort.value === "ASC") {
    sort.value = "DESC";
  } else if (sort.value === "DESC") {
    sort.value = null;
  } else {
    sort.value = "ASC";
  }
}

const nucleos = computed(() => {
  return [...new Set(actas?.data?.map((item) => item.core?.name))];
});
const typeMinutes = computed(() => {
  return [...new Set(actas?.data?.map((item) => item.type))];
});

const statuses = computed(() => {
  return [...new Set(actas?.data?.map((item) => item.status))];
});

const filteredActas = computed(() => {
  const [year, month] = selectFecha.value.split('-');
  return actas?.data?.filter((item) => {
    return !((selectedNucleo.value && item.core?.name !== selectedNucleo.value) ||
        (selectedStatus.value && item.status !== selectedStatus.value) ||
        (selectType.value && item.type !== selectType.value))
  })
      .filter(item => {
        const date = new Date(item.fecha);
        return !selectFecha.value || (date.getFullYear() === Number(year) &&
            (date.getMonth() + 1) === Number(month))
      })
      .sort((a, b) => {
        if (sort.value === "DESC") {
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        } else if (sort.value === "ASC") {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        } else {
          return a.id - b.id;
        }
      }) ?? [];
});

const filters = ref({
  search: "",
  nucleo: "",
  status: "",
});

const getStatusClass = (status) => {
  const classes = {
    Creada: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Procesando: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    'En Revisión': "bg-purple-100 text-purple-800 hover:bg-purple-200",
    Procesada: "bg-green-100 text-green-800 hover:bg-green-200",
    Validada: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  };
  return classes[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

const handleAction = (action, acta) => {
  currentsMinute.value = acta;
  if (action === "ver") {
    if (acta.isLoaded) {
      navigate(`/loaded-view/${acta.id}`)
    } else if (acta.name === "Acta Ordinaria") {
      navigate(`/view/${acta.id}`);
    } else {
      navigate(`/cp_view/${acta.id}`);
    }
  } else if (action === "editar") {
    if (acta.name === "Acta Ordinaria") {
      navigate(`/edit/${acta.id}`);
    } else {
      navigate(`/edit_acta/${acta.id}`);
    }
  } else if (action === "procesar") {
    navigate(`/indicadores/${acta.id}`);
  } else if (action === "export") {
    if (acta.name !== "Acta Ordinaria") {
      exportar(acta);
    } else exportarRO(acta);
  } else if (action === "eliminar") {
    showDelete.value = true;
  }
};

const handleDelete = () => {
  showDelete.value = false;
};

async function eliminarActa() {
  const acta = currentsMinute.value;
  const id = acta?.id ?? "";
  const tipo = acta?.type ?? "";

  try {
    await actions.minute.deleteMinute({id, type: tipo})
    toast.success("Se eliminó correctamente el acta");
    navigate('/minutes')
  } catch (e) {
    toast.error("Error al eliminar el acta")
    console.error(e);
  }
}

//cargar acta
const handleDrop = async () => {
  isDragging.value = false;
  loading.value = true
  const files = Array.from(uploadedFiles.value ?? []);
  
  const formData = new FormData();
  formData.append("type", tipoActa.value);
  formData.append("mode", mode.value);
  files.forEach((f) => {
    formData.append("files", f);
  });
  try {
    await actions.minute.uploadMinutes.orThrow(formData)
    showUploadDialog.value = false;
    uploadedFiles.value = [];
    navigate('/minutes')
  } catch (error) {
    toast.error("Error al cargar el acta");
    throw new Error(error);
  } finally {
    loading.value = false
  }
};

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

function goToNextPage() {
  if (actas.total > currentPage.value) {
    currentPage.value++;
    navigate(`/minutes?type=all&page=${currentPage.value}`)
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    navigate(`/minutes?type=all&page=${currentPage.value}`)
  }
}
</script>
