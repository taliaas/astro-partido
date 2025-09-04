<template>
  <div class="space-y-4">
    <!-- Acuerdos Table -->
    <div class="space-y-4 my-4">
      <div class="flex justify-between">
        <Label for="agreements" class="text-xl">Acuerdos</Label>
        <div class="flex justify-end">
          <Button
            type="button"
            @click="addAgreement"
            variant="outline"
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
              <th
                class="h-12 w-[100px] px-4 text-left align-middle font-medium"
              >
                No.
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                Descripción
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                Responsable
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                Fecha
              </th>
              <th class="h-12 w-[100px] px-4 align-middle"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) of agreements" :key="index" class="border">
              <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
              <td class="p-4 align-middle">
                <FormField
                  :name="'agreements.' + index + '.descripcion'"
                  v-slot="{ componentField }"
                >
                  <FormItem class="w-3/4">
                    <FormControl>
                      <Input
                        type="text"
                        v-bind="componentField"
                        class="border-none shadow-none"
                        placeholder="Descripción"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </td>
              <td class="p-4 align-middle">
                <FormField
                  :name="'agreements.' + index + '.responsable'"
                  v-slot="{ componentField }"
                >
                  <FormItem class="w-3/4">
                    <FormControl>
                      <Input
                        type="text"
                        v-bind="componentField"
                        class="border-none shadow-none"
                        placeholder="Responsable"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </td>
              <td class="p-4 align-middle">
                <FormField
                  :name="'agreements.' + index + '.fecha'"
                  v-slot="{ componentField }"
                >
                  <FormItem class="w-3/4">
                    <FormControl>
                      <Input
                        type="date"
                        v-bind="componentField"
                        class="border-none shadow-none"
                        :name="'agreements.' + index + '.fecha'"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </td>
              <td class="p-4 align-middle">
                <Button
                  @click="removeAgreement(index)"
                  type="button"
                  variant="ghost"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Observaciones y Firmas -->
    <section class="space-y-4 my-4">
      <div class="space-y-2">
        <FormField name="observaciones" v-slot="{ componentField }">
          <FormItem class="">
            <FormLabel class="text-xl">Observaciones generales</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></Textarea>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </section>

    <!-- Fechas Relevantes -->
    <section class="space-y-4 border-t">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div class="w-3/4 space-y-2">
          <FormField name="fechaProx" v-slot="{ componentField }">
            <FormItem>
              <FormLabel> Próxima reunión </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  required
                  v-bind="componentField"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="w-3/4 space-y-2">
          <FormField name="fechaPrep" v-slot="{ componentField }">
            <FormItem>
              <FormLabel> Preparación próxima reunión </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  required
                  v-bind="componentField"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="w-3/4 space-y-2">
          <FormField name="fechaCP" v-slot="{ componentField }">
            <FormItem>
              <FormLabel> Próximo círculo de estudios políticos </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  required
                  id="circulo"
                  v-bind="componentField"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-vue-next";
import {
  FormItem,
  FormField,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import { useFormContext } from "vee-validate";
import type { FormSchema } from "@/components/Ordinary/Create/form_schema";
import { computed } from "vue";

const form = useFormContext<FormSchema>();
const agreements = computed(() => form.values.agreements);

const addAgreement = () => {
  form.setFieldValue("agreements", [
    ...form.values.agreements,
    { descripcion: "", responsable: "", fecha: "" as any },
  ]);
};

const removeAgreement = (index: any) => {
  if (form.values.agreements.length === 1) form.setFieldValue("agreements", []);
  else
    form.setFieldValue(
      "agreements",
      form.values.agreements.toSpliced(index, 1)
    );
};
</script>
