<template>
  <div class="min-h-screen p-6">
    <div class="mx-auto max-w-7xl bg-white p-6 border border-gray-300 rounded-lg">
      <div class="mb-8 text-center transform transition-all duration-500 hover:scale-102">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Acta de Círculo Político</h1>
      </div>

      <div class="max-w-7xl mx-auto overflow-hidden">
        <form @submit.prevent="onSubmit" class="p-8 space-y-3">
          <!-- Núcleo -->
          <div class="space-y-2 w-1/4">
            <label for="nucleo" class="block text-sm font-medium text-gray-700">Núcleo</label>
            <select
              name="nucleo"
              v-model="selectedNucleo"
              class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-gray-300"
              :class="{ 'border-red-500': errors.selectedNucleo }"
            >
              <option v-for="nucleo in cores" :key="nucleo" :value="nucleo">
                {{ nucleo?.name }}
              </option>
            </select>
            <span v-if="errors.selectedNucleo" class="text-red-500 text-sm">{{ errors.selectedNucleo }}</span>
          </div>

          <div class="space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="w-3/4">
                <label for="fecha" class="block text-md font-medium text-gray-700">Fecha de la reunión</label>
                <Input
                  type="date"
                  id="fecha"
                  name="fecha"
                  v-model="form.fecha"
                  :class="{ 'border-red-500': errors.fecha }"
                />
                <span v-if="errors.fecha" class="text-red-500 text-sm">{{ errors.fecha }}</span>
              </div>
              <div class="w-3/4">
                <label for="hora" class="block text-md font-medium text-gray-700">Hora</label>
                <Input
                  type="time"
                  id="hora"
                  name="hora"
                  v-model="form.hora"
                  :class="{ 'border-red-500': errors.hora }"
                />
                <span v-if="errors.hora" class="text-red-500 text-sm">{{ errors.hora }}</span>
              </div>
              <div class="w-3/4">
                <label for="lugar" class="block text-md font-medium text-gray-700">Lugar</label>
                <Input
                  type="text"
                  id="lugar"
                  name="lugar"
                  v-model="form.lugar"
                  :class="{ 'border-red-500': errors.lugar }"
                />
                <span v-if="errors.lugar" class="text-red-500 text-sm">{{ errors.lugar }}</span>
              </div>
            </div>
          </div>

          <div class="flex *:flex-1 gap-4">
            <div>
              <label for="total_trabajador" class="block text-md font-medium text-gray-700">
                Cantidad de trabajadores
              </label>
              <Input
                type="number"
                id="trabajador"
                name="total_trabajador"
                v-model="form.total_trabajador"
                min="0"
                :class="{ 'border-red-500': errors.total_trabajador }"
              />
              <span v-if="errors.total_trabajador" class="text-red-500 text-sm">{{ errors.total_trabajador }}</span>
            </div>
            <div>
              <label for="total_organismo" class="block text-md font-medium text-gray-700">
                Participantes del Org. Sup.
              </label>
              <Input
                type="number"
                id="organismo"
                name="total_organismo"
                v-model="form.total_organismo"
                min="0"
                :class="{ 'border-red-500': errors.total_organismo }"
              />
              <span v-if="errors.total_organismo" class="text-red-500 text-sm">{{ errors.total_organismo }}</span>
            </div>
          </div>

          <!-- Causas de Ausencias -->
          <div class="space-y-2">
            <div class="flex justify-between">
              <h3 class="text-lg font-medium text-gray-800 flex items-center">Causas de Ausencias</h3>
              <button
                @click="addAusencia"
                type="button"
                class="group inline-flex items-center bg-white m-3 justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
              >
                <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                Agregar Ausencia
              </button>
            </div>
            <TransitionGroup name="list" tag="div" class="space-y-2">
              <div v-for="(ausencia, index) in form.causa" :key="index" class="flex space-x-2">
                <Input
                  v-model="ausencia.nombre"
                  type="text"
                  :class="{ 'border-red-500': errors.causa?.[index]?.nombre }"
                  placeholder="Nombre"
                />
                <Input
                  v-model="ausencia.motivo"
                  type="text"
                  :class="{ 'border-red-500': errors.causa?.[index]?.motivo }"
                  placeholder="Motivo"
                />
                <button
                  @click="removeAusencia(index)"
                  type="button"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded text-red-600 bg-gray-50 hover:bg-gray-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </TransitionGroup>
          </div>

          <!-- Tema Evaluado -->
          <div class="space-y-2">
            <label for="temaTratado" class="block text-lg font-medium">Tema evaluado en la reunión</label>
            <Textarea
              id="temaTratado"
              v-model="form.tema"
              rows="3"
              :class="{ 'border-red-500': errors.tema }"
              placeholder="Título del tema"
            />
            <span v-if="errors.tema" class="text-red-500 text-sm">{{ errors.tema }}</span>
          </div>

          <!-- Planteamientos -->
          <div class="space-y-2">
            <label for="planteamientos" class="block text-lg font-medium">Principales Planteamientos</label>
            <Textarea
              id="planteamientos"
              v-model="form.planteamientos"
              rows="4"
              :class="{ 'border-red-500': errors.planteamientos }"
            />
            <span v-if="errors.planteamientos" class="text-red-500 text-sm">{{ errors.planteamientos }}</span>
          </div>

          <!-- Valoración -->
          <div class="space-y-2">
            <label for="valoracion" class="block text-xl font-medium mb-4">Valoración de la Reunión</label>
            <Textarea
              id="valoracion"
              v-model="form.valoracion"
              rows="4"
              :class="{ 'border-red-500': errors.valoracion }"
              placeholder="Valoración de la calidad de la reunión"
            />
            <span v-if="errors.valoracion" class="text-red-500 text-sm">{{ errors.valoracion }}</span>
          </div>

          <div class="flex *:flex-1 gap-4">
            <div class="my-6">
              <label for="orientador" class="block text-md font-medium w-3/4 my-2 text-gray-700">
                Nombre del orientador
              </label>
              <Input
                type="text"
                name="name_orientador"
                v-model="form.name_orientador"
                :class="{ 'border-red-500': errors.name_orientador }"
                placeholder="Nombre del orientador"
              />
              <span v-if="errors.name_orientador" class="text-red-500 text-sm">{{ errors.name_orientador }}</span>
            </div>
            <div class="my-6">
              <label for="secretario" class="block text-md font-medium my-2 text-gray-700">
                Nombre del Secretario
              </label>
              <Input
                type="text"
                name="name_secretario"
                v-model="form.name_secretario"
                :class="{ 'border-red-500': errors.name_secretario }"
                placeholder="Nombre del Secretario"
              />
              <span v-if="errors.name_secretario" class="text-red-500 text-sm">{{ errors.name_secretario }}</span>
            </div>
          </div>

          <div class="flex justify-between mt-4 py-4">
            <Button
              variant="outline"
              @click="cerrar"
              type="reset"
              class="w-1/3 px-4 py-2 rounded bg-gray-100 border border-gray-300 hover:bg-gray-200 shadow-md"
            >
              Cancelar
            </Button>
            <button
              type="submit"
              :disabled="Object.keys(errors).length > 0"
              class="w-1/3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { PlusIcon, TrashIcon } from "lucide-vue-next"
