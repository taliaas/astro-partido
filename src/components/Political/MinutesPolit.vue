<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-8 text-center transform transition-all duration-500 hover:scale-102">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Acta de Círculo Político </h1>
    </div>

    <div class="max-w-7xl mx-auto bg-white rounded shadow-xl overflow-hidden">
      <div class="p-8">
        <!-- Indicador de Progreso -->
        <div class="mb-8">
          <div class="flex items-center justify-center">
            <div v-for="step in 2" :key="step" class="flex items-center">
              <div
                :class="`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  step <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`"
              >
                {{ step }}
              </div>
              <div
                v-if="step < 2"
                :class="`h-1 w-full ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`"
              ></div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!--  Información -->
          

          <!-- Botones de navegación -->
          <div class="flex justify-between mt-8">
            <button
              @click="prevStep"
              :disabled="currentStep === 1"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              v-if="currentStep < 2"
              @click="nextStep"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Siguiente
            </button>
            <button
              v-else
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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
import { ref, reactive } from "vue";
import FirstStep from "src/components/FirstStep.vue";
import SecondStep from "src/components/SecondStep.vue";
import ThirdStep from "src/components/ThirdStep.vue"

const currentStep = ref(1);
const formData = reactive({
  fecha: "",
  hora: "",
  lugar: "",
  area: "",
  secretario: "",
  totalMiembros: 0,
  asistentes: 0,
  porcentajeAsistencia: "0%",
  ordenDelDia: "",
  acuerdos: "",
});

const nextStep = () => {
  if (currentStep.value < 5) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const submitForm = () => {
  // Aquí puedes manejar el envío del formulario
  console.log("Formulario enviado:", formData);
  console.log("Asistencia:", asistentes);
  // Implementa la lógica de envío del formulario aquí
};
</script>

1
