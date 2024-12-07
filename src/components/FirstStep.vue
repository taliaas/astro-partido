<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="w-3/4">
      <label for="fecha" class="block text-md font-medium text-gray-700"
        >Fecha de la reunión</label
      >
      <Input
        type="date"
        id="fecha"
        v-model="formData.fecha"
        required
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
    </div>
    <div class="w-3/4">
      <label for="hora" class="block text-md font-medium text-gray-700">Hora</label>
      <Input
        type="time"
        id="hora"
        v-model="formData.hora"
        required
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
    </div>
    <div class="w-3/4">
      <label for="lugar" class="block text-md font-medium text-gray-700">Lugar</label>
      <Input
        type="text"
        id="lugar"
        v-model="formData.lugar"
        required
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
    </div>
    <div class="w-3/4">
      <!-- Seleccionar el area -->
      <label for="area" class="block text-md font-medium text-gray-700">Área</label>
      <Input
        type="text"
        id="area"
        v-model="formData.area"
        required
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
    </div>
  </div>

  <!-- 2. Presidencia -->
  <div>
    <label for="secretario" class="block text-md font-medium text-gray-700"
      >Nombre del Secretario General</label
    >
    <Input
      type="text"
      id="secretario"
      v-model="formData.secretario"
      required
      class="mt-1 block w-3/4 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
    />
  </div>

  <!-- 3. Asistencia -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="w-1/2">
      <label for="total" class="block text-md font-medium text-gray-700"
        >Número total de miembros</label
      >
      <Input
        type="number"
        id="total"
        v-model="formData.totalMiembros"
        required
        @input="calcularPorcentaje"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
    </div>
    <div class="w-1/2">
      <label for="asistentes" class="block text-md font-medium text-gray-700"
        >Número de asistentes</label
      >
      <Input
        type="number"
        id="asistentes"
        v-model="formData.asistentes"
        required
        @input="calcularPorcentaje"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
    </div>
  </div>

  <!-- 4. Relación de Asistencia -->
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Nombre Completo
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Estado
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(asistente, index) in asistentes" :key="index">
          <td class="px-6 py-4 whitespace-nowrap">{{ asistente.nombre }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select v-model="asistente.estado" class="mt-1 w-1/2 rounded">
              <option value="presente">Presente</option>
              <option value="virtual">Virtual</option>
              <option value="ausente">Ausente</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
</template>

<script setup>
import { ref, reactive } from "vue";
import FirstStep from "src/components/FirstStep.vue";
import Textarea from "./ui/textarea/Textarea.vue";
import Input from "./ui/input/Input.vue";

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

const asistentes = reactive([
  { nombre: "Juan Pérez", estado: "presente" },
  { nombre: "María García", estado: "presente" },
  { nombre: "Carlos Rodríguez", estado: "presente" },
  // Añade más asistentes según sea necesario
]);

</script>

