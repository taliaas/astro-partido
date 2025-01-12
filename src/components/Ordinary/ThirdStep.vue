<template>

  <!-- Acuerdos Table -->
  <div class="space-y-4">
    <div class="flex justify-between">
      <h3 class="text-lg font-medium">Acuerdos</h3>
      <div class="flex justify-end">
        <Button @click="addAgreement" variant="outline"
                class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4">
          <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          Agregar acuerdo
        </Button>
      </div>
    </div>

    <div class="rounded-md border">
      <table class="w-full">
        <thead>
        <tr class="border-b bg-muted/50">
          <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">
            No.
          </th>
          <th class="h-12 px-4 text-left align-middle font-medium">Descripción</th>
          <th class="h-12 px-4 text-left align-middle font-medium">Responsable</th>
          <th class="h-12 px-4 text-left align-middle font-medium">Fecha</th>
          <th class="h-12 w-[100px] px-4 align-middle"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in agreements" :key="index" class="border-b">
          <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
          <td class="p-4 align-middle">
            <input type="text" v-model="item.description" class="w-full bg-transparent focus:outline-none"
                   placeholder="Descripción" />
          </td>
          <td class="p-4 align-middle">
            <input type="text" v-model="item.responsible" class="w-full bg-transparent focus:outline-none"
                   placeholder="Responsable" />
          </td>
          <td class="p-4 align-middle">
            <Input type="date" v-model="item.date" name="date1"
                   class="w-1/2 border-none rounded bg-transparent focus:outline-none" />
          </td>
          <td class="p-4 align-middle">
            <button @click="removeAgreement(index)" class="text-destructive hover:text-destructive/90">
              <TrashIcon class="h-4 w-4" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Salidas al Extranjero Table -->
  <div class="space-y-4">
    <div class="flex justify-between">
      <h3 class="text-lg font-medium">Salidas al Extranjero</h3>
      <Button @click="addTravel" variant="outline"
              class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4">
        <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
        Agregar salida
      </Button>
    </div>
    <div class="rounded-md border">
      <table class="w-full">
        <thead>
        <tr class="border-b bg-muted/50">
          <th class="h-12 px-4 text-left align-middle font-medium">Nombre</th>
          <th class="h-12 px-4 text-left align-middle font-medium">Motivo</th>
          <th class="h-12 px-4 text-left align-middle font-medium">Destino</th>
          <th class="h-12 px-4 text-left align-middle font-medium">Fechas</th>
          <th class="h-12 px-4 text-left align-middle font-medium">Estado</th>
          <th class="h-12 w-[100px] px-4 align-middle"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in travels" :key="index" class="border-b">
          <td class="p-4 align-middle">
            <input type="text" v-model="item.name" class="w-full bg-transparent focus:outline-none"
                   placeholder="Nombre" />
          </td>
          <td class="p-4 align-middle">
            <input type="text" v-model="item.reason" class="w-full bg-transparent focus:outline-none"
                   placeholder="Motivo" />
          </td>
          <td class="p-4 align-middle">
            <input type="text" v-model="item.destination" class="w-full bg-transparent focus:outline-none"
                   placeholder="Destino" />
          </td>
          <td class="p-4 align-middle">
            <input type="text" v-model="item.dates" class="w-full bg-transparent focus:outline-none"
                   placeholder="Fechas" />
          </td>
          <td class="p-4 align-middle">
            <select v-model="item.status" class="w-full bg-transparent focus:outline-none rounded">
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </td>
          <td class="p-4 align-middle">
            <button @click="removeTravel(index)" class="text-destructive hover:text-destructive/90">
              <TrashIcon class="h-4 w-4" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Observaciones y Firmas -->
  <section class="space-y-4">
    <div class="space-y-2">
      <label for="observaciones" class="block text-md font-medium text-gray-700">
        Observaciones generales
      </label>
      <Textarea id="observaciones" v-model="formData.observaciones" rows="4"
                class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></Textarea>
    </div>
  </section>

  <!-- Fechas Relevantes -->
  <section class="space-y-4 border-t">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div class="w-3/4 space-y-2">
        <label for="proxima" class="block text-md font-medium text-gray-700">
          Próxima reunión 
        </label>
        <Input type="date" id="proxima" v-model="formData.proximaReunion"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>
      <div class="w-3/4 space-y-2">
        <label for="preparacion" class="block text-md font-medium text-gray-700">
          Preparación próxima reunión
        </label>
        <Input type="date" id="preparacion" v-model="formData.preparacionReunion"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>
      <div class="w-3/4 space-y-2">
        <label for="circulo" class="block text-md font-medium text-gray-700">
          Próximo círculo de estudios políticos
        </label>
        <Input type="date" id="circulo" v-model="formData.circuloEstudios"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>
    </div>
  </section>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import Textarea from "../ui/textarea/Textarea.vue";
import Input from "../ui/input/Input.vue";
import {Button} from "@/components/ui/button";
import {PlusIcon, TrashIcon} from "lucide-vue-next";
const agreements = ref([{ description: "", responsible: "", date: "" }]);

const travels = ref([
  { name: "", reason: "", destination: "", dates: "", status: "pendiente" },
]);

const addAgreement = () => {
  agreements.value.push({ description: "", responsible: "", date: "" });
};

const removeAgreement = (index) => {
  agreements.value.splice(index, 1);
};

const addTravel = () => {
  travels.value.push({
    name: "",
    reason: "",
    destination: "",
    dates: "",
    status: "pendiente",
  });
};

const removeTravel = (index) => {
  travels.value.splice(index, 1);
};

const formData = reactive({
  acuerdos: "",
  salidasExtranjero: "",
  proximaReunion: "",
  preparacionReunion: "",
  circuloEstudios: "",
  observaciones: "",
});
</script>
