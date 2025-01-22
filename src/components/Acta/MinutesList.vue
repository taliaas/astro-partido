<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:bg-zinc-800">
    <div class="max-w-[1600px] mx-auto p-6">
      <!-- Main Card -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <!-- Header Section -->
        <div class="p-8 border-b border-gray-100">
          <div class="flex flex-col space-y-1">
            <h1 class="text-3xl font-bold text-gray-900">Control de Actas</h1>
            <p class="text-gray-500">
              Gestión y seguimiento de documentación oficial
            </p>
          </div>
        </div>

        <!-- Improved Tab Navigation -->
        <div class="border-b border-gray-100 bg-gray-50/50">
          <div class="px-6">
            <nav class="flex space-x-8" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="handleTab(tab)"
                :class="[
                  'py-4 px-1 relative',
                  'font-medium text-sm whitespace-nowrap',
                  currentTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                {{ tab.name }}
                <span
                  v-if="currentTab === tab.id"
                  class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                ></span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Content Area -->
        <div class="divide-y divide-gray-100">
          <!-- Actions Bar -->
          <div class="p-6">
            <div class="flex justify-between items-center">
              <div class="flex gap-3">
                <Button variant="outline" @click="showUploadDialog = true">
                  Cargar acta
                </Button>
              </div>
              <div class="flex gap-3">
                <a
                  href="/addRO"
                  class="px-4 py-2 mr-4 bg-blue-600 flex gap-2 text-white rounded text-sm font-medium hover:bg-blue-700"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Ordinaria</a
                >
                <a
                  href="/addCP"
                  class="px-4 py-2 mr-4 flex bg-blue-600 gap-2 text-white rounded text-sm font-medium hover:bg-blue-700"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  C. Político</a
                >
              </div>
            </div>
          </div>

          <!-- Improved Filters -->
          <div class="p-6 bg-white">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <div class="relative">
                  <SearchIcon
                    class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  />
                  <Input
                    id="search"
                    v-model="filters.search"
                    placeholder="Buscar por nombre..."
                    class="pl-9"
                  />
                </div>
              </div>
              <div class="flex justify-between">
                <select
                  v-model="selectedNucleo"
                  class="rounded-md border px-3 py-2 mx-1.5 text-sm w-full"
                >
                  <option value="">Todos los núcleos</option>
                  <option
                    v-for="nucleo in nucleos"
                    :key="nucleo"
                    :value="nucleo"
                  >
                    {{ nucleo }}
                  </option>
                </select>
                <select v-model="selectFecha" class="rounded-md border px-3 py-2 mx-1.5 text-sm w-full">
                  <option value="">Todos los meses</option>
                  <option
                      v-for="mes in meses"
                      :key="mes"
                      :value="mes"
                  >
                    {{ mes }}
                  </option>
                </select>
                <select
                  v-model="selectedStatus"
                  class="rounded-md border px-3 py-2 mx-1.5 text-sm w-full"
                >
                  <option value="">Todos los estados</option>
                  <option
                    v-for="status in statuses"
                    :key="status"
                    :value="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Enhanced Table -->
          <div class="overflow-x-auto p-6">
            <Table class="p-2">
              <TableHeader
                class="px-6 py-3 text-left border text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <TableRow>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ tableHeaders[0] }}
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ tableHeaders[1] }}
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ tableHeaders[2] }}
                  </th>
                  <th
                    :data-sort="sort"
                    @click="handleSort"
                    class="group cursor-pointer px-6 py-3 flex text-left text-xs font-medium text-gray-500 uppercase tracking-wider justify-between"
                  >
                    {{ tableHeaders[3] }}
                    <ArrowUp
                      v-if="sort === 'DESC' || sort === null"
                      class="w-4 h-4"
                      :class="{ 'stroke-blue-500': sort === 'DESC' }"
                    />
                    <ArrowDown
                      v-if="sort === 'ASC'"
                      class="w-4 h-4 stroke-blue-500"
                    />
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ tableHeaders[4] }}
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  ></th>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="acta in filteredActas"
                  :key="acta.id"
                  class="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <TableCell class="font-medium pl-8">{{ acta.id }}</TableCell>
                  <TableCell class="pl-6">{{ acta.name }} {{ acta.id }}</TableCell>
                  <TableCell class="text-left">{{ acta.core?.name }}</TableCell>
                  <TableCell class="text-left">{{ acta.fecha }}</TableCell>
                  <TableCell class="text-left">
                    <Badge :class="getStatusClass(acta.status)">
                      {{ acta.status }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger class="focus:outline-none">
                        <Button
                          variant="ghost"
                          size="icon"
                          class="rounded-full"
                        >
                          <MoreVerticalIcon class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="handleAction('ver', acta)">
                          <Eye class="h-4 w-4" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="handleAction('editar', acta)">
                          <Pencil class="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          v-if="acta.name === 'Acta Ordinaria' && acta.status === 'Aprobada'"
                          @click="handleAction('procesar', acta)"
                        >
                          <Edit class="h-4 w-4" />
                          Procesar
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="handleAction('export', acta)">
                          <Download class="h-4 w-4" />
                          Exportar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          @click="handleAction('eliminar', acta)"
                          class="text-red-600 border-t focus:text-red-600"
                        >
                          <TrashIcon class="h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <!-- Empty State -->
            <div v-if="filteredActas.length === 0" class="text-center py-16">
              <div
                class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center"
              >
                <SearchIcon class="h-6 w-6" />
              </div>
              <h3 class="mt-4 text-sm font-medium text-gray-900">
                No se encontraron actas
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Ajuste los filtros o cree una nueva acta para comenzar.
              </p>
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
        <div
          class="mt-6 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center transition-colors duration-200"
          :class="{ 'border-blue-500 bg-blue-50': isDragging }"
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @dragenter.prevent
        >
          <UploadCloudIcon
            class="mx-auto h-12 w-12 transition-colors duration-200"
            :class="isDragging ? 'text-blue-600' : 'text-gray-400'"
          />
          <p class="mt-2 text-sm text-gray-600">
            <span class="font-medium hover:text-gray-700">
              Arrastre archivos aquí
            </span>
            o
            <button
              @click="$refs.fileInput.click()"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              seleccione desde su dispositivo
            </button>
          </p>
          <p class="mt-1 text-xs text-gray-500">PDF, hasta 10MB por archivo</p>
          <div class="m-2 border-t mt-4">
            <ul class="space-y-4 mt-3">
              <li v-for="(files, index) in uploadedFiles" :key="index">
                <p class="text-muted-foreground">{{ files.name }}</p>
              </li>
            </ul>
          </div>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept=".pdf"
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <DialogFooter>
          <Button
            type="reset"
            variant="outline"
            @click="showUploadDialog = false"
          >
            Cancelar
          </Button>
          <Button
            @click="handleDrop"
            :disabled="!uploadedFiles.length"
            class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cargar archivos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div
      v-if="showDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Eliminar</h3>
        <form @submit.prevent="handleDelete" class="space-y-4 p-4">
          <div>¿Estás seguro que desea eliminar el acta?</div>
          <div class="flex justify-end space-x-3">
            <button
              type="submit"
              class="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              class="px-4 py-2 mr-4 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
              @click="eliminarActa()"
            >
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Edit,
  Eye,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadCloudIcon,
  Download,
  ArrowUp,
  ArrowDown,
  Pencil,
} from "lucide-vue-next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Select } from "../ui/select";
import { Input } from "../ui/input";
import { navigate } from "astro:transitions/client";
import OrdinaryService from "@/services/OrdinaryService.ts";
import PoliticalService from "@/services/PoliticalService.ts";
import { exportar } from "@/lib/export_cp.ts";
import { exportarRO } from "@/lib/export_ro.ts";
import Minutes from "@/services/Minutes.ts";
import MinutesService from "@/services/Minutes.ts";

