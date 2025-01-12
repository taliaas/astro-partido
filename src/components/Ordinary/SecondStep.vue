<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h3 class="text-lg font-medium">Orden del Día</h3>
      <div>
        <Button @click="addAgendaItem" variant="outline"
          class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4">
          <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          Agregar punto
        </Button>
      </div>
    </div>
    <div class="rounded border">
      <table class="w-full">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">No.</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Descripción</th>
            <th class="h-12 w-[100px] px-4 align-middle"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in agendaItems" :key="index" class="border-b">
            <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <input type="text" v-model="item.description" class="w-full bg-transparent focus:outline-none"
                placeholder="Descripción" />
            </td>
            <td class="p-4 align-middle">
              <button @click="removeAgendaItem(index)"
                class="text-destructive hover:text-destructive/90 transition-colors duration-200">
                <TrashIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import { PlusIcon, TrashIcon } from "lucide-vue-next";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
});
</script>
