<script setup lang="ts">
import { statusMap } from "@/components/Acta/status";
import UploadMinute from "@/components/Acta/UploadMinute.vue";
import Label from "@/components/ui/label/Label.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import Tooltip from "@/components/ui/tooltip/Tooltip.vue";
import TooltipContent from "@/components/ui/tooltip/TooltipContent.vue";
import TooltipTrigger from "@/components/ui/tooltip/TooltipTrigger.vue";
import { MinuteStatus } from "@/enum/Estado";
import { MinuteType, roleEnum } from "@/enum/roleEnum";
import type Minute from "@/interface/Minute";
import { exportar } from "@/lib/export_cp.ts";
import { exportarRO } from "@/lib/export_ro.ts";
import { usePermissions } from "@/utils/auth-client";
import { useSse } from "@/utils/see";
import { useUrlSearchParams } from "@vueuse/core";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileCheck,
  FilePenLine,
  FileSearch,
  FileText,
  Loader2,
  MoreVerticalIcon,
  Pencil,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-vue-next";
import { reactive, ref } from "vue";
import { toast } from "vue-sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const emit = defineEmits(["test"]);
const {
  actas: actasResponse,
  type,
  page,
  order,
  nucleos,
  session,
} = defineProps<{
  actas: { data: Minute[]; page_total: number; total: number };
  type: string;
  page: number;
  order: any;
  nucleos: any;
  session: any;
}>();

useSse("minute.status", ({ id, status }) => {
  const acta = actas?.data?.find((acta: Minute) => acta.id == id);
  if (acta) {
    acta.status = status;
  }
});

const currentUser = session;
const currentPage = ref(page);
const currentsMinute = ref<any>(null);
const currentCore = ref<number>(1);
const actas = reactive(actasResponse);
const searchParams = useUrlSearchParams();
const hasPermission = usePermissions();
const mode = ref("model");
const selectedCore = ref(1);
const openModal = ref(false);
const showUploadDialog = ref(false);
const openModalObserv = ref(false);
const showDelete = ref(false);
const hasNextPage = ref(actas?.page_total);
const update = ref(false);
const sort = ref<"ASC" | "DESC" | null>(order);

function getDefaultFilterDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const tableHeaders = [
  "No.",
  "Nombre del acta",
  "Núcleo",
  "Fecha de Creación",
  "Tipo",
  "Estado",
  "",
];

function handleSort() {
  if (sort.value === "ASC") {
    sort.value = "DESC";
  } else if (sort.value === "DESC") {
    sort.value = null;
  } else {
    sort.value = "ASC";
  }
  navigate(`/minutes?page=${currentPage.value}&order=${sort.value}`);
}

const handleFilter = (filter: string, e: any) => {
  const value = e.target.value;
  const query = new URLSearchParams(searchParams as any);
  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }
  navigate("?" + query.toString());
};

const openCore = (acta: any) => {
  currentsMinute.value = acta;
  selectedCore.value = acta?.core?.id;
  currentCore.value = acta?.core?.id;
  update.value = true;
};
const handleCore = async () => {
  if (currentsMinute.value.isLoaded) {
    await actions.minute.updateCore({
      minuteId: currentsMinute.value.id,
      coreId: selectedCore.value,
    });
  } else if (currentsMinute.value.type === "ro") {
    await actions.ordinary.updateCore({
      minuteId: currentsMinute.value.id,
      coreId: selectedCore.value,
    });
  } else {
    await actions.political.updateCore({
      minuteId: currentsMinute.value.id,
      coreId: selectedCore.value,
    });
  }
  navigate("");
};

const handleFilterByValue = (filter: string, value: any) => {
  const query = new URLSearchParams(searchParams as any);
  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }
  navigate("?" + query.toString());
};

const typeMinutes = [
  { value: "Ordinaria", name: "Acta Ordinaria" },
  { value: "Circulo Politico", name: "Círculo Político" },
  { value: "Extraordinaria", name: "Acta Extraordinaria" },
];

const statuses = [
  MinuteStatus.CREATE,
  MinuteStatus.ERROR,
  MinuteStatus.PENDIENTE,
  MinuteStatus.PROCESADA,
  MinuteStatus.PROCESSING,
];

