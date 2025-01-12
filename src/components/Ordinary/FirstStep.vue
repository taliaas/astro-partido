<template>
  <!-- 2. Núcleo -->
  <div class="w-1/3">
      <label for="nucleo" class="block text-md font-medium text-gray-700">Núcleo</label>
      <select
        v-model="selectedNucleo"
        class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option v-for="nucleo in cores" :key="nucleo" :value="nucleo">
          {{ nucleo?.name }}
        </option>
      </select>
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

  <div class="rounded">
    <div class="flex justify-between">
      <label class="block my-2 text-md font-medium text-gray-700">Invitados y Participantes</label>
      <Button @click="addPerson" variant="outline"
              class="group inline-flex items-center m-3 justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4">
        <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
        Agregar
      </Button>
    </div>
    <table class="min-w-full divide-y rounded-md divide-gray-200 border border-gray-300">
      <thead class="bg-gray-100 rounded">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          No.
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Nombre
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Cargo
        </th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in person" :key="index" class="border-b">
        <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
        <td class="p-4 align-middle">
          <input type="text" v-model="item.nombre" class="w-full px-2 bg-transparent focus:outline-none"
                 placeholder="Nombre" name="name" />
        </td>
        <td class="p-4 align-middle">
          <select type="text" v-model="item.cargo" class="w-3/5 px-2 bg-transparent focus:outline-none">
            <option v-for="cargo in cargos" :key="cargo" :value="cargo">
              {{ cargo }}
            </option>
          </select>
        </td>
        <td class="p-4 text-center align-middle">
          <button @click="removeAgreement(index)" class="text-destructive  hover:text-destructive/90">
            <TrashIcon class="h-4 w-4" />
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- Empty State -->
    <div v-if="person.length === 0" class="text-center py-16 border border-gray-300 rounded">
      <div class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center">
        <SearchIcon class="h-6 w-6"/>
      </div>
      <h3 class="mt-4 text-sm font-medium text-gray-500">No hay invitados o participantes</h3>

    </div>
  </div>
  <!-- 4. Relación de Asistencia -->
  <div class="overflow-x-auto mt-4">
    <label class="block mb-3 text-md font-medium text-gray-700">Relación de Militantes del Núcleo</label>
    <table class="min-w-full divide-y rounded divide-gray-200 border border-gray-300">
      <thead class="bg-gray-100 ">
        <tr>
          <th v-for="header in headers" :key="header"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(militante, index) in militantes" :key="index">
          <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ militante.firstname }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ militante.lastname }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select
              v-model="estado"
              class="px-2 py-2 border-none rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="presente">Presente</option>
              <option value="virtual">Virtual</option>
              <option value="ausente">Ausente</option>
            </select>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select
              v-model="militante.selectedCausa"
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
    <!-- Empty State -->
    <div v-if="militantes.length === 0" class="text-center py-16 border border-gray-300 rounded">
      <div class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center">
        <SearchIcon class="h-6 w-6"/>
      </div>
      <h3 class="mt-4 text-sm font-medium text-gray-500">No se encontraron militantes en este núcleo</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { reactive } from "vue";
import Input from "../ui/input/Input.vue";
import {PlusIcon, SearchIcon, TrashIcon} from "lucide-vue-next";
import {Button} from "@/components/ui/button";

const selectedNucleo = ref("");
const { cores, militantes } = defineProps<{ cores: any[], militantes: any[] }>()

const formData = reactive({
  fecha: "",
  hora: "",
  lugar: "",
  nucleo: "",
  secretario: ""
});
const person = ref([{ nombre: "", cargo: ""}]);
const estado = ref("presente")
const cargos = [
    'Miembro del secretariado',
    'Secretario General',
]
const addPerson = () => {
  person.value.push({ nombre: "", cargo: "" });
}
const headers = [
  "No.",
  "Nombre",
  "Apellidos",
  "Estado",
  "Causa",
]
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
