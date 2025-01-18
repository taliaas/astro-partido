<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h3 class="text-lg font-medium">Orden del Día</h3>
      <div>
        <Button
          @click="addAgendaItem"
          type="button"
          variant="outline"
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
            <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">
              No.
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium">
              Descripción
            </th>
            <th class="h-12 w-[100px] px-4 align-middle"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in agendaItems"
            :key="index"
            class="border-b"
          >
            <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.description"
                class="w-full bg-transparent focus:outline-none"
                :name="'order.' + index"
                placeholder="Descripción"
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
  </div>
  <div class="space-y-4">
    <h2 class="text-lg mt-8 mb-4 font-bold">Desarrollo</h2>
    <div class="">
      <label for="chequeo" class="block text-md font-medium text-gray-700"
        >1. Chequeo de acuerdos</label
      >
      <Textarea
        id="chequeo"
        name="chequeo"
        v-model="formData.chequeo"
        rows="4"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="Chequeo de acuerdos"
      >
      </Textarea>
    </div>
    <div class="">
      <label for="orient" class="block text-md font-medium text-gray-700"
        >2. Orientaciones del Organismo Superior</label
      >
      <Textarea
        id="orient"
        name="orientaciones"
        v-model="formData.orientaciones"
        rows="4"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="Orientaciones del Organismo Superior"
      ></Textarea>
    </div>
    <div>
      <label for="analisis" class="block text-md font-medium text-gray-700"
        >3. Análisis y discusiones</label
      >
      <Textarea
        id="analisis"
        name="analisis"
        v-model="formData.analisis"
        rows="4"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="Análisis y discusiones"
      ></Textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import { PlusIcon, TrashIcon } from "lucide-vue-next";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Textarea from "../ui/textarea/Textarea.vue";

const formData = reactive({
  ordenDelDia: "",
  orientaciones: "",
  chequeo: "",
  analisis: "",
});
const agendaItems = ref([{ description: "" }]);

const addAgendaItem = () => {
  agendaItems.value.push({ description: "" });
};

const removeAgendaItem = (index) => {
  agendaItems.value.splice(index, 1);
};
</script>
