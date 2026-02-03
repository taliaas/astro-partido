<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { format, addDays } from "date-fns";
import {
  Eye,
  MoreVerticalIcon,
  Pencil,
  PlusIcon,
  Download,
  XIcon,
  ChevronLeft,
  ChevronRight,
  FileDown,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { useUrlSearchParams } from "@vueuse/core";

const {
  cores,
  desactivations,
  members,
  page: initialPage,
} = defineProps<{
  cores: any;
  desactivations: any;
  members: any;
  page: number;
}>();

const EstadoDesactivacion = ["PENDIENTE", "APROBADA", "RECHAZADA"] as const;

const currentNucleos = ref("");
const searchTerm = ref("");
const showModal = ref(false);
const showDetailmdodal = ref(false);
const isLoading = ref(false);
const isEditing = ref(false);
const statusFilter = ref("");
const searchParams = useUrlSearchParams();

// Paginación
const currentPage = ref(initialPage || 1);
const hasNextPage = ref(desactivations?.totalPages || 1);

// Usar un ref separado para el militante seleccionado
const selectedMilitanteId = ref<number | null>(null);

// Función para obtener clases CSS según el estado
const getEstadoBadgeClass = (estado: string) => {
  const classes: Record<string, string> = {
    PENDIENTE: "bg-gray-100 text-gray-800",
    APROBADA: "bg-green-100 text-green-800",
    RECHAZADA: "bg-red-100 text-red-800",
  };
  return classes[estado] || "bg-gray-100 text-gray-800";
};

// Función para obtener el label legible del estado
const getEstadoLabel = (estado: string) => {
  const labels: Record<string, string> = {
    PENDIENTE: "Pendiente",
    APROBADA: "Aprobada",
    RECHAZADA: "Rechazada",
  };
  return labels[estado] || estado;
};

// Función para formatear fecha en la TABLA y DETALLES (+2 día)
const formatDate = (date: string | Date) => {
  try {
    const dateObj = new Date(date);
    // Sumar 1 día para compensar el desfase
    const adjustedDate = addDays(dateObj, 1);
    return format(adjustedDate, "dd/MM/yyyy");
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "";
  }
};

// Función para formatear fecha en el MODAL DE EDICIÓN (+2 días)
const formatDateForEdit = (date: string | Date) => {
  try {
    const dateObj = new Date(date);
    // Sumar 2 días para compensar el desfase en el input date
    const adjustedDate = addDays(dateObj, 1);
    return format(adjustedDate, "yyyy-MM-dd");
  } catch {
    return format(new Date(), "yyyy-MM-dd");
  }
};

const selectedDeactivation = ref({
  motivo: "",
  fecha: "",
  estado: EstadoDesactivacion[0],
  militante: { id: "", firstname: "", lastname: "", ci: "" },
  details: "",
});

const currentDeactivation = ref<{
  id?: number;
  motivo: string;
  fecha: string;
  estado: string;
  militante: {
    id: string | number;
    firstname?: string;
    lastname?: string;
    ci?: string;
  };
  details: string;
}>({
  motivo: "",
  fecha: "",
  estado: EstadoDesactivacion[0],
  militante: { id: "" },
  details: "",
});

// Filtrar militantes que no tienen desactivación activa
const availableMembers = computed(() => {
  if (!members || !desactivations?.data) return members;

  const deactivatedMemberIds = desactivations.data.map(
    (d: any) => d.militante.id,
  );
  return members.filter(
    (member: any) => !deactivatedMemberIds.includes(member.id),
  );
});

const filteredDeactivations = computed(() => {
  if (!desactivations?.data) return [];
  return desactivations.data.filter((deactivation: any) => {
    const matchesSearch =
      deactivation?.militante.firstname
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      deactivation.militante.lastname
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      deactivation?.motivo
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase());
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
  isEditing.value = false;
  selectedMilitanteId.value = null;
  const today = new Date().toISOString().split("T")[0];
  currentDeactivation.value = {
    motivo: "",
    fecha: today,
    estado: "PENDIENTE",
    militante: { id: "" },
    details: "",
  };
  showModal.value = true;
};

const editModal = (deactivation: any) => {
  isEditing.value = true;
  const fechaFormateada =
    deactivation.fecha instanceof Date
      ? deactivation.fecha.toISOString().split("T")[0]
      : new Date(deactivation.fecha).toISOString().split("T")[0];

  currentDeactivation.value = {
    id: deactivation.id,
    motivo: deactivation.motivo,
    fecha: formatDateForEdit(deactivation.fecha),
    estado: deactivation.estado,
    details: deactivation.details,
    militante: {
      id: deactivation.militante.id,
      firstname: deactivation.militante.firstname,
      lastname: deactivation.militante.lastname,
      ci: deactivation.militante.ci,
    },
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
      const militanteIdNumber = Number(selectedMilitanteId.value);

      if (!militanteIdNumber || isNaN(militanteIdNumber)) {
        toast.error("Por favor selecciona un militante válido");
        isLoading.value = false;
        return;
      }

      const dataToSend = {
        motivo: currentDeactivation.value.motivo,
        fecha: currentDeactivation.value.fecha,
        militanteId: militanteIdNumber,
        details: currentDeactivation.value.details,
      };

      console.log("Datos a enviar (crear):", dataToSend);

      const result = await actions.militants.deactiveMili(dataToSend as any);

      if (result.error) {
        console.error("Error del servidor:", result.error);
        toast.error(result.error.message || "Error al crear la desactivación");
        return;
      }

      toast.success("Desactivación creada correctamente");
    } else {
      const dataToUpdate = {
        id: currentDeactivation.value.id,
        motivo: currentDeactivation.value.motivo,
        fecha: currentDeactivation.value.fecha,
        estado: currentDeactivation.value.estado,
        details: currentDeactivation.value.details,
      };

      console.log("Datos a actualizar:", dataToUpdate);
      const result = await actions.militants.updateDeactivation(
        dataToUpdate as any,
      );

      if (result.error) {
        console.error("Error del servidor:", result.error);
        toast.error(
          result.error.message || "Error al actualizar la desactivación",
        );
        return;
      }

      toast.success("Desactivación actualizada correctamente");
    }
    showModal.value = false;
    navigate("");
  } catch (error) {
    console.error("Error completo:", error);
    toast.error(
      `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
    );
  } finally {
    isLoading.value = false;
  }
};

const exportar = async (id: number) => {
  try {
    toast.info("Generando PDF...");
    const result = await actions.militants.exportDesactivation({ id });

    if (result.error) {
      toast.error(result.error.message || "Error al exportar");
      return;
    }

    const byteCharacters = atob(result.data.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.data.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Desactivación exportada correctamente");
  } catch (error) {
    console.error("Error:", error);
    toast.error("No se pudo exportar la desactivación");
  }
};

const exportarListado = async () => {
  try {
    toast.info("Generando listado de desactivaciones...");

    const result = await actions.militants.exportListadoDesactivaciones({
      estado: statusFilter.value || undefined,
      nucleoId: currentNucleos.value ? String(currentNucleos.value) : undefined,
    });

    if (result.error) {
      toast.error(result.error.message || "Error al exportar listado");
      return;
    }

    const byteCharacters = atob(result.data.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.data.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Listado exportado correctamente");
  } catch (error) {
    console.error("Error:", error);
    toast.error("No se pudo exportar el listado");
  }
};

// Funciones de paginación
function goToNextPage() {
  const query = new URLSearchParams(searchParams as any);
  const nextPage = Number(currentPage.value) + 1;
  if (currentPage.value < hasNextPage.value) {
    currentPage.value = nextPage;
    query.set("page", String(nextPage));
    navigate("?" + query.toString());
  }
}

function goToPreviousPage() {
  const query = new URLSearchParams(searchParams as any);
  const prevPage = Number(currentPage.value) - 1;
  if (currentPage.value > 1) {
    currentPage.value = prevPage;
    query.set("page", String(prevPage));
    navigate("?" + query.toString());
  }
}

const handleFilterByValue = (filter: string, value: any) => {
  const query = new URLSearchParams(searchParams as any);

  if (filter === "limit") {
    query.set("page", "1");
    currentPage.value = 1;
  }

  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }

  navigate("?" + query.toString());
};
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
          @click="exportarListado"
          variant="outline"
          class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-gray-100"
        >
          <FileDown class="size-4" />
          Exportar Listado
        </Button>
        <Button
          @click="openAddModal"
          class="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-primary/90"
        >
          <PlusIcon class="size-4" />
          Nueva Desactivación
        </Button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg border shadow-sm">
      <div class="flex gap-4 items-center flex-wrap">
        <div class="flex-1 min-w-[250px]">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nombre o motivo..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Todos los estados</option>
          <option v-for="stat in EstadoDesactivacion" :key="stat" :value="stat">
            {{ getEstadoLabel(stat) }}
          </option>
        </select>
        <select
          v-model="currentNucleos"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Todos los núcleos</option>
          <option v-for="core in cores" :key="core.id" :value="core.id">
            {{ core.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Lista de Desactivaciones -->
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
                Fecha
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
              v-for="deactivation in filteredDeactivations"
              :key="deactivation.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">
                  {{ deactivation.militante?.firstname }}
                  {{ deactivation.militante?.lastname }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-sm text-gray-900 max-w-xs truncate block"
                  :title="deactivation.motivo"
                >
                  {{ deactivation.motivo }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
              >
                {{ formatDate(deactivation.fecha) }}
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
              >
                {{ deactivation.militante?.core.name }}
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="getEstadoBadgeClass(deactivation.estado)"
                >
                  {{ getEstadoLabel(deactivation.estado) }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm font-medium space-x-2"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger class="focus:outline-none">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="rounded-full hover:bg-gray-100"
                    >
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      @click="viewDeactivationDetails(deactivation)"
                      class="cursor-pointer"
                    >
                      <Eye class="h-4 w-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="editModal(deactivation)"
                      class="cursor-pointer"
                    >
                      <Pencil class="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="exportar(deactivation.id)"
                      class="cursor-pointer"
                    >
                      <Download class="h-4 w-4 mr-2" />
                      Exportar PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
            <tr v-if="filteredDeactivations?.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-500">
                <p class="text-lg">No hay desactivaciones registradas</p>
                <p class="text-sm mt-2">
                  Usa el botón "Nueva Desactivación" para agregar una
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Paginación -->
      <div class="flex justify-between p-4 border-t">
        <div v-if="desactivations?.totalPages === 0"></div>
        <div
          v-else
          class="flex text-md text-muted-foreground items-center gap-2"
        >
          <div>
            Mostrando <span class="font-medium">{{ currentPage || 1 }}</span> de
            <span class="font-medium">{{
              desactivations?.totalPages || 1
            }}</span>
            páginas
          </div>
        </div>

        <div class="flex justify-end gap-4">
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

    <!-- Modal para Nueva/Editar Desactivación -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditing ? "Editar Desactivación" : "Nueva Desactivación" }}
          </h3>
          <button
            @click="showModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="saveDeactivation" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Militante <span class="text-red-500">*</span>
            </label>
            <!-- Mostrar input de solo lectura cuando está editando -->
            <input
              v-if="isEditing"
              type="text"
              :value="`${currentDeactivation.militante?.firstname || ''} ${currentDeactivation.militante?.lastname || ''}`"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700"
            />
            <!-- Usar selectedMilitanteId con v-model.number -->
            <select
              v-else
              v-model.number="selectedMilitanteId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option :value="null">Seleccionar militante</option>
              <option
                v-for="member in availableMembers"
                :key="member.id"
                :value="member.id"
              >
                {{ member.firstname }} {{ member.lastname }}
              </option>
            </select>
            <p
              v-if="!isEditing && availableMembers?.length === 0"
              class="text-sm text-red-600 mt-1"
            >
              No hay militantes disponibles. Todos ya tienen desactivaciones
              registradas.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Motivo de Desactivación <span class="text-red-500">*</span>
            </label>
            <input
              v-model="currentDeactivation.motivo"
              required
              placeholder="Escriba el motivo de la desactivación"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Desactivación <span class="text-red-500">*</span>
            </label>
            <input
              v-model="currentDeactivation.fecha"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Campo de Estado (solo visible en modo edición) -->
          <div
            v-if="isEditing"
            class="bg-blue-50 border border-blue-200 rounded-md p-3"
          >
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Estado <span class="text-red-500">*</span>
            </label>
            <select
              v-model="currentDeactivation.estado"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option
                v-for="estado in EstadoDesactivacion"
                :key="estado"
                :value="estado"
              >
                {{ getEstadoLabel(estado) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Notas Adicionales
            </label>
            <textarea
              v-model="currentDeactivation.details"
              rows="3"
              placeholder="Información adicional sobre la desactivación..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4 justify-end">
            <Button
              type="button"
              @click="showModal = false"
              variant="secondary"
              class="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button type="submit" :disabled="isLoading" class="px-4 py-2">
              <span v-if="isLoading">Procesando...</span>
              <span v-else>{{
                isEditing ? "Actualizar" : "Crear Desactivación"
              }}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div
      v-if="showDetailmdodal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDetailmdodal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">
            Detalles de la Desactivación
          </h3>
          <button
            @click="closeDetailmdodal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>

        <div v-if="selectedDeactivation" class="space-y-5">
          <!-- Información del Militante -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold text-gray-700 mb-3">
              Información del Militante
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Nombre completo</label
                >
                <p class="text-base text-gray-900 font-medium">
                  {{ selectedDeactivation.militante?.firstname }}
                  {{ selectedDeactivation.militante?.lastname }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >CI</label
                >
                <p class="text-base text-gray-900">
                  {{ selectedDeactivation.militante?.ci }}
                </p>
              </div>
            </div>
          </div>

          <!-- Detalles de la Desactivación -->
          <div>
            <h4 class="font-semibold text-gray-700 mb-3">
              Detalles de la Desactivación
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Motivo</label
                >
                <p class="text-base text-gray-900 font-medium">
                  {{ selectedDeactivation.motivo }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Fecha</label
                >
                <p class="text-base text-gray-900">
                  {{ formatDate(selectedDeactivation.fecha) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Estado</label
                >
                <span
                  class="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  :class="getEstadoBadgeClass(selectedDeactivation.estado)"
                >
                  {{ getEstadoLabel(selectedDeactivation.estado) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Notas Adicionales -->
          <div v-if="selectedDeactivation.details">
            <label class="block text-sm font-medium text-gray-500 mb-2"
              >Notas Adicionales</label
            >
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-base text-gray-900 whitespace-pre-wrap">
                {{ selectedDeactivation.details }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-6 border-t">
          <Button
            @click="closeDetailmdodal"
            variant="secondary"
            class="px-6 py-2"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
