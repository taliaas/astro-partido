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
      <div class="flex p-2 gap-4 justify-between">
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
        </aside>
        <div class="flex-1">
          <embed
            :src="url"
            type="application/pdf"
            width="100%"
            height="1000"
            title="Embedded PDF Viewer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Indicadores } from "@/interface/Indicadores.ts";
import { indicadores } from "@/lib/indicadoresKey.ts";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { computed, reactive, ref } from "vue";
import { toast } from "vue-sonner";

const { ind, acta, cp } = defineProps<{
  ind: Indicadores;
  acta: any;
  cp: any;
}>();

// Form data
const formData = reactive<Indicadores>(ind);
const errors = reactive({});
const isSubmitting = ref(false);

// Reset form to initial values
const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = initialData[key];
  });
  Object.keys(errors).forEach((key) => delete errors[key]);
};

// Save form data
const saveIndicadores = async () => {
  isSubmitting.value = true;
  const data = {
    ...formData,
  };
  try {
    await actions.computo.updateComputo(id,data);
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

const url = computed(() => {
  if (!acta?.data) return null;
  console.log(acta);
  
  // Convertir el buffer en un blob PDF
  const byteArray = new Uint8Array(acta.data.data);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  return URL.createObjectURL(blob);
});
</script>
