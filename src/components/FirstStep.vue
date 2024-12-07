<template>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <!-- Seleccionar el area -->
                <label for="area" class="block text-sm font-medium text-gray-700">Área</label>
                <input type="text" id="area" v-model="formData.area" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
              </div>
            </div>

          <!-- 2. Presidencia -->
            <div>
              <label for="secretario" class="block text-sm font-medium text-gray-700">Nombre del Secretario General</label>
              <Input type="text" id="secretario" v-model="formData.secretario" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
            </div>
         
          <!-- 3. Asistencia -->
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
         

          <!-- 4. Relación de Asistencia -->
          
         
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
          

          <!-- 5. Orden del Día y Acuerdos -->
          
            <div>
              <label for="orden" class="block text-sm font-medium text-gray-700">Orden del Día</label>
              <textarea id="orden" v-model="formData.ordenDelDia" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"></textarea>
            </div>
            <div>
              <label for="acuerdos" class="block text-sm font-medium text-gray-700">Acuerdos</label>
              <textarea id="acuerdos" v-model="formData.acuerdos" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"></textarea>
            </div>
          
</template>

<script setup>
import { ref, reactive } from 'vue'
import FirstStep from 'src/components/FirstStep.vue'

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

