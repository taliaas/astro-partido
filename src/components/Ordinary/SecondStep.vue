<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h3 class="text-lg font-medium">Orden del Día</h3>
      <div>
        <Button
          @click="addAgendaItem"
          class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
        >
          <PlusIcon
            class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90"
          />
          Agregar punto
        </Button>
      </div>
    </div>
    <div class="rounded border">
      <table class="w-full">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">Número</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Descripción</th>
            <th class="h-12 w-[100px] px-4 align-middle"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in agendaItems" :key="index" class="border-b">
            <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.description"
                class="w-full bg-transparent focus:outline-none"
                :placeholder="'Descripción del punto ' + (index + 1)"
              />
            </td>
            <td class="p-4 align-middle">
              <button
                @click="removeAgendaItem(index)"
                class="text-destructive hover:text-destructive/90 transition-colors duration-200"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Acuerdos Table -->
    <div class="space-y-4">
      <div class="flex justify-between">
        <h3 class="text-lg font-medium">Acuerdos</h3>
        <div class="flex justify-end">
          <Button
            @click="addAgreement"
            class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
          >
            <PlusIcon
              class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90"
            />
            Agregar acuerdo
          </Button>
        </div>
      </div>

      <div class="rounded-md border">
        <table class="w-full">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">
                Número
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
                <input
                  type="text"
                  v-model="item.description"
                  class="w-full bg-transparent focus:outline-none"
                  placeholder="Descripción"
                />
              </td>
              <td class="p-4 align-middle">
                <input
                  type="text"
                  v-model="item.responsible"
                  class="w-full bg-transparent focus:outline-none"
                  placeholder="Responsable"
                />
              </td>
              <td class="p-4 align-middle">
                <Input
                  type="date"
                  v-model="item.date"
                  class="w-1/2 border-none rounded bg-transparent focus:outline-none"
                />
              </td>
              <td class="p-4 align-middle">
                <button
                  @click="removeAgreement(index)"
                  class="text-destructive hover:text-destructive/90"
                >
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
        <Button
          @click="addTravel"
          class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
        >
          <PlusIcon
            class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90"
          />
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
                <input
                  type="text"
                  v-model="item.name"
                  class="w-full bg-transparent focus:outline-none"
                  placeholder="Nombre"
                />
              </td>
              <td class="p-4 align-middle">
                <input
                  type="text"
                  v-model="item.reason"
                  class="w-full bg-transparent focus:outline-none"
                  placeholder="Motivo"
                />
              </td>
              <td class="p-4 align-middle">
                <input
                  type="text"
                  v-model="item.destination"
                  class="w-full bg-transparent focus:outline-none"
                  placeholder="Destino"
                />
              </td>
              <td class="p-4 align-middle">
                <input
                  type="text"
                  v-model="item.dates"
                  class="w-full bg-transparent focus:outline-none"
                  placeholder="Fechas"
                />
              </td>
              <td class="p-4 align-middle">
                <select
                  v-model="item.status"
                  class="w-full bg-transparent focus:outline-none rounded"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </td>
              <td class="p-4 align-middle">
                <button
                  @click="removeTravel(index)"
                  class="text-destructive hover:text-destructive/90"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import FirstStep from "src/components/FirstStep.vue";
import Textarea from "./ui/textarea/Textarea.vue";
import Input from "./ui/input/Input.vue";
import Button from "./ui/button/Button.vue";

import { PlusIcon, TrashIcon } from "lucide-vue-next";

const agendaItems = ref([{ description: "" }]);

const agreements = ref([{ description: "", responsible: "", date: "" }]);

const travels = ref([
  { name: "", reason: "", destination: "", dates: "", status: "pendiente" },
]);

const addAgendaItem = () => {
  agendaItems.value.push({ description: "" });
};

const removeAgendaItem = (index) => {
  agendaItems.value.splice(index, 1);
};

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
  ordenDelDia: "",
  acuerdos: "",
  salidasExtranjero: "",
});
</script>
