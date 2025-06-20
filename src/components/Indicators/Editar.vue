<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="w-11/12 mx-auto bg-gray-50 rounded-xl shadow-lg">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 bg-white">
        <h1 class="text-2xl font-bold text-gray-900">
          Procesamiento de Indicadores
        </h1>
        <p class="text-gray-500 mt-1">
          Gestione los valores de los indicadores del sistema
        </p>
      </div>

      <div class="flex p-2 gap-4">
        <aside class="py-10">
          <h2 class="font-medium text-2xl px-4">Indicadores</h2>
          <!-- Form -->
          <form @submit.prevent="saveIndicadores" class="p-4">
            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="(value, key) in formData"
                :key="key"
                class="space-y-2"
              >
                <label
                  :for="key"
                  class="block text-sm font-medium text-gray-700"
                >
                  {{ getName(key) }}
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
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none transition-colors duration-200"
              >
                Restablecer
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
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
            :class="
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            "
          >
            {{ notification.message }}
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { actions } from "astro:actions";
import Editar from "../Ordinary/ActaDisplay.vue";
import type { Indicadores } from "@/interface/Indicadores.ts";
import ComputoService from "@/services/Computo.ts";
import { navigate } from "astro:transitions/client";
import { indicadores } from "@/lib/indicadoresKey.ts";
import { toast } from "vue-sonner";
import Display from "@/components/Political/Display.vue";

const { ind, acta, cp } = defineProps<{
  ind: Indicadores;
  acta: any;
  cp: any;
}>();

// Form data
const formData = reactive<Indicadores>(ind);
const errors = reactive({});
const isSubmitting = ref(false);
const notification = reactive({
  show: false,
  message: "",
  type: "success",
});
const isOrdinay = ref(true);

// Reset form to initial values
const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = initialData[key];
  });
  Object.keys(errors).forEach((key) => delete errors[key]);
};

// Validate form
const validateForm = () => {
  const newErrors = {};
  Object.keys(formData).forEach((key) => {
    if (formData[key] === "" || formData[key] === null) {
      newErrors[key] = "Este campo es requerido";
    } else if (formData[key] < 0) {
      newErrors[key] = "El valor debe ser positivo";
    }
  });
  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

// Save form data
const saveIndicadores = async () => {
  if (!validateForm()) {
    toast.error(
      "Por favor, corrija los errores en el formulario"
    );
    return;
  }
  const service = new ComputoService();
  isSubmitting.value = true;
  const fecha = new Date(acta.fecha);
  const data = {
    anno: fecha.getFullYear(),
    mes: fecha.getMonth() + 1,
    nucleo: acta.core,
    minute: acta,
    ...formData,
  };
  try {
    await service.create(data);
    toast.success("Indicadores guardados exitosamente");
    await navigate("/minutes");
  } catch (error) {
    toast.error("Error al guardar los indicadores");
  } finally {
    isSubmitting.value = false;
  }
};

const getName = (key: any) => {
  return indicadores.find((i) => i.key === key)?.name;
};
</script>
