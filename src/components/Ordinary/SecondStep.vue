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
    <div v-for="(item, index) in agendaItems">
      <div>
        <FormField :name="'development.' + index" v-slot="{ componentField }">
          <FormItem class="">
            <FormLabel class="text-md"
              >{{ index + 1 }}.
              {{ values.order?.[index] || `Punto ${index + 1}` }}</FormLabel
            >
            <FormControl>
              <Textarea rows="4" v-bind="componentField"></Textarea>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { PlusIcon, TrashIcon } from "lucide-vue-next";
import { Button } from "../ui/button";
import Textarea from "../ui/textarea/Textarea.vue";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useFormContext } from "vee-validate";

const { values } = useFormContext();
const agendaItems = ref([{ description: "" }]);

const addAgendaItem = () => {
  agendaItems.value.push({ description: "" });
};

const removeAgendaItem = (index: any) => {
  agendaItems.value.splice(index, 1);
};
</script>
