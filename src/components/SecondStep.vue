<template>
  <div>
    <label for="acuerdos" class="block text-md font-medium text-gray-700">Acuerdos</label>
    <Textarea
      id="acuerdos"
      v-model="formData.acuerdos"
      rows="4"
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
        placeholder="Nombre - Motivo - Destino - Fechas - Estado"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      ></Textarea>
    </div>
  </section>

  <!-- 8. Fechas Relevantes -->
  <section class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="w-3/4 space-y-2">
        <label for="proxima" class="block text-md font-medium text-gray-700">
          Próxima reunión ordinaria
        </label>
        <Input
          type="date"
          id="proxima"
          v-model="formData.proximaReunion"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="w-3/4 space-y-2">
        <label for="preparacion" class="block text-md font-medium text-gray-700">
          Preparación próxima reunión
        </label>
        <Input
          type="date"
          id="preparacion"
          v-model="formData.preparacionReunion"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div class="w-3/4 space-y-2">
        <label for="circulo" class="block text-md font-medium text-gray-700">
          Próximo círculo de estudios
        </label>
        <Input
          type="date"
          id="circulo"
          v-model="formData.circuloEstudios"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
    </div>
  </section>

  <!-- 9. Observaciones y Firmas -->
  <section class="space-y-4">
    <div class="space-y-2">
      <label for="observaciones" class="block text-md font-medium text-gray-700">
        Observaciones generales
      </label>
      <Textarea
        id="observaciones"
        v-model="formData.observaciones"
        rows="4"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      ></Textarea>
    </div>
    <div class="space-y-2">
      <label for="firma" class="block text-md font-medium text-gray-700">
        Nombre del secretario para la firma<span class="text-red-500">*</span>
      </label>
      <Input
        type="text"
        id="firma"
        v-model="formData.firmaSecretario"
        required
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";
import FirstStep from "src/components/FirstStep.vue";
import Textarea from "./ui/textarea/Textarea.vue";
import Input from "./ui/input/Input.vue";

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
</script>
