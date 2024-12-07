<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto bg-white rounded shadow-xl overflow-hidden">
      <div class="p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Reunión Ordinaria</h1>
        
        <!-- Indicador de Progreso -->
        <div class="mb-8">
          <div class="flex justify-between">
            <div v-for="step in 5" :key="step" class="flex items-center">
              <div :class="`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                step <= currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`">
                {{ step }}
              </div>
              <div v-if="step < 5" :class="`h-1 w-full ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`"></div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- 1. Información General -->
          <section v-show="currentStep === 1" class="space-y-4">
            <h2 class="text-2xl font-semibold text-red-600">1. Información General</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha de la reunión</label>
                <input type="date" id="fecha" v-model="formData.fecha" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
              </div>
              <div>
                <label for="hora" class="block text-sm font-medium text-gray-700">Hora</label>
                <input type="time" id="hora" v-model="formData.hora" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
              </div>
              <div>
                <label for="lugar" class="block text-sm font-medium text-gray-700">Lugar</label>
                <input type="text" id="lugar" v-model="formData.lugar" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
              </div>
              <div>
                <label for="area" class="block text-sm font-medium text-gray-700">Área</label>
                <input type="text" id="area" v-model="formData.area" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
              </div>
            </div>
          </section>

          <!-- 2. Presidencia -->
          <section v-show="currentStep === 1" class="space-y-4">
            <h2 class="text-2xl font-semibold text-red-600">2. Presidencia</h2>
            <div>
              <label for="secretario" class="block text-sm font-medium text-gray-700">Nombre del Secretario General</label>
              <input type="text" id="secretario" v-model="formData.secretario" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
            </div>
          </section>

          <!-- 3. Asistencia -->
          <section v-show="currentStep === 1" class="space-y-4">
            <h2 class="text-2xl font-semibold text-red-600">3. Asistencia</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="total" class="block text-sm font-medium text-gray-700">Número total de miembros</label>
                <input type="number" id="total" v-model="formData.totalMiembros" required @input="calcularPorcentaje" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
              </div>
              <div>
                <label for="asistentes" class="block text-sm font-medium text-gray-700">Número de asistentes</label>
                <input type="number" id="asistentes" v-model="formData.asistentes" required @input="calcularPorcentaje" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
              </div>
              <div>
                <label for="porcentaje" class="block text-sm font-medium text-gray-700">Porcentaje de asistencia</label>
                <input type="text" id="porcentaje" v-model="formData.porcentajeAsistencia" readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100">
              </div>
            </div>
          </section>

          <!-- 4. Relación de Asistencia -->
          <section v-show="currentStep === 1" class="space-y-4">
            <h2 class="text-2xl font-semibold text-red-600">4. Relación de Asistencia</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(asistente, index) in asistentes" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">{{ asistente.nombre }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <select v-model="asistente.estado" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
                        <option value="presente">Presente</option>
                        <option value="virtual">Virtual</option>
                        <option value="ausente">Ausente</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 5. Orden del Día y Acuerdos -->
          <section v-show="currentStep === 1" class="space-y-4">
            <h2 class="text-2xl font-semibold text-red-600">5. Orden del Día y Acuerdos</h2>
            <div>
              <label for="orden" class="block text-sm font-medium text-gray-700">Temas tratados</label>
              <textarea id="orden" v-model="formData.ordenDelDia" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"></textarea>
            </div>
            <div>
              <label for="acuerdos" class="block text-sm font-medium text-gray-700">Acuerdos</label>
              <textarea id="acuerdos" v-model="formData.acuerdos" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"></textarea>
            </div>
          </section>

          <!-- Botones de navegación -->
          <div class="flex justify-between mt-8">
            <button 
              @click="prevStep" 
              :disabled="currentStep === 1"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button 
              v-if="currentStep < 5"
              @click="nextStep"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Siguiente
            </button>
            <button 
              v-else
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Enviar Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentStep = ref(1)
const formData = reactive({
  fecha: '',
  hora: '',
  lugar: '',
  area: '',
  secretario: '',
  totalMiembros: 0,
  asistentes: 0,
  porcentajeAsistencia: '0%',
  ordenDelDia: '',
  acuerdos: ''
})

const asistentes = reactive([
  { nombre: 'Juan Pérez', estado: 'presente' },
  { nombre: 'María García', estado: 'presente' },
  { nombre: 'Carlos Rodríguez', estado: 'presente' },
  // Añade más asistentes según sea necesario
])

const calcularPorcentaje = () => {
  if (formData.totalMiembros > 0 && formData.asistentes > 0) {
    const porcentaje = (formData.asistentes / formData.totalMiembros) * 100
    formData.porcentajeAsistencia = porcentaje.toFixed(2) + '%'
  } else {
    formData.porcentajeAsistencia = '0%'
  }
}

const nextStep = () => {
  if (currentStep.value < 5) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const submitForm = () => {
  // Aquí puedes manejar el envío del formulario
  console.log('Formulario enviado:', formData)
  console.log('Asistencia:', asistentes)
  // Implementa la lógica de envío del formulario aquí
}
</script>

1

