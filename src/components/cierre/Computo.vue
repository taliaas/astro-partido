<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">COMITÉ DEL PCC CUJAE</h1>
        <h2 class="text-2xl font-semibold text-gray-600">Cómputo</h2>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500 font-medium">{{ mes }}</span>
          <span class="text-sm text-gray-500 font-medium">{{ anno }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main
      class="max-w-7xl rounded bg-white shadow-lg mx-auto mt-5 px-3 py-8 sm:px-6 lg:px-8"
    >
      <!-- Cómputo -->
      <div>
        <div class="flex justify-between items-center mt-4 m-6">
          <p class="text-md text-gray-600">
            CÓMPUTO PARA EL CONTROL DE LAS ACTAS DE LA REUNIONES ORDINARIAS Y SUS
            INDICADORES
          </p>
        </div>

        <div class="border-b border-gray-200 p-2">
          <!-- Search and Filter Section -->
          <div class="mt-4 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div class="flex-1">
              <label for="search" class="mb-1 block text-sm font-medium text-gray-700"
                >Buscar</label
              >
              <div class="flex-1 relative">
                <SearchIcon
                  class="h-5 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  id="search"
                  v-model="searchQuery"
                  placeholder="Buscar ..."
                  class="w-full rounded pl-10 pr-4 py-2 border shadow-sm border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div class="flex-1 ">
              <label
                for="nucleo-filter"
                class="mb-1 block text-sm font-medium text-gray-700"
                >Filtrar por Núcleo</label
              >
              <select
                id="nucleo-filter"
                v-model="selectedNucleos" multiple
                class="w-1/2 rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option v-for="nucleo in allNucleos" :key="nucleo.id" :value="nucleo.id">
                  {{ nucleo.name }}
                </option>
              </select>
              <Filter
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <!-- Table Section -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table Headers -->
            <thead class="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  class="sticky left-0 z-10 bg-gray-100 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Núcleos
                </th>
                <th
                  v-for="indicator in indicators"
                  :key="indicator.id"
                  scope="col"
                  class="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  {{ indicator.name }}
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="divide-y divide-gray-200 bg-white">
              <template v-for="(area, areaIndex) in filteredAreas" :key="area.id">
                <!-- Area Group -->
                <tr v-if="area.nucleos.length > 0" class="bg-blue-50">
                  <td
                    colspan="100%"
                    class="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {{ area.name }}
                  </td>
                </tr>
                <!-- Nucleos within Area -->
                <tr
                  v-for="nucleo in area.nucleos"
                  :key="nucleo.id"
                  :class="{ 'bg-green-50': nucleo.highlighted }"
                >
                  <td
                    class="sticky left-0 z-10 whitespace-nowrap bg-white px-6 py-4 text-sm font-medium text-gray-900"
                  >
                    {{ nucleo.name }}
                  </td>
                  <td
                    v-for="indicator in indicators"
                    :key="indicator.id"
                    class="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                  >
                    {{ nucleo.values[indicator.id] || "-" }}
                  </td>
                </tr>
                <!-- Subtotal for Area -->
                <tr v-if="area.showSubtotal" class="bg-gray-100">
                  <td
                    class="sticky left-0 z-10 bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-900"
                  >
                    Subtotal {{ area.name }}
                  </td>
                  <td
                    v-for="indicator in indicators"
                    :key="indicator.id"
                    class="px-6 py-4 text-sm font-semibold text-gray-900"
                  >
                    {{ calculateSubtotal(area, indicator.id) }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Filter, SearchIcon } from "lucide-vue-next";

const mes = ref("Marzo");
const anno = ref(2024);

const indicators = ref([
  { id: "puntosOrdenDia", name: "Puntos Orden Día" },
  { id: "totalAcuerdos", name: "Total Acuerdos" },
  { id: "participacionSup", name: "Particip. Sup" },
  { id: "invitadosUJC", name: "Invitados UJC" },
  { id: "rendicionCuentas", name: "Rendición Cuentas" },
]);

const areas = ref([
  {
    id: 1,
    name: "Independientes",
    showSubtotal: true,
    nucleos: [
      {
        id: 1,
        name: "Arquitectura",
        highlighted: false,
        values: {
          puntosOrdenDia: 8,
          totalAcuerdos: 4,
          participacionSup: 1,
          invitadosUJC: 0,
          rendicionCuentas: 1,
        },
      },
      {
        id: 2,
        name: "Automática",
        highlighted: false,
        values: {
          puntosOrdenDia: 6,
          totalAcuerdos: 5,
          participacionSup: 1,
          invitadosUJC: 1,
          rendicionCuentas: 0,
        },
      },
    ],
  },
  {
    id: 2,
    name: "Mecánica",
    showSubtotal: true,
    nucleos: [
      {
        id: 3,
        name: "CP Mecánica",
        highlighted: false,
        values: {
          puntosOrdenDia: 7,
          totalAcuerdos: 3,
          participacionSup: 2,
          invitadosUJC: 1,
          rendicionCuentas: 1,
        },
      },
    ],
  },
]);

const searchQuery = ref("");
const selectedNucleos = ref([]);

const allNucleos = computed(() => {
  return areas.value.flatMap((area) => area.nucleos);
});

const filteredAreas = computed(() => {
  return areas.value
    .map((area) => {
      const filteredNucleos = area.nucleos.filter((nucleo) => {
        const matchesSearch = nucleo.name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());
        const matchesFilter =
          selectedNucleos.value.length === 0 || selectedNucleos.value.includes(nucleo.id);
        return matchesSearch && matchesFilter;
      });
      return {
        ...area,
        nucleos: filteredNucleos,
      };
    })
    .filter((area) => area.nucleos.length > 0);
});

const calculateSubtotal = (area, indicatorId) => {
  return area.nucleos.reduce((sum, nucleo) => {
    return sum + (nucleo.values[indicatorId] || 0);
  }, 0);
};
</script>

<style>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}
</style>
