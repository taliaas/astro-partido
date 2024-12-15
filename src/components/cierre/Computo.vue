<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">COMITÉ DEL PCC CUJAE</h1>
        <h2 class="text-2xl font-semibold text-gray-600">
          CÓMPUTO PARA EL CONTROL DE LAS ACTAS 
        </h2>
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
        <div class="border-b border-gray-200 p-2">
          <!-- Search and Filter Section -->
          <div class="my-4 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div class="flex-1 w-full md:w-3/4">
              <label for="search" class="mb-1 block text-sm font-medium text-gray-700"
                >Buscar</label
              >
              <div class="flex-1 relative">
                <Search
                  class="h-5 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  id="search"
                  v-model="searchQuery"
                  placeholder="Buscar área..."
                  class="w-full rounded pl-10 pr-4 py-2 border shadow-sm border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div class="flex-1 w-full md:w-1/4">
              <label
                for="nucleo-filter"
                class="mb-1 block text-sm font-medium text-gray-700"
                >Filtrar por Núcleo</label
              >
              <select
                id="nucleo-filter"
                v-model="selectedNucleo"
                class="w-1/2 rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Todos los Núcleos</option>
                <option
                  v-for="nucleo in nucleos"
                  :key="nucleo.id"
                  :value="nucleo.id.toString()"
                >
                  {{ nucleo.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Table Section -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table Headers -->
            <thead class="bg-gray-300">
              <tr>
                <th
                  scope="col"
                  class="sticky left-0 z-10 bg-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-900"
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
              <template v-for="nucleo in filteredNucleos" :key="nucleo.id">
                <!-- Nucleo Group -->
                <tr v-if="nucleo.areas.length > 0" class="bg-blue-50">
                  <td
                    colspan="100%"
                    class="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {{ nucleo.name }}
                  </td>
                </tr>
                <!-- Areas within Nucleo -->
                <tr v-for="area in nucleo.areas" :key="area.id">
                  <td
                    class="sticky left-0 z-10 whitespace-nowrap bg-white px-6 py-4 text-sm font-medium text-gray-900"
                  >
                    {{ area.name }}
                  </td>
                  <td
                    v-for="indicator in indicators"
                    :key="indicator.id"
                    class="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                  >
                    {{ area.values[indicator.id] || "-" }}
                  </td>
                </tr>
                <!-- Subtotal for Nucleo -->
                <tr class="bg-gray-100">
                  <td
                    class="sticky left-0 z-10 bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-900"
                  >
                    Subtotal {{ nucleo.name }}
                  </td>
                  <td
                    v-for="indicator in indicators"
                    :key="indicator.id"
                    class="px-6 py-4 text-sm font-semibold text-gray-900"
                  >
                    {{ calculateSubtotal(nucleo.areas, indicator.id) }}
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
import { Search } from "lucide-vue-next";

interface Indicator {
  id: string;
  name: string;
}

interface Area {
  id: number;
  name: string;
  values: Record<string, number>;
}

interface Nucleo {
  id: number;
  name: string;
  areas: Area[];
}

const indicators: Indicator[] = [
  { id: "puntosOrdenDia", name: "Puntos Orden Día" },
  { id: "totalAcuerdos", name: "Total Acuerdos" },
  { id: "participacionSup", name: "Particip. Org Sup" },
  { id: "invitadosUJC", name: "Invitados" },
  { id: "rendicionCuentas", name: "Rendición Cuentas" },
  { id: "rendicionCuentas", name: "Traslados e incorporaciones" },
  { id: "rendicionCuentas", name: "Círculo Político" },
  { id: "rendicionCuentas", name: "Acuerdos C. Político" },
];

const nucleos: Nucleo[] = [
  {
    id: 1,
    name: "Independientes",
    areas: [
      {
        id: 1,
        name: "Arquitectura",
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
    areas: [
      {
        id: 3,
        name: "CP Mecánica",
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
];

const mes = ref("Marzo");
const anno = ref(2024);
const searchQuery = ref("");
const selectedNucleo = ref("");

const filteredNucleos = computed(() => {
  return nucleos
    .map((nucleo) => ({
      ...nucleo,
      areas: nucleo.areas.filter((area) =>
        area.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      ),
    }))
    .filter(
      (nucleo) =>
        selectedNucleo.value === "" || nucleo.id.toString() === selectedNucleo.value
    );
});

const calculateSubtotal = (areas: Area[], indicatorId: string): number => {
  return areas.reduce((sum, area) => sum + (area.values[indicatorId] || 0), 0);
};
</script>

<style scoped>
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
