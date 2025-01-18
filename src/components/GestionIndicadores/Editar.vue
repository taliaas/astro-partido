<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="w-11/12 mx-auto bg-white rounded-xl shadow-lg">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Procesar de Indicadores</h1>
        <p class="text-gray-500 mt-1">
          Gestione los valores de los indicadores del sistema
        </p>
      </div>

      <div class="flex p-2 gap-4">
        <div class="flex-1">
          <Editar :acta />
        </div>

        <aside class="py-10">
          <h2 class="font-medium text-xl px-4">Indicadores</h2>
          <!-- Form -->
          <form @submit.prevent="saveIndicadores" class="p-4">
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(value, key) in formData" :key="key" class="space-y-2">
                <label :for="key" class="block text-sm font-medium text-gray-700">
                  {{ key }}
                </label>
                <div class="relative">
                  <input
                      type="number"
                      :id="key"
                      v-model="formData[key]"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                      :class="{ 'border-red-500': errors[key] }"
                      min="0"
                      step="1"
                      :value
                  />
                  <span
                      v-if="errors[key]"
                      class="text-xs text-red-500 mt-1 absolute -bottom-5 left-0"
                  >
                {{ errors[key] }}
              </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-8 flex space-x-4 *:flex-1">
              <button
                  type="button"
                  @click="resetForm"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none transition-colors duration-200"
              >
                Restablecer
              </button>
              <button
                  type="submit"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                  :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Guardando..." : "Guardar Cambios" }}
              </button>
            </div>
          </form>

          <!-- Notification -->
          <div
              v-if="notification.show"
              class="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300"
              :class="notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
          >
            {{ notification.message }}
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Editar from '../Ordinary/ActaDisplay.vue'
import type {Indicadores} from "@/interface/Indicadores.ts";
import ComputoService from "@/services/Computo.ts";

const { ind, acta } = defineProps<{
  ind: Indicadores, acta: any
}>();

// Initial data structure based on the Indicadores class
const initialData = {
  'Puntos Orden Dia': ind.pto,
  'Total de acuerdos': ind.totalDeAcuerdos,
  'Particip. Org. Sup.': ind.participacionOrgSup,
  'Invitados': ind.invitados,
  'Rendicion':ind.rendicion,
  'Uso Comis.': ind.usoComisiones,
  'Impl. ortcs Org. Sup.': ind.implOrtcsOrgSup,
  'Analisis Act. Ftal': ind.analisisActFtal,
  'Discus. Delito corrup': ind.discusionDelitoCorrupcion,
  'Analisis objs': ind.analisisObjs,
  'Polit. de cuadros': ind.politicaDeCuadros,
  'Atencion FEU': ind.atencionFEU,
  'Atencion UJC': ind.atencionUJC,
  'Functo Sind': ind.funcionamientoSindicato,
  'Reglam. Estatutos': ind.reglamentosEstatutos,
  'Analisis Aus. RO': ind.analisisAusenciasRO,
  'Otros Analisis Discp.': ind.otrosAnalisisDisciplinarios,
  'Plan de Trab.': ind.planDeTrabajo,
  'Sanciones': ind.sanciones,
  'Crecimiento': ind.crecimiento,
  'Desactivacion': ind.desactivacion,
  'Evaluacion': ind.evaluacion,
  'Guardia PCC':ind.guardiaPCC,
  'Acuerdos salidas ext': ind.acuerdosSalidasExternas,
  'Traslados e incorporaciones': ind.trasladosIncorporaciones,
  'Circulo Politico': ind.cp,
  'acuerdos C.Politico': ind.cp_agree
}

// Form data
const formData = reactive({ ...initialData })
const errors = reactive({})
const isSubmitting = ref(false)
const notification = reactive({
  show: false,
  message: '',
  type: 'success'
})

// Reset form to initial values
const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = initialData[key]
  })
  Object.keys(errors).forEach(key => delete errors[key])
}

// Validate form
const validateForm = () => {
  const newErrors = {}
  Object.keys(formData).forEach(key => {
    if (formData[key] === '' || formData[key] === null) {
      newErrors[key] = 'Este campo es requerido'
    } else if (formData[key] < 0) {
      newErrors[key] = 'El valor debe ser positivo'
    }
  })
  Object.assign(errors, newErrors)
  return Object.keys(newErrors).length === 0
}

// Show notification
const showNotification = (message, type = 'success') => {
  notification.show = true
  notification.message = message
  notification.type = type
  setTimeout(() => {
    notification.show = false
  }, 3000)
}

// Save form data
const saveIndicadores = async () => {
  if (!validateForm()) {
    showNotification('Por favor, corrija los errores en el formulario', 'error')
    return
  }
  const service = new ComputoService()
  isSubmitting.value = true
  try {
    // Simulate API call
    return await service.create(ind)
    showNotification('Indicadores guardados exitosamente')
  } catch (error) {
    showNotification('Error al guardar los indicadores', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>