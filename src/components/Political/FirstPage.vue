<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h1 class="text-3xl font-bold">Formulario de Reporte</h1>
        <p class="mt-2 text-blue-100">Página 1 de 2: Información General y Asistencia</p>
      </div>
      <form @submit.prevent="nextPage" class="p-8 space-y-8">
        <!-- Núcleo -->
        <div class="space-y-2">
          <label for="nucleo" class="block text-sm font-medium text-gray-700">Núcleo</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users2Icon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="nucleo"
              v-model="formData.nucleo"
              type="text"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              placeholder="Ingrese el núcleo"
            />
          </div>
        </div>

        <!-- Asistencia -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <ClipboardListIcon class="h-6 w-6 mr-2 text-indigo-600" />
            Asistencia
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="totalMilitantes" class="block text-sm font-medium text-gray-700">Total de Militantes</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UsersIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="totalMilitantes"
                  v-model="formData.totalMilitantes"
                  type="number"
                  required
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label for="ausentes" class="block text-sm font-medium text-gray-700">Número de Ausentes</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserMinusIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="ausentes"
                  v-model="formData.ausentes"
                  type="number"
                  required
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div>
            <label for="porcentajeAsistencia" class="block text-sm font-medium text-gray-700">Porcentaje de Asistencia</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PercentIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="porcentajeAsistencia"
                :value="porcentajeAsistencia"
                type="text"
                readonly
                class="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 sm:text-sm sm:leading-5"
              />
            </div>
          </div>
        </div>

        <!-- Causas de Ausencias -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800 flex items-center">
            <AlertCircleIcon class="h-5 w-5 mr-2 text-indigo-600" />
            Causas de Ausencias
          </h3>
          <TransitionGroup name="list" tag="div" class="space-y-2">
            <div v-for="(ausencia, index) in formData.causasAusencias" :key="index" class="flex space-x-2">
              <input
                v-model="ausencia.nombre"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="Nombre"
              />
              <input
                v-model="ausencia.motivo"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="Motivo"
              />
              <button @click="removeAusencia(index)" type="button" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out">
                <XIcon class="h-5 w-5" />
              </button>
            </div>
          </TransitionGroup>
          <button @click="addAusencia" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
            <PlusIcon class="h-5 w-5 mr-2" />
            Agregar Ausencia
          </button>
        </div>

        <div class="pt-5">
          <div class="flex justify-end">
            <button type="submit" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
              Siguiente Página
              <ArrowRightIcon class="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Users2Icon, 
  ClipboardListIcon, 
  UsersIcon, 
  UserMinusIcon, 
  PercentIcon, 
  AlertCircleIcon, 
  XIcon, 
  PlusIcon,
  ArrowRightIcon
} from 'lucide-vue-next'

const formData = ref({
  nucleo: '',
  totalMilitantes: 0,
  ausentes: 0,
  causasAusencias: []
})

const porcentajeAsistencia = computed(() => {
  if (formData.value.totalMilitantes > 0) {
    const porcentaje = ((formData.value.totalMilitantes - formData.value.ausentes) / formData.value.totalMilitantes) * 100
    return porcentaje.toFixed(2) + '%'
  }
  return '0%'
})

const addAusencia = () => {
  formData.value.causasAusencias.push({ nombre: '', motivo: '' })
}

const removeAusencia = (index) => {
  formData.value.causasAusencias.splice(index, 1)
}

const nextPage = () => {
  // Aquí puedes manejar la navegación a la siguiente página
  console.log('Datos de la primera página:', formData.value)
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>