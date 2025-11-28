<template>
  <form
    @submit.prevent="submitForm"
    class="min-h-screen bg-gray-50 p-6"
    id="minuteForm"
  >
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
          <div v-for="step in 2" :key="step" class="flex flex-col items-center">
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
        <div class="space-y-6">
          <!--  Información 1 -->
          <section v-show="currentStep === 1" class="space-y-4">
            <FirstStep :militantes />
          </section>

          <!--  Información 2 -->
          <section v-show="currentStep === 2" class="space-y-4">
            <SecondStep :militants="militantes" />
          </section>

          <!-- Botones de navegación -->
          <div class="flex justify-between mt-8">
            <div class="space-x-2">
              <Button
                variant="outline"
                @click="prevStep"
                type="button"
                :disabled="currentStep === 1"
              >
                <ArrowLeft class="w-4 h-4" />
              </Button>
              <Button
                :disabled="currentStep === 2"
                type="button"
                variant="outline"
                @click="nextStep"
              >
                <ArrowRight class="w-4 h-4" />
              </Button>
            </div>
            <Button type="button" @click="open = true">
              Enviar
              <SendHorizonal class="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </form>

  <Dialog :open @update:open="open = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{
          isValid ? "true" : "Esta acta sera guardada como borrador"
        }}</DialogTitle>
        <DialogDescription>{{
          isValid ? "true" : "Hay campos que deben ser llenados"
        }}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit" form="minuteForm" variant="default">
          Guardar</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { form_schema } from "@/components/Acta/Ordinary/Create/form_schema";
import FirstStep from "@/components/Acta/Ordinary/Edit/FirstStep.vue";
import SecondStep from "@/components/Acta/Ordinary/Edit/SecondStep.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Status } from "@/enum/Status";
import type { Agreements, Militant } from "@/interface/Militante";
import { toTypedSchema } from "@vee-validate/zod";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ArrowLeft, ArrowRight, SendHorizonal } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const { agreements, militantes } = defineProps<{
  agreements: Agreements[];
  militantes: Militant[];
}>();

const open = ref(false);
const currentStep = ref(1);

const nextStep = () => {
  if (currentStep.value < 2) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};
// Calculate progress percentage
const progress = computed(() => {
  return ((currentStep.value - 1) / (2 - 1)) * 100;
});

const form = useForm({
  validationSchema: toTypedSchema(form_schema),
  initialValues: {
    fecha: "",
    core: 1,
    hora: "",
    lugar: "",
    status: "",
    invitados: [],
    development: [{ content: "Hola", agreements: [] }],
    fechaCP: "",
    fechaPrep: "",
    fechaProx: "",
    order: ["Chequeo de acuerdos", "Orientaciones del Organismo Superior"],
  },
});

const isValid = computed(() => {
  return !Object.entries(form.errors.value).length;
});

const submitForm = async () => {
  const data = form.values;
  const validate = await form.validate();
  const status = validate.valid ? Status.CREATE : Status.ERASER;
  data.core = { id: data.core };
  data.status = status;
  try {
    await actions.ordinary.createMinute.orThrow({
      data,
      mode: "Model", //cambiar y pedir al usuario que lo cree
      type: "Ordinaria",
    });
    toast.success("Se creó el acta correctamente");
    navigate("/minutes");
  } catch (error) {
    if (error instanceof ActionError) {
      toast.error(error.message);
    }
  }
};
</script>
