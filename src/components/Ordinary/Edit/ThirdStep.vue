<template>
  <!-- Acuerdos Table -->
  <div class="space-y-4 my-4">
    <div class="flex justify-between">
      <Label for="agreements" class="block text-md font-medium text-gray-700"
        >Acuerdos</Label
      >
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
            <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">
              No.
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium">
              Descripción
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium">
              Responsable
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium">Fecha</th>
            <th class="h-12 w-[100px] px-4 align-middle"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in agreements" :key="index" class="border-b">
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
          <FormLabel>Observaciones generales</FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              rows="4"
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
                :="componentField"
                class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-3/4 space-y-2">
        <FormField name="preparacion" v-slot="{ componentField }">
          <FormItem>
            <FormLabel> Preparación próxima reunión </FormLabel>
            <FormControl>
              <Input
                type="date"
                required
                :="componentField"
                v-model="formData.preparacionReunion"
                class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="w-3/4 space-y-2">
        <FormField name="preparacion" v-slot="{ componentField }">
          <FormItem>
            <FormLabel> Próximo círculo de estudios políticos </FormLabel>
            <FormControl>
              <Input
                type="date"
                required
                id="circulo"
                name="fechaCP"
                v-model="formData.circuloEstudios"
                class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
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

const agreements = ref([{ description: "", responsible: "", date: "" }]);

const travels = ref([
  {
    name: "",
    reason: "",
    destination: "",
    dates: {
      ida: null,
      regreso: null,
    },
    status: "pendiente",
  },
]);

const addAgreement = () => {
  agreements.value.push({ description: "", responsible: "", date: "" });
};

const removeAgreement = (index: any) => {
  agreements.value.splice(index, 1);
};

const addTravel = () => {
  travels.value.push({
    name: "",
    reason: "",
    destination: "",
    dates: {
      ida: null,
      regreso: null,
    },
    status: "pendiente",
  });
};

const removeTravel = (index: any) => {
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
