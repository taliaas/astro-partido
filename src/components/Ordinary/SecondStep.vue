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
    {{ agendaItems }}
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
              <FormField :name="'order.' + index" v-slot="{ componentField }">
                <FormItem class="w-3/4">
                  <FormControl>
                    <input
                      type="text"
                      required
                      v-bind="componentField"
                      placeholder="Descripción"
                      class="w-full bg-transparent focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
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
      <FormField name="chequeo" v-slot="{ componentField }">
        <FormItem class="">
          <FormLabel>1. Chequeo de acuerdos</FormLabel>
          <FormControl>
            <Textarea
              rows="4"
              v-bind="componentField"
              placeholder="Chequeo de acuerdos"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></Textarea>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <div class="space-y-2">
      <FormField name="orientaciones" v-slot="{ componentField }">
        <FormItem class="">
          <FormLabel>2. Orientaciones del Organismo Superior</FormLabel>
          <FormControl>
            <Textarea
              rows="6"
              v-bind="componentField"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Orientaciones del Organismo Superior"
            ></Textarea>
          </FormControl>
        </FormItem>
      </FormField>
    </div>
    <div>
      <FormField name="analisis" v-slot="{ componentField }">
        <FormItem class="">
          <FormLabel>3. Análisis y discusiones</FormLabel>
          <FormControl>
            <Textarea
              rows="6"
              v-bind="componentField"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Análisis y discusiones"
            ></Textarea>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import { PlusIcon, TrashIcon } from "lucide-vue-next";
import { Button } from "../ui/button";
import Textarea from "../ui/textarea/Textarea.vue";
import { FormField } from "@/components/ui/form";
import FormItem from "@/components/ui/form/FormItem.vue";
import FormControl from "@/components/ui/form/FormControl.vue";
import FormMessage from "@/components/ui/form/FormMessage.vue";
import FormLabel from "@/components/ui/form/FormLabel.vue";

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

const removeAgendaItem = (index: any) => {
  agendaItems.value.splice(index, 1);
};
</script>