const { actas, type } = defineProps<{
  actas: any[];
  type: string;
}>();
const currentTab = ref(type);
const showUploadDialog = ref(false);
const uploadedFiles = ref([]);
const isDragging = ref(false);
const showDelete = ref(false);

const tableHeaders = [
  "No.",
  "Nombre del acta",
  "Núcleo",
  "Fecha",
  "Estado",
  "",
];
const tabs = [
  { id: "all", name: "Todas las actas" },
  { id: "ro", name: "Actas Ordinarias" },
  { id: "cp", name: "Actas de Círculo Político" },
];
const currentsMinute = ref(null);

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
  return [...new Set(actas.map((item) => item.core?.name))];
});

const meses = [
    "Enero",
    "Febrero",
    "Marzo"
]

const statuses = computed(() => {
  return [...new Set(actas.map((item) => item.status))];
});

const filteredActas = computed(() => {
  return actas.filter((item) => {
    if ((selectedNucleo.value && item.core.name !== selectedNucleo.value) || (selectedStatus.value && item.status !== selectedStatus.value))
      return false;
    return true;
  }).sort((a,b)=>{
    if (sort.value === 'DESC'){
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    }
    else if (sort.value === 'ASC'){
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    }
    else {
      return a.id - b.id
    }
  });
});

const selectFecha = ref("");
const selectedNucleo = ref("");
const selectedStatus = ref("");
const filters = ref({
  search: "",
  nucleo: "",
  status: "",
});

const menssage = ref("");

const getStatusClass = (status) => {
  const classes = {
    Aprobada: "bg-green-100 text-green-800 hover:bg-green-200",
    Pendiente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Rechazada: "bg-red-100 text-red-800 hover:bg-red-200",
    Procesada: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Inactiva: "bg-gray-300 text-gray-800 hover:bg-gray-400",
  };
  return classes[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

const handleAction = (action, acta) => {
  currentsMinute.value = acta;
  if (action === "ver") {
    if (acta.name === "Acta Ordinaria") {
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
  const id = acta.id;
  const tipo = acta.type;

  const ro = new OrdinaryService();
  const cp = new PoliticalService();

  try {
    if (tipo === "ro") {
      await ro.deleteMinute(id);
      menssage.value = "Se eliminó correctamente el acta";
    } else if (tipo === "cp") {
      await cp.deleteMinute(id);
      menssage.value = "Se eliminó correctamente el acta";
    }
  } catch (e) {
    console.error(e);
  }
}

function handleTab(tab) {
  currentTab.value = tab.id;
  navigate(`/minutes/?type=${tab.id}`, { history: "replace" });
}

//cargar acta
const handleDrop = async (event) => {
  isDragging.value = false;
  const files = uploadedFiles.value//Array.from(event.dataTransfer.files);
  const service = new OrdinaryService()
  try{
    await service.uploadMinutes(files[0])
    alert('Se guardo el documento')
    showUploadDialog.value = false;
    uploadedFiles.value = [];
  }
  catch (e) {
    alert(e)
    throw new Error(e)
  }
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  uploadedFiles.value = [...uploadedFiles.value, ...files];
};

</script>
