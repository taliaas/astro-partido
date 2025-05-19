<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div
      class="mb-8 text-center transform transition-all duration-500 hover:scale-102"
    >
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Acta Ordinaria</h1>
    </div>

    <div class="max-w-7xl mx-auto rounded overflow-hidden p-2">
      <div class="relative">
        <div
          class="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"
        />

        <!-- Active Progress Bar -->
        <div
          class="absolute top-1/2 left-0 h-1 bg-blue-600 transition-all duration-500 ease-in-out -translate-y-1/2"
          :style="{ width: `${progress}%` }"
        />
        <!-- Steps -->
        <div class="relative flex justify-between">
          <div v-for="step in 3" :key="step" class="flex flex-col items-center">
            <!-- Step Circle -->
            <button
              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ease-in-out relative"
              :class="[
                currentStep >= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500',
                'hover:scale-110 active:scale-95',
              ]"
              @click="currentStep = step"
            >
              <span>{{ step }}</span>

              <!-- Check mark for completed steps -->
              <div
                v-if="currentStep > step"
                class="absolute inset-0 flex items-center justify-center bg-blue-600 rounded-full"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="p-2 mt-4">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!--  Información 1 -->
          <section v-show="currentStep === 1" class="space-y-4">
            <slot name="first-step" />
          </section>

          <!--  Información 2 -->
          <section v-show="currentStep === 2" class="space-y-4">
            <slot name="second-step" />
          </section>
          <!--  Información 3 -->
          <section v-show="currentStep === 3" class="space-y-4">
            <slot name="third-step" />
          </section>

          <!-- Botones de navegación -->
          <div class="flex justify-between mt-8">
            <button
              @click="prevStep"
              type="button"
              :disabled="currentStep === 1"
              class="px-4 py-2 flex bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              <ArrowLeft class="w-4 h-4 m-2" />
            </button>
            <button
              v-if="currentStep < 3"
              type="button"
              @click="nextStep"
              class="px-4 py-2 flex bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <ArrowRight class="w-4 h-4 m-2" />
            </button>
            <button
              v-else
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
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
import {ArrowLeft, ArrowRight} from "lucide-vue-next";
import {computed, reactive, ref} from "vue";
import {navigate} from "astro:transitions/client";
import {actions} from "astro:actions";

const currentStep = ref(1);
const { user } = defineProps<{ user: any }>();
const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};
// Calculate progress percentage
const progress = computed(() => {
  return ((currentStep.value - 1) / (3 - 1)) * 100;
});

const notification = reactive({
  show: false,
  message: '',
  type: 'success'
})
const showNotification = (message: string, type = 'success') => {
  notification.show = true
  notification.message = message
  notification.type = type
  setTimeout(() => {
    notification.show = false
  }, 3000)
}
const submitForm = async (e: any) => {
  const form = e.target as HTMLFormElement;
  const formEntries = Array.from(new FormData(form).entries());
  const data = {};
  for (const [key, value] of formEntries) {
    const [prop, index, att] = key.split(".");
    if (index !== undefined) {
      if (!data[prop]) {
        data[prop] = [];
      }
      if (att) {
        if (!data[prop][index]) data[prop][index] = {};
        data[prop][index][att] = value;
      } else {
        data[prop][index] = value;
      }
    } else {
      data[prop] = value;
    }
  }
  data.user_create = user
  data.core = { id: data.nucleo };

  try {
    await actions.ordinary.createMinute({
      data,
      abscents: data.militante.filter(m=>m.estado==="ausente"),
    invitados: data.invitados ?? [],
    agreements: data.agreements ?? [],
    extranjero: data.extranjero ?? [],
    })
    showNotification('Se creó el acta correctamente')
    await navigate("/minutes/");
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
    }
    showNotification("Error al crear el acta", error);
    console.error(error);
  }
};
</script>

1
