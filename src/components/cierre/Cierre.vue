<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">COMITÉ DEL PCC CUJAE</h1>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500 font-medium">{{ mes }}</span>
          <span class="text-sm text-gray-500 font-medium">{{ anno }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl bg-white mx-auto mt-5 px-3 py-8 sm:px-6 lg:px-8">
      <!-- Cómputo -->
      <div>
        <div class="flex justify-between items-center mt-4 m-6">
          <p class="text-sm text-gray-600">
            CÓMPUTO PARA EL CONTROL DE LAS ACTAS DE LA REUNIONES ORDINARIAS Y SUS
            INDICADORES
          </p>
        </div>
        <Search />
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Núcleos
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Puntos del Orden del Día
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total de acuerdos
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Particip. Org Sup
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Invitados
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rendición
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Análisis de Objs
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Política de cuadros
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Atención FEU
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Atención UJC
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="acta in actas" :key="acta.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ acta.nucleo }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.puntos }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.acuerdos }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.particip }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.invitados }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.rendicion }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.obj }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.cuadros }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.feu }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.ujc }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Search from "src/components/Search.vue";

const actas = ref([
  {
    id: 1,
    nucleo: "Industrial",
    puntos: 8,
    acuerdos: 7,
    particip: 13,
    rendicion: null,
    obj: null,
    invitados: 3,
    cuadros: 1,
    feu: 1,
    ujc: 0,
  },
]);
const mes = ref("Marzo");
const anno = ref(2024);
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f3f4f6;
  /* Fondo más claro para la cabecera */
}

thead th {
  text-align: left;
  padding: 12px;
  font-weight: bold;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:nth-child(even) {
  background-color: #f9fafb;
  /* Fondo alternado */
}

td {
  text-align: center;
  /* Centrar contenido numérico */
  padding: 10px;
}
</style>
