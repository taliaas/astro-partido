<template>
    <div>
      <!-- Panel lateral de búsqueda -->
      <Transition name="slide-left">
        <div v-if="searchStore.showSidePanel" class="fixed top-0 left-0 w-[330px] h-screen bg-white shadow-md z-50 flex flex-col mt-24">
          <div class="search-panel-header flex items-center justify-between p-4 border-b">
            <h4 class="font-medium">Búsqueda avanzada</h4>
            <button
                @click="closePanel"
                class="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-100"
            >
              <XIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="p-4 space-y-4">
            <!-- Núcleos -->
            <div class="grid gap-1.5">
              <label class="text-sm font-medium">Núcleos</label>
              <Select
                  v-model="filters.nucleos"
                  multiple
                  class="w-full"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los núcleos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="core">Núcleo 1</SelectItem>
                    <SelectItem value="core2">Núcleo 2</SelectItem>
                    <SelectItem value="core3">Núcleo 3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- Tipo de documento -->
            <div class="grid gap-1.5">
              <label class="text-sm font-medium">Tipo de documento</label>
              <Select
                  v-model="filters.documentType"
                  class="w-full"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los documentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="acta">Acta Ordinarias</SelectItem>
                    <SelectItem value="informe">Actas de C. Político</SelectItem>
                    <SelectItem value="reporte">Informes</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- Estado -->
            <div class="grid gap-1.5">
              <label class="text-sm font-medium">Estado</label>
              <Select
                  v-model="filters.status"
                  class="w-full"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cualquier estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="processed">Procesado</SelectItem>
                    <SelectItem value="valid">Aprobada</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- Periodo -->
            <div class="grid gap-1.5">
              <label class="text-sm font-medium">Periodo</label>
              <div class="flex gap-2">
                <div class="flex-1">
                  <label class="text-xs text-gray-500">Desde</label>
                  <Input
                      v-model="filters.dateFrom"
                      type="date"
                      class="w-full"
                  />
                </div>
                <div class="flex-1">
                  <label class="text-xs text-gray-500">Hasta</label>
                  <Input
                      v-model="filters.dateTo"
                      type="date"
                      class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Palabras clave -->
            <div class="grid gap-1.5">
              <label class="text-sm font-medium">Palabras clave</label>
              <Input
                  v-model="filters.keywords"
                  class="w-full"
                  placeholder="Ej: guardia, crecimiento, sanción"
              />
            </div>
          </div>
        </div>
      </Transition>

      <!-- Overlay para cerrar el panel en dispositivos móviles -->
      <Transition name="fade">
        <div
            v-if="searchStore.showSidePanel"
            class="search-overlay md:hidden"
            @click="closePanel"
        ></div>
      </Transition>

      <!-- Filtros activos -->
      <div v-if="activeFilters.length > 0" class="active-filters mt-3 flex flex-wrap gap-2">
        <div
            v-for="(filter, index) in activeFilters"
            :key="index"
            class="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold"
        >
          {{ filter.label }}
          <button
              @click="removeFilter(index)"
              class="ml-1 h-3.5 w-3.5 rounded-full hover:bg-gray-100 inline-flex items-center justify-center"
          >
            <XIcon class="h-3 w-3" />
          </button>
        </div>
        <button
            v-if="activeFilters.length > 0"
            @click="clearAllFilters"
            class="text-xs text-gray-500 hover:text-gray-900"
        >
          Limpiar todos
        </button>
      </div>
    </div>

</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { XIcon } from "lucide-vue-next";
import { useSearchStore } from "@/utils/store.ts";

const searchStore = useSearchStore();

const closePanel = () => {
  searchStore.showSidePanel = false;
};

// Estado de los filtros
const filters = reactive({
  documentType: "",
  status: "",
  dateFrom: "",
  nucleos: "",
  dateTo: "",
  keywords: "",
  includeArchived: false,
});

// Filtros activos
const activeFilters = ref([]);

// Aplicar filtros
const applyFilters = () => {
  // Limpiar filtros existentes
  activeFilters.value = [];

  // Añadir filtro de tipo de documento si está seleccionado
  if (filters.documentType) {
    const documentTypeLabels = {
      acta: "Actas",
      informe: "Informes",
      reporte: "Reportes",
    };
    activeFilters.value.push({
      type: "documentType",
      value: filters.documentType,
      label: `Tipo: ${documentTypeLabels[filters.documentType]}`,
    });
  }

  // Añadir filtro de estado si está seleccionado
  if (filters.status) {
    const statusLabels = {
      pending: "Pendiente",
      processed: "Procesado",
      valid: "Aprobada",
    };
    activeFilters.value.push({
      type: "status",
      value: filters.status,
      label: `Estado: ${statusLabels[filters.status]}`,
    });
  }

  // Añadir filtro de rango de fechas si está seleccionado
  if (filters.dateFrom && filters.dateTo) {
    activeFilters.value.push({
      type: "dateRange",
      value: { from: filters.dateFrom, to: filters.dateTo },
      label: `Periodo: ${formatDate(filters.dateFrom)} - ${formatDate(filters.dateTo)}`,
    });
  } else if (filters.dateFrom) {
    activeFilters.value.push({
      type: "dateFrom",
      value: filters.dateFrom,
      label: `Desde: ${formatDate(filters.dateFrom)}`,
    });
  } else if (filters.dateTo) {
    activeFilters.value.push({
      type: "dateTo",
      value: filters.dateTo,
      label: `Hasta: ${formatDate(filters.dateTo)}`,
    });
  }

  // Añadir filtro de palabras clave si se ingresaron
  if (filters.keywords) {
    activeFilters.value.push({
      type: "keywords",
      value: filters.keywords,
      label: `Palabras: ${filters.keywords}`,
    });
  }

  // Cerrar el panel de búsqueda avanzada
  closePanel();

  // Realizar la búsqueda
  search();
};

// Formatear fecha para mostrar
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Eliminar un filtro específico
const removeFilter = (index) => {
  const filter = activeFilters.value[index];

  // Restablecer el filtro correspondiente en el formulario
  switch (filter.type) {
    case "documentType":
      filters.documentType = "";
      break;
    case "status":
      filters.status = "";
      break;
    case "dateRange":
      filters.dateFrom = "";
      filters.dateTo = "";
      break;
    case "dateFrom":
      filters.dateFrom = "";
      break;
    case "dateTo":
      filters.dateTo = "";
      break;
    case "keywords":
      filters.keywords = "";
      break;
    case "includeArchived":
      filters.includeArchived = false;
      break;
  }

  // Eliminar el filtro de los filtros activos
  activeFilters.value.splice(index, 1);

  // Realizar la búsqueda nuevamente con los filtros actualizados
  search();
};

// Limpiar todos los filtros
const clearAllFilters = () => {
  activeFilters.value = [];
  resetFilters();
  search();
};

// Restablecer formulario de filtros
const resetFilters = () => {
  filters.documentType = "";
  filters.status = "";
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.keywords = "";
  filters.includeArchived = false;
};

// Realizar búsqueda con la consulta y filtros actuales
const search = () => {
  // Aquí implementarías la funcionalidad de búsqueda real
  const searchParams = {
    filters: activeFilters.value.reduce((acc, filter) => {
      acc[filter.type] = filter.value;
      return acc;
    }, {}),
  };

  console.log("Buscando con parámetros:", searchParams);
  emit("search", searchParams);
};

// Definir emits
const emit = defineEmits(["search"]);

// Exponer métodos del componente
defineExpose({
  search,
  resetFilters,
  clearAllFilters,
});
</script>