import Input from "../ui/input/Input.vue"
import Textarea from "../ui/textarea/Textarea.vue"
import { Button } from "@/components/ui/button"
import { navigate } from "astro:transitions/client"
import PoliticalService from "@/services/PoliticalService"
import { minutesPolitSchema } from '@/schemas/minutesPolit'

const selectedNucleo = ref(null)
const { cores } = defineProps<{ cores: any[] }>()
const errors = ref({})

const form = ref({
  lugar: "",
  hora: "",
  fecha: "",
  total_organismo: 0,
  total_trabajador: 0,
  causa: [],
  tema: "",
  planteamientos: "",
  valoracion: "",
  name_orientador: "",
  name_secretario: "",
})

watch(() => form.value, (newValue) => {
  try {
    minutesPolitSchema.parse(newValue)
    errors.value = {}
  } catch (err) {
    errors.value = err.formErrors?.fieldErrors || {}
  }
}, { deep: true })

const addAusencia = () => {
  form.value.causa.push({ nombre: "", motivo: "" })
}

const removeAusencia = (index: number) => {
  form.value.causa.splice(index, 1)
}

const cerrar = async () => {
  await navigate("/minutes/")
}

const onSubmit = async () => {
  try {
    minutesPolitSchema.parse(form.value)
    const service = new PoliticalService()
    await service.createMinute({
      ...form.value,
      core: selectedNucleo.value,
    })
    alert('Se ha creado el acta política correctamente!')
    await navigate('/minutes')
  } catch (err) {
    errors.value = err.formErrors?.fieldErrors || {}
  }
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