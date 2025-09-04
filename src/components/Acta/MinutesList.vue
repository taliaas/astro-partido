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
                  <Input id="search" :value="searchParams.name ?? ''" placeholder="Buscar por nombre..." @update:model-value="handleFilterByValue('name', $event)" class="pl-9"/>
                </div>
              </div>
              <div class="gap-4 flex">
                <Select :default-value="searchParams.type ?? 'all'" @update:model-value="handleFilterByValue('type', $event)">
                    <SelectTrigger class="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="type in typeMinutes" :key="type.value" :value="type.value">{{ type.name }}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                <!-- Nucleo -->
                 <Select v-if="nucleos" :default-value="searchParams.core ?? 'all'" @update:model-value="handleFilterByValue('core', $event)">
                    <SelectTrigger class="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Todos los núcleos</SelectItem>
                        <SelectItem v-for="nucleo in nucleos" :key="nucleo.id" :value="nucleo.name">{{ nucleo.name }}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                <!-- Status -->
                 <Select :default-value="searchParams.status ?? 'all'" @update:model-value="handleFilterByValue('status', $event)">
                    <SelectTrigger class="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem v-for="status in statuses" :key="status" :value="status">{{ status }}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                
                <!-- Date -->
                <input type="month" :value="searchParams.fecha ?? '2025-01'" class="border rounded-md px-2 text-sm" @change="handleFilter('fecha',$event)"></input>
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
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ tableHeaders[2] }}
                  </th>
                  <th :data-sort="sort" @click="handleSort"
                      class="flex justify-center gap-2 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ tableHeaders[3] }}
                    <ArrowUp v-if="sort === 'ASC' || sort === null" class="w-4 h-4"
                             :class="{ 'stroke-blue-500': sort === 'ASC' }"/>
                    <ArrowDown v-if="sort === 'DESC'" class="w-4 h-4 stroke-blue-500"/>
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ tableHeaders[4] }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(acta, index) in actas.data" :key="acta.id"
                          class="hover:bg-gray-50/50 transition-colors duration-200">
                  <TableCell class="font-medium pl-8">{{ index + 1 }}</TableCell>
                  <TableCell class="pl-6">{{ acta.name }}</TableCell>
                  <TableCell class=" pl-6 text-center"> {{ acta.core?.name }}</TableCell>
                  <TableCell class="text-center">{{ acta.fecha }}</TableCell>
                  <TableCell class="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge :class="getStatusClass(acta.status)">
                              <Loader2 v-if="acta.status === 'Procesando'" class="animate-spin"/>
                              {{ acta.status }} 
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent class="max-w-64">
                            {{ statusMap[acta.status as keyof typeof statusMap].label }}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                        <DropdownMenuItem @click="handleAction('retry', acta)"
                                          v-if="acta.status === Status.ERROR || acta.status === Status.CREATE">
                          <FilePenLine class="h-4 w-4"/>
                          Procesar
                        </DropdownMenuItem>
                        <DropdownMenuItem v-if="
                          acta.type === 'ro' &&
                          (acta.status === Status.PENDIENTE || acta.status === Status.PROCESADA)
                        " @click="handleAction('procesar', acta)">
                          <FileSearch class="h-4 w-4"/>
                          Revisar
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
            <div v-if="actas.data?.length === 0" class="text-center py-16">
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
              <div v-else class="flex text-md text-muted-foreground p-4 justify-between items-center gap-2">
                <div>Mostrando <span class="font-medium">{{ page || 1 }}</span> de <span class="font-medium">{{
                  actas?.page_total || 1
                }}</span> páginas</div>
              </div>
              
              <div class="flex justify-end gap-4 p-4">
                <Button size="icon" :disabled="currentPage === 1" variant="outline"
                         @click="goToPreviousPage">
                  <ChevronLeft/> 
                </Button>
                <Button size="icon" :disabled="currentPage >= hasNextPage" variant="outline"
                         @click="goToNextPage">
                  <ChevronRight/> 
                </Button>
              
                <div>
                  <Select :default-value="searchParams.limit ?? '10'" @update:model-value="handleFilterByValue('limit', $event)">
                    <SelectTrigger >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
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
import { useSse } from "@/utils/see";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
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
  UploadCloudIcon,
  RotateCw,
  FilePenLine,
  FileSearch
} from "lucide-vue-next";
import { reactive, ref } from "vue";
import { toast } from "vue-sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../ui/table";
import { useUrlSearchParams } from "@vueuse/core";
import { Status } from "@/enum/Status";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import Tooltip from "@/components/ui/tooltip/Tooltip.vue";
import TooltipTrigger from "@/components/ui/tooltip/TooltipTrigger.vue";
import TooltipContent from "@/components/ui/tooltip/TooltipContent.vue";

const {actas: actasResponse, type, page, order, nucleos } = defineProps<{
  actas: any;
  type: string;
  page: number;
  order: any;
  nucleos: any;
}>();

useSse("minute.status",({id,status})=>{
  const acta = actas?.data?.find((acta: any)=>acta.id == id)
  if (acta) {
    acta.status = status
  }  
})

