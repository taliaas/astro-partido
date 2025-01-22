<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Sanciones del Militante</h1>
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Núcleo</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Causa</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Sanción</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="sancion in sanciones" :key="sancion.id">
            <td class="px-6 py-4 text-sm text-gray-900">{{ sancion.nucleo }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ sancion.causa }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(sancion.fecha) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getTipoSancionClass(sancion.tipo)">
                  {{ sancion.tipo }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getEstadoClass(sancion.estado)">
                  {{ sancion.estado }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const sanciones = ref([
  { id: 1, fecha: new Date('2023-05-15'), nucleo: 1, tipo: 'Amonestación', causa: 'Incumplimiento de deberes', estado: 'Activa' },
  { id: 2, fecha: new Date('2023-07-22'), nucleo: 1, tipo: 'Suspensión', causa: 'Falta grave a la disciplina', estado: 'Cumplida' },
  { id: 3, fecha: new Date('2023-09-10'), nucleo: 1, tipo: 'Expulsión', causa: 'Violación de estatutos', estado: 'En apelación' },
  { id: 4, fecha: new Date('2023-11-05'), nucleo: 1, tipo: 'Amonestación', causa: 'Ausencia injustificada', estado: 'Activa' },
])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const getTipoSancionClass = (tipo) => {
  switch (tipo) {
    case 'Amonestación': return 'bg-yellow-100 text-yellow-800'
    case 'Suspensión': return 'bg-orange-100 text-orange-800'
    case 'Expulsión': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getEstadoClass = (estado) => {
  switch (estado) {
    case 'Activa': return 'bg-green-100 text-green-800'
    case 'Cumplida': return 'bg-blue-100 text-blue-800'
    case 'En apelación': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>