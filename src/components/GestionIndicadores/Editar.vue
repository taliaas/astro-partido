<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto bg-white rounded-xl shadow-lg">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Editor de Indicadores</h1>
        <p class="text-gray-500 mt-1">
          Gestione los valores de los indicadores del sistema
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="saveIndicadores" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(value, key) in formData" :key="key" class="space-y-2">
            <label :for="key" class="block text-sm font-medium text-gray-700">
              {{ formatLabel(key) }}
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
        <div class="mt-8 flex justify-end space-x-4">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const { ind } = defineProps<{
  ind: any;
}>();

// Initial data structure based on the Indicadores class
const initialData = {
  'Puntos_Orden_Dia': 0,
  'Total_de_acuerdos': 0,
  'Particip_Org_Sup': 0,
  'Invitados': 0,
  'Rendicion': 0,
  'Uso_Comis': 0,
  'Impl_ortcs_Org_Sup': 0,
  'Analisis_Act_Ftal': 0,
  'Discus_Delito_corrup': 0,
  'Analisis_objs': 0,
  'Polit_de_cuadros': 0,
  'Atencion_FEU': 0,
  'Atencion_UJC': 0,
  'Functo_Sind': 0,
  'Reglam_Estatutos': 0,
  'Analisis_Aus_RO': 0,
  'Otros_Analisis_Discp': 0,
  'Plan_de_Trab': 0,
  'Sanciones': 0,
  'Crecimiento': 0,
  'Desactivacion': 0,
  'Evaluacion': 0,
  'Guardia_PCC': 0,
  'acuerdos_salidas_ext': 0,
  'Traslados_e_incorporaciones': 0,
  'Circulo_Politico': 0,
  'acuerdos_CPolitico': 0
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

// Format label for display
const formatLabel = (key) => {
  return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
}

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

  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Here you would typically send the formData to your backend
    console.log('Datos guardados:', formData)

    showNotification('Indicadores guardados exitosamente')
  } catch (error) {
    showNotification('Error al guardar los indicadores', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>