const actas = reactive(actasResponse)
const searchParams = useUrlSearchParams()
const hasPermission = usePermissions()

const mode = ref('spacy')
const tipoActa = ref('ro'); // Valor por defecto: Acta Ordinaria
const showUploadDialog = ref(false);
const uploadedFiles = ref([]);
const isDragging = ref(false);
const showDelete = ref(false);
const currentPage = ref(page)
const hasNextPage = ref(actas?.page_total)
const loading = ref(false)
const currentsMinute = ref(null);
const sort = ref<"ASC" | "DESC" | null >(order);

const formatFileSize = (bytes: any) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const removeFile = (fileName: any) => {
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

const statusMap = {
  [Status.CREATE]: {
    title: "Creada",
    label:
      "El acta ha sido registrada correctamente y está pendiente de procesamiento. Puedes iniciar el procesamiento o cargar archivos adicionales si es necesario.",
  },
  [Status.PROCESSING]: {
    title: "Procesando",
    label:
      "El acta se está procesando actualmente. Este proceso puede tardar unos minutos. Evita realizar cambios hasta que finalice.",
  },
  [Status.PENDIENTE]: {
    title: "En Revisión",
    label:
      "El acta requiere revisión manual. Revisa el contenido y, si todo está correcto, procede a marcarla como procesada o solicita correcciones.",
  },
  [Status.PROCESADA]: {
    title: "Procesada",
    label:
      "El acta fue procesada exitosamente. Puedes visualizarla, exportarla o continuar con los pasos siguientes.",
  },
  [Status.ERROR]: {
    title: "Error",
    label:
      "Ocurrió un error al procesar el acta. Intenta reintentar el procesamiento o revisa el archivo original para corregir posibles problemas.",
  },
  [Status.INACTIVA]: {
    title: "Inactiva",
    label:
      "El acta está inactiva y no está disponible para acciones. Contacta al administrador si crees que debería reactivarse.",
  },
}

function handleSort() {
  if (sort.value === "ASC") {
    sort.value = "DESC";
  } else if (sort.value === "DESC") {
    sort.value = null;
  } else {
    sort.value = "ASC";
  }
  navigate(`/minutes?page=${currentPage.value}&order=${sort.value}`)
}

const handleFilter = (filter: string,e: any) => {
  const value = e.target.value
  const query = new URLSearchParams(searchParams as any)
  if (value && value !== "all") {
    query.set(filter,value)
  } else {
    query.delete(filter)
  }
  navigate("?"+query.toString())
}

const handleFilterByValue = (filter: string,value: any) => {
  const query = new URLSearchParams(searchParams as any)
  if (value && value !== "all") {
    query.set(filter,value)
  } else {
    query.delete(filter)
  }
  navigate("?"+query.toString())
}

const typeMinutes = [{value: 'all', name: 'Todos'},{value:'ro', name: 'Acta Ordinaria'}, {value:'cp', name: 'Círculo Político'}]

const statuses = [Status.CREATE, Status.ERROR, Status.PENDIENTE, Status.PROCESADA, Status.PROCESSING]

const filters = ref({
  search: "",
  nucleo: "",
  status: "",
});

const getStatusClass = (status: any) => {
  const classes = {
    Creada: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Procesando: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    'En Revisión': "bg-purple-100 text-purple-800 hover:bg-purple-200",
    Procesada: "bg-green-100 text-green-800 hover:bg-green-200",
    Validada: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  };
  return classes[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

const handleAction = (action: any, acta: any) => {
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
    if (acta.type === "ro") {
      navigate(`/edit_ro/${acta.id}`);
    } else {
      navigate(`/edit_cp/${acta.id}`);
    }
  } else if (action === "procesar") {
    navigate(`/indicadores/${acta.id}`);
  }
  else if(action === "retry"){
    actions.minute.retryModel({actaID: acta.id, mode: mode.value as any})
    navigate(`minutes`)
  }
  else if (action === "export") {
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
  const acta: {
    id: string,
    type: string,
  } | null = currentsMinute.value;

  const id = acta?.id;
  const tipo = acta?.type ?? 'ro';

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
    toast.error(`${error.message}`);
  } finally {
    loading.value = false
  }
};

const handleFileSelect = (event: any) => {
  const files = Array.from(event.target.files);
  uploadedFiles.value = [...uploadedFiles.value, ...files];
};

const handleFiles = (files: any) => {
  uploadedFiles.value = [...uploadedFiles.value, ...files];
}

const handleFileDrop = (e:any) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  handleFiles(files)
}

function goToNextPage() {
  const query = new URLSearchParams(searchParams as any)
  if (actas.total > currentPage.value) {
    currentPage.value++;
    query.set("page",currentPage.value+"")
    navigate(`?`+query.toString())
  }
}

function goToPreviousPage() {
  const query = new URLSearchParams(searchParams as any)
  if (currentPage.value > 1) {
    currentPage.value--;
    query.set("page",currentPage.value+"")
    navigate(`?`+query.toString())
  }
}
</script>