const getStatusClass = (status: any) => {
  const classes = {
    Creada: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Pendiente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Procesada: "bg-green-100 text-green-800 hover:bg-green-200",
    Error: "bg-red-100 text-red-800 hover:bg-red-200",
    Validada: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  };
  return (
    classes[status as keyof typeof classes] ||
    "bg-gray-100 text-gray-800 hover:bg-gray-200"
  );
};

const handleAction = (action: any, acta: Minute) => {
  currentsMinute.value = acta;
  if (action === "ver") {
    console.log(acta);

    if (acta.file) {
      navigate(`minutes/loaded-view/${acta.id}`);
    } else if (acta.type === "Ordinaria") {
      navigate(`minutes/ro/${acta.id}`);
    } else {
      navigate(`minutes/cp/${acta.id}`);
    }
  } else if (action === "editar") {
    if (acta.type === "Ordinaria") {
      navigate(`minutes/ro/${acta.id}/edit`);
    } else {
      navigate(`minutes/cp/${acta.id}/edit`);
    }
  } else if (action === "procesar") {
    navigate(`/indicators/${acta.id}`); //revisar ruta
  } else if (action === "retry") {
    openModal.value = true;
  } else if (action === "observation") {
    navigate(`minutes/observation/${acta.id}`);
  } else if (action === "export") {
    if (acta.type !== "Ordinaria") {
      //revisar
      exportar(acta);
    } else exportarRO(acta);
  } else if (action === "eliminar") {
    showDelete.value = true;
  }
};

const handleRetry = () => {
  actions.minute.retryModel({
    actaID: currentsMinute.value?.id,
    mode: mode.value as any,
  });
  navigate(`minutes`);
};

const handleDelete = () => {
  showDelete.value = false;
};

async function eliminarActa() {
  const acta: {
    id: string;
    type: string;
  } | null = currentsMinute.value;

  const id = acta?.id ?? "";

  try {
    await actions.minute.deleteMinute({ id });
    toast.success("Se eliminó correctamente el acta");
    navigate("/minutes");
  } catch (e) {
    toast.error("Error al eliminar el acta");
    console.error(e);
  }
}

function goToNextPage() {
  const query = new URLSearchParams(searchParams as any);
  if (actas.total > currentPage.value) {
    currentPage.value++;
    query.set("page", currentPage.value + "");
    navigate(`?` + query.toString());
  }
}

