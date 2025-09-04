<template>
  <div class="space-y-2">
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
            v-for="(item, index) of agendaItems"
            :key="index"
            class="border-b"
          >
            <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <FormField :name="'order.' + index" v-slot="{ componentField }">
                <FormItem class="w-3/4">
                  <FormControl>
                    <Input
                      type="text"
                      required
                      v-bind="componentField"
                      placeholder="Descripción"
                      class="border-none shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <Button @click="removeAgendaItem(index)" variant="ghost">
                <TrashIcon class="h-4 w-4" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="space-y-4">
    <h2 class="text-lg mt-8 mb-4 font-bold">Desarrollo</h2>
    <div v-for="(item, index) of agendaItems" :key="index">
      <div>
        <FormField :name="'development.' + index" v-slot="{ componentField }">
          <FormItem class="">
            <FormLabel class="text-md"
              >{{ index + 1 }}. {{ form.values.order[index] }}</FormLabel
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
import { computed, ref } from "vue";
import { PlusIcon, TrashIcon } from "lucide-vue-next";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import { useFormContext } from "vee-validate";
import type { FormSchema } from "@/components/Ordinary/Create/form_schema";

const form = useFormContext<FormSchema>();

const agendaItems = computed(() =>form.values.order)

const addAgendaItem = () => {
  form.setFieldValue("order", [
    ...form.values.order,
    "",
  ]);
};

const removeAgendaItem = (index: any) => {
  if (form.values.order.length === 1)
    form.setFieldValue("order", []);
  else
    form.setFieldValue("order", form.values.order.toSpliced(index, 1));
};
</script>
