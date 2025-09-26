<template>
  <form @submit="submitForm" class="min-h-screen bg-gray-50 p-6">
    <div
      class="mb-8 text-center transform transition-all duration-500 hover:scale-102"
    >
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Acta Ordinaria</h1>
    </div>
    {{ form.errors }}

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
        <div @submit="submitForm" class="space-y-6">
          <!--  Información 1 -->
          <section v-show="currentStep === 1" class="space-y-4">
            <FirstStep :militantes />
          </section>

          <!--  Información 2 -->
          <section v-show="currentStep === 2" class="space-y-4">
            <SecondStep />
          </section>
          <!--  Información 3 -->
          <section v-show="currentStep === 3" class="space-y-4">
            <ThirdStep />
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
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import FirstStep from "@/components/Ordinary/Edit/FirstStep.vue";
import {
  form_schema,
  type FormSchema,
} from "@/components/Ordinary/Create/form_schema";
import SecondStep from "@/components/Ordinary/Edit/SecondStep.vue";
import ThirdStep from "@/components/Ordinary/Edit/ThirdStep.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ArrowLeft, ArrowRight } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import type { Militantes } from "@/interface/Militante";

const currentStep = ref(1);
const { user, cores, militantes } = defineProps<{
  user: any;
  cores: any;
  militantes: Militantes[];
}>();

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

const form = useForm({
  validationSchema: toTypedSchema(form_schema),
  initialValues: {
    fecha: "",
    core: 1,
    hora: "",
    lugar: "",
    invitados: [],
    abscents: militantes.map((m) => ({
      estado: "Presente" as const,
      reason: null,
      militanteId: m.id,
    })),
    agreements: [],
    development: [],
    observaciones: "",
    fechaCP: "",
    fechaPrep: "",
    fechaProx: "",
    order: [],
  },
});

const submitForm = form.handleSubmit(async (data: FormSchema) => {
  data.core = { id: data.core };

  try {
    await actions.ordinary.createMinute.orThrow({
      data,
      abscents: data.abscents ?? [],
      invitados: data.invitados ?? [],
      agreements: data.agreements ?? [],
    });
    toast.success("Se creó el acta correctamente");
    navigate("/minutes");
  } catch (error) {
    if (error instanceof ActionError) {
      toast.error(error.message);
    }
  }
});
</script>