function goToPreviousPage() {
  const query = new URLSearchParams(searchParams as any);
  if (currentPage.value > 1) {
    currentPage.value--;
    query.set("page", currentPage.value + "");
    navigate(`?` + query.toString());
  }
}
</script>
<template>
  <div
    class="min-h-screen bg-linear-to-b from-gray-50 to-white dark:bg-zinc-800"
  >
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
                <a
                  href="/minutes/ro/new"
                  class="flex gap-2 text-white rounded text-sm font-medium px-4 py-2 mr-4 bg-button"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Ordinaria
                </a>
                <a
                  href="/minutes/cp/new"
                  class="px-4 py-2 mr-4 flex bg-button gap-2 text-white rounded text-sm font-medium"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  C. Político
                </a>
                <a
                  href="/addCP"
                  class="px-4 py-2 mr-4 flex bg-button gap-2 text-white rounded text-sm font-medium"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Extraordinaria
                </a>
              </div>
            </div>
          </div>

          <!-- Improved Filters -->
          <div class="p-6 bg-gray-50/50">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <div class="relative">
                  <SearchIcon
                    class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  />
                  <Input
                    id="search"
                    :value="searchParams.name ?? ''"
                    placeholder="Buscar por nombre..."
                    @update:model-value="handleFilterByValue('name', $event)"
                    class="pl-9"
                  />
                </div>
              </div>
              <div class="gap-4 flex">
                <Select
                  :default-value="searchParams.type ?? 'all'"
                  @update:model-value="handleFilterByValue('type', $event)"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem
                        v-for="type in typeMinutes"
                        :key="type.value"
                        :value="type.value"
                        >{{ type.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <!-- Nucleo -->
                <Select
                  v-if="nucleos"
                  :default-value="searchParams.core ?? 'all'"
                  @update:model-value="handleFilterByValue('core', $event)"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todos los núcleos</SelectItem>
                      <SelectItem
                        v-for="nucleo in nucleos"
                        :key="nucleo.id"
                        :value="nucleo.name"
                        >{{ nucleo.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <!-- Status -->
                <Select
                  :default-value="searchParams.status ?? 'all'"
                  @update:model-value="handleFilterByValue('status', $event)"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem
                        v-for="status in statuses"
                        :key="status"
                        :value="status"
                        >{{ status }}</SelectItem
                      >
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <!-- Date -->
                <Input
                  type="month"
                  :value="searchParams.fecha ?? getDefaultFilterDate()"
                  @change="handleFilter('fecha', $event)"
                ></Input>
              </div>
            </div>
          </div>

          <!-- Enhanced Table -->
          <div class="overflow-x-auto p-6">
            <Table class="p-2">
              <TableHeader class="text-gray-500 uppercase">
                <TableRow>
                  <TableHead>
                    {{ tableHeaders[0] }}
                  </TableHead>
                  <TableHead>
                    {{ tableHeaders[1] }}
                  </TableHead>
                  <TableHead class="text-center">
                    {{ tableHeaders[2] }}
                  </TableHead>
                  <TableHead
                    :data-sort="sort"
                    @click="handleSort"
                    class="flex justify-center gap-2 items-center"
                  >
                    {{ tableHeaders[3] }}
                    <ArrowUp
                      v-if="sort === 'ASC' || sort === null"
                      class="w-4 h-4"
                      :class="{ 'stroke-blue-500': sort === 'ASC' }"
                    />
                    <ArrowDown
                      v-if="sort === 'DESC'"
                      class="w-4 h-4 stroke-blue-500"
                    />
                  </TableHead>
                  <TableHead class="text-center">
                    {{ tableHeaders[4] }}
                  </TableHead>
                  <TableHead class="text-center">
                    {{ tableHeaders[5] }}
                  </TableHead>
                  <TableHead class="text-center"> Acciones </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(acta, index) in actas?.data"
                  :key="acta.id"
                  class="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <TableCell class="font-medium pl-8">{{
                    index + 1
                  }}</TableCell>
                  <TableCell class="pl-6">{{ acta.name }}</TableCell>
                  <TableCell class="pl-6 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      class="font-normal cursor-pointer"
                      @click="openCore(acta)"
                      >{{ acta.core?.name || "-" }}</Button
                    >
                  </TableCell>
                  <TableCell class="text-center">{{
                    acta.createdAt
                  }}</TableCell>
                  <TableCell class="pl-6 text-center">{{
                    acta.type
                  }}</TableCell>
                  <TableCell class="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge :class="getStatusClass(acta.status)">
                            <Loader2
                              v-if="acta.status === 'Procesando'"
                              class="animate-spin"
                            />
                            {{ acta.status }}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent class="max-w-64">
                          {{
                            statusMap[acta.status as keyof typeof statusMap]
                              .label
                          }}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                        <DropdownMenuItem
                          @click="handleAction('editar', acta)"
                          v-if="
                            hasPermission('Documentos', 'update') && !acta.file
                          "
                        >
                          <Pencil class="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          @click="handleAction('retry', acta)"
                          v-if="
                            acta.status === MinuteStatus.ERROR ||
                            acta.status === MinuteStatus.CREATE
                          "
                        >
                          <FileCheck class="size-4" />
                          Procesar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          v-if="
                            acta.type === MinuteType[0] &&
                            (acta.status === MinuteStatus.PENDIENTE ||
                              acta.status === MinuteStatus.PROCESADA)
                          "
                          @click="handleAction('procesar', acta)"
                        >
                          <FileSearch class="h-4 w-4" />
                          Revisar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          v-if="
                            currentUser.role.name === roleEnum.Cmte &&
                            acta.type === MinuteType[0] &&
                            (acta.status === MinuteStatus.CREATE ||
                              acta.status === MinuteStatus.PENDIENTE ||
                              acta.status === MinuteStatus.PROCESADA)
                          "
                          @click="handleAction('observation', acta)"
                        >
                          <FilePenLine class="h-4 w-4" />
                          Observaciones
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          v-if="
                            acta.status !== MinuteStatus.ERASER &&
                            hasPermission('Acuerdos', 'create')
                          "
                          @click="handleAction('agreements', acta)"
                        >
                          <FileText class="h-4 w-4" />
                          Gestionar acuerdos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          @click="handleAction('export', acta)"
                          v-if="
                            hasPermission('Documentos', 'export') &&
                            acta.status !== MinuteStatus.ERASER
                          "
                        >
                          <Download class="h-4 w-4" />
                          Exportar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          v-if="hasPermission('Documentos', 'delete')"
                          variant="destructive"
                          @click="handleAction('eliminar', acta)"
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
            <div
              v-if="actas?.data?.length === 0"
              class="text-center border p-4"
            >
              <div
                class="mx-auto h-10 w-10 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center"
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

            <div class="flex justify-between">
              <div v-if="actas?.total === 0"></div>
              <div
                v-else
                class="flex text-md text-muted-foreground p-4 justify-between items-center gap-2"
              >
                <div>
                  Mostrando <span class="font-medium">{{ page || 1 }}</span> de
                  <span class="font-medium">{{ actas?.page_total || 1 }}</span>
                  páginas
                </div>
              </div>

              <div class="flex justify-end gap-4 p-4">
                <Button
                  size="icon"
                  :disabled="currentPage === 1"
                  variant="outline"
                  @click="goToPreviousPage"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  size="icon"
                  :disabled="currentPage >= hasNextPage"
                  variant="outline"
                  @click="goToNextPage"
                >
                  <ChevronRight />
                </Button>

                <div>
                  <Select
                    :default-value="searchParams.limit ?? '10'"
                    @update:model-value="handleFilterByValue('limit', $event)"
                  >
                    <SelectTrigger>
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

    <div>
      <UploadMinute v-model:open="showUploadDialog" />
    </div>

    <Dialog :open="openModal" @update:open="openModal = $event">
      <DialogContent>
        <h2 class="text-lg font-semibold text-gray-900">Seleccione</h2>
        <form @submit.prevent="handleRetry">
          <div class="flex justify-center gap-4">
            <div class="flex gap-2">
              <Input
                type="radio"
                name="typeModel"
                value="spacy"
                v-model="mode"
                class="bg-button shadow-none size-4"
              />
              <Label>Spacy</Label>
            </div>
            <div class="flex gap-2">
              <Input
                type="radio"
                name="typeModel"
                value="model"
                v-model="mode"
                class="bg-button shadow-none size-4"
              />
              <Label>Model</Label>
            </div>
          </div>
          <DialogFooter class="pt-2">
            <Button variant="default" type="submit">Aceptar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog :open="update" @update:open="update = $event">
      <DialogContent>
        <DialogTitle>Seleccione el núcleo</DialogTitle>
        <div class="flex justify-center p-2">
          <Select v-model:model-value="selectedCore">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Seleccione el núcleo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">Seleccione el núcleo</SelectItem>
              <SelectItem
                v-for="value in nucleos"
                :key="value.id"
                :value="value.id"
              >
                {{ value.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex justify-end">
          <Button type="submit" variant="default" @click="handleCore"
            >Guardar</Button
          >
        </div>
      </DialogContent>
    </Dialog>

    <Dialog :open="showDelete" @update:open="showDelete = $event">
      <DialogContent>
        <DialogTitle>Eliminar</DialogTitle>
        <DialogDescription>
          <form @submit.prevent="handleDelete" class="space-y-4">
            <div>
              <p class="text-lg text-foreground">
                ¿Estás seguro que desea eliminar
                <span class="font-semibold"
                  >{{ currentsMinute.name }} {{ currentsMinute.id }}</span
                >?
              </p>
            </div>
            <div class="flex justify-end space-x-3">
              <Button type="submit" variant="outline"> Cancelar </Button>
              <Button variant="destructive" @click="eliminarActa()">
                Aceptar
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  </div>
</template>
