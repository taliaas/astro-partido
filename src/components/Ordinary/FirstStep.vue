<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label for="nucleo" class="block text-md font-medium text-gray-700">Núcleo</label>
      <select
        v-model="selectedNucleo"
        class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="indep">Independiente</option>
        <option value="mec">Mecánica</option>
        <option value="icb">ICB</option>
        <option value="civ">Civil</option>
        <option value="mix">Mixtos</option>
      </select>
    </div>
    <!-- Seleccionar el area -->
    <div>
      <label for="area" class="block text-md font-medium text-gray-700">Área</label>
      <select
        v-model="selectedArea"
        class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="inf">Informática</option>
        <option value="indust">Industrial</option>
        <option value="mecan">Mecánica</option>
      </select>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

  <!-- 4. Relación de Asistencia -->
  <div class="overflow-x-auto">
     <label for="secretario" class="block m-3 text-md font-medium text-gray-700"
      >Relación de Militantes del Núcleo</label
    >
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
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Causa
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(asistente, index) in asistentes" :key="index">
          <td class="px-6 py-4 whitespace-nowrap">{{ asistente.nombre }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select
              v-model="asistente.estado"
              class="px-4 py-2 border-none rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="presente">Presente</option>
              <option value="virtual">Virtual</option>
              <option value="ausente">Ausente</option>
            </select>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select
              v-model="asistente.selectedCausa"
              class="px-4 py-2 border-none rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option
                v-for="causa in absenceReasons"
                :key="causa.id"
                :value="causa.label"
                class="rounded"
              >
                {{ causa.label }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { reactive } from "vue";
import Input from "../ui/input/Input.vue";

const selectedNucleo = ref("indep");
const selectedArea = ref("inf");
const selectedCausa = ref("");

const formData = reactive({
  fecha: "",
  hora: "",
  lugar: "",
  nucleo: "",
  area: "",
  secretario: "",
  totalMiembros: 20,
  asistentes: 20,
  ordenDelDia: "",
  acuerdos: "",
});

const asistentes = reactive([
  { nombre: "Juan Pérez", estado: "presente", selectedCausa: "" },
  { nombre: "María García", estado: "presente", selectedCausa: "" },
  { nombre: "Carlos Rodríguez", estado: "presente", selectedCausa: "" },
]);
const absenceReasons = ref([
  { id: 2, label: "Enfermedad" },
  { id: 3, label: "Extranjero" },
  { id: 4, label: "Trabajo" },
  { id: 5, label: "Fuera de Provincia" },
  { id: 6, label: "Vacaciones" },
  { id: 7, label: "Lic. de Maternidad" },
  { id: 8, label: "Problemas Personales" },
  { id: 9, label: "Problemas Familiares" },
  { id: 10, label: "Movilizado" },
  { id: 11, label: "Injustificado" },
  { id: 12, label: "Otros" },
]);
</script>
