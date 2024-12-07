<template>
  <!-- 5. Orden del Día-->
  <div>
    <label for="orden" class="block text-md font-medium text-gray-700"
      >Orden del Día</label
    >
    <Textarea
      id="orden"
      v-model="formData.ordenDelDia"
      rows="4"
      required
      class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
    ></Textarea>
  </div>
  <div>
    <label for="acuerdos" class="block text-md font-medium text-gray-700">Acuerdos</label>
    <Textarea
      id="acuerdos"
      v-model="formData.acuerdos"
      rows="4"
      placeholder="Número - Descripción - Responsable - Fecha de cumplimiento"
      required
      class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
    ></Textarea>
  </div>
  <!-- 7. Salidas al Extranjero -->
  <section class="space-y-4">
    <div class="space-y-2">
      <label for="salidas" class="block text-md font-medium text-gray-700">
        Salidas al Extranjero
      </label>
      <Textarea
        id="salidas"
        v-model="formData.salidasExtranjero"
        rows="4"
        required
        placeholder="Nombre - Motivo - Destino - Fechas - Estado"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      ></Textarea>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";
import FirstStep from "src/components/FirstStep.vue";
import Textarea from "./ui/textarea/Textarea.vue";
import Input from "./ui/input/Input.vue";

const formData = reactive({
  ordenDelDia: "",
  acuerdos: "",
  salidasExtranjero: ""
});
</script>
