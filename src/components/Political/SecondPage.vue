<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h1 class="text-3xl font-bold">Formulario de Reporte</h1>
        <p class="mt-2 text-blue-100">Página 2 de 2: Tema Evaluado y Valoración</p>
      </div>
      <form @submit.prevent="submitForm" class="p-8 space-y-8">
        <!-- Datos del Tema Evaluado -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <BookOpenIcon class="h-6 w-6 mr-2 text-indigo-600" />
            Datos del Tema Evaluado
          </h2>
          <div>
            <label for="temaTratado" class="block text-sm font-medium text-gray-700">Tema Tratado</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileTextIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="temaTratado"
                v-model="formData.temaTratado"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="Título del tema"
              />
            </div>
          </div>
        </div>

        <!-- Principales Planteamientos -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800 flex items-center">
            <MessageSquareIcon class="h-5 w-5 mr-2 text-indigo-600" />
            Principales Planteamientos
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participante</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentario</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <TransitionGroup name="list" tag="tbody">
                  <tr v-for="(planteamiento, index) in formData.planteamientos" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        v-model="planteamiento.participante"
                        type="text"
                        class="w-full px-2 py-1 border-b border-gray-300 focus:border-indigo-500 focus:ring-0 transition duration-150 ease-in-out"
                        placeholder="Nombre del participante"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        v-model="planteamiento.comentario"
                        type="text"
                        class="w-full px-2 py-1 border-b border-gray-300 focus:border-indigo-500 focus:ring-0 transition duration-150 ease-in-out"
                        placeholder="Comentario"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button @click="removePlanteamiento(index)" type="button" class="text-red-600 hover:text-red-900 transition duration-150 ease-in-out">
                        <TrashIcon class="h-5 w-5" />
                      </button>
                </td>
                  </tr>
                </TransitionGroup>
              </tbody>
            </table>
          </div>
          <button @click="addPlanteamiento" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
            <PlusIcon class="h-5 w-5 mr-2" />
            Agregar Planteamiento
          </button>
        </div>

        <!-- Valoración de la Reunión -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <StarIcon class="h-6 w-6 mr-2 text-indigo-600" />
            Valoración de la Reunión
          </h2>
          <div>
            <label for="resumenEvento" class="block text-sm font-medium text-gray-700">Resumen del Evento</label>
            <div class="mt-1">
              <textarea
                id="resumenEvento"
                v-model="formData.resumenEvento"
                rows="4"
                required
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md transition duration-150 ease-in-out"
                placeholder="Valoración de la calidad de la reunión"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Firmas -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <PenToolIcon class="h-6 w-6 mr-2 text-indigo-600" />
            Firmas
          </h2>
          <TransitionGroup name="list" tag="div" class="space-y-2">
            <div v-for="(firma, index) in formData.firmas" :key="index" class="flex space-x-2">
              <input
                v-model="firma.nombre"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="Nombre del firmante"
              />
              <button @click="removeFirma(index)" type="button" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out">
                <XIcon class="h-5 w-5" />
              </button>
            </div>
          </TransitionGroup>
          <button @click="addFirma" type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
            <PlusIcon class="h-5 w-5 mr-2" />
            Agregar Firma
          </button>
        </div>

        <div class="pt-5">
          <div class="flex justify-between">
            <button @click="prevPage" type="button" class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
              <ArrowLeftIcon class="mr-2 h-5 w-5" />
              Página Anterior
            </button>
            <button type="submit" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
              Enviar Formulario
              <CheckIcon class="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  BookOpenIcon,
  FileTextIcon,
  MessageSquareIcon,
  TrashIcon,
  PlusIcon,
  StarIcon,
  PenToolIcon,
  XIcon,
  ArrowLeftIcon,
  CheckIcon
} from 'lucide-vue-next'

const formData = ref({
  temaTratado: '',
  planteamientos: [],
  resumenEvento: '',
  firmas: []
})

const addPlanteamiento = () => {
  formData.value.planteamientos.push({ participante: '', comentario: '' })
}

const removePlanteamiento = (index) => {
  formData.value.planteamientos.splice(index, 1)
}

const addFirma = () => {
  formData.value.firmas.push({ nombre: '' })
}

const removeFirma = (index) => {
  formData.value.firmas.splice(index, 1)
}

const prevPage = () => {
  // Aquí puedes manejar la navegación a la página anterior
  console.log('Volver a la página anterior')
}

const submitForm = () => {
  // Aquí puedes manejar el envío del formulario completo
  console.log('Formulario enviado:', formData.value)
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