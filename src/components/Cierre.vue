<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Header Section -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center">
            <h1 class="text-2xl font-semibold text-gray-900">Cierre del Funcionamiento PCC CUJAE</h1>
          </div>
          
          <!-- Cómputo -->
          <div>
            <div class="flex items-center justify-between">
              <h2 class="text-xl ml-2 font-semibold text-gray-900">Cómite del PCC CUJAE</h2>
              <h3>Mes: Marzo</h3>
            </div>
            <div class="m-2">
              <h3>CÓMPUTO PARA EL CONTROL DE LAS ACTAS DE LA REUNIONES ORDINARIAS YSUS INDICADORES</h3>
              <p class="mt-1 text-sm text-gray-500">De los temas debatidos en la Reunión Ordinaria clasificados en:</p>
            </div>
            <Search />
            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Núcleos</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puntos del Orden del Día</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total de acuerdos </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Particip. Org Sup</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invitados</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rendición</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Análisis de Objs</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Política de cuadros</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atención FEU</th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atención UJC</th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="acta in actas" :key="acta.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ acta.nucleo }}</div>
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

          <!-- Asistencia -->
          <div>

          </div>

          <!-- ParteMunicipio -->
          <div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Search from './Search.vue';

const search = ref(null)
const actas = ref([
  {
    id: 1,
    nucleo: 'Industrial',
    puntos: 8,
    acuerdos: 7,
    particip: 13,
    rendicion: null,
    obj: null,
    invitados: 3,
    cuadros: 1,
    feu: 1,
    ujc: 0
  }
])
</script>