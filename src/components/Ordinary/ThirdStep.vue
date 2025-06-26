<template>
  <!-- Acuerdos Table -->
  <div class="space-y-4 my-4">
    <div class="flex justify-between">
      <label for="agreements" class="block text-md font-medium text-gray-700"
        >Acuerdos</label
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
                    <input
                      type="text"
                      v-bind="componentField"
                      class="w-full bg-transparent focus:outline-none"
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
                    <input
                      type="text"
                      v-bind="componentField"
                      class="w-full bg-transparent focus:outline-none"
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
                    <input
                      type="date"
                      v-bind="componentField"
                      class="w-1/2 border-none rounded bg-transparent focus:outline-none"
                      :name="'agreements.' + index + '.fecha'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <button
                @click="removeAgreement(index)"
                type="button"
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
  <div class="space-y-4 my-4">
    <div class="flex justify-between">
      <label for="salidas" class="block text-md font-medium text-gray-700"
        >Salidas al Extranjero</label
      >
      <Button
        type="button"
        @click="addTravel"
        variant="outline"
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
            <th class="h-12 px-4 text-left align-middle font-medium">
              Destino
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium">
              Fecha de ida
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium">
              Fecha de regreso
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium">Estado</th>
            <th class="h-12 w-[100px] px-4 align-middle"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in travels" :key="index" class="border-b">
            <td class="p-4 align-middle">
              <FormField
                :name="'extranjero.' + index + '.nombre'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <input
                      type="text"
                      v-bind="componentField"
                      class="w-full bg-transparent focus:outline-none"
                      placeholder="Nombre"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <FormField
                :name="'extranjero.' + index + '.motivo'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <input
                      type="text"
                      v-bind="componentField"
                      class="w-full bg-transparent focus:outline-none"
                      placeholder="Motivo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <FormField
                :name="'extranjero.' + index + '.destino'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <input
                      type="text"
                      v-bind="componentField"
                      class="w-full bg-transparent focus:outline-none"
                      placeholder="Destino"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <FormField
                :name="'extranjero.' + index + '.fechaIda'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <input
                      type="date"
                      v-bind="componentField"
                      class="w-full bg-transparent focus:outline-none"
                      placeholder="Fecha"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <FormField
                :name="'extranjero.' + index + '.fechaRegreso'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <input
                      type="date"
                      v-bind="componentField"
                      class="w-full bg-transparent focus:outline-none"
                      placeholder="Fecha"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <FormField
                :name="'extranjero.' + index + '.estado'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <select
                      v-bind="componentField"
                      class="w-full bg-transparent focus:outline-none rounded"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <button
                @click="removeTravel(index)"
                type="button"
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
        <label for="circulo" class="block text-md font-medium text-gray-700">
          Próximo círculo de estudios políticos
        </label>
        <Input
          type="date"
          required
          id="circulo"
          name="fechaCP"
          v-model="formData.circuloEstudios"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import Textarea from "../ui/textarea/Textarea.vue";
import Input from "../ui/input/Input.vue";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-vue-next";
import FormItem from "../ui/form/FormItem.vue";
import FormMessage from "../ui/form/FormMessage.vue";
import FormLabel from "../ui/form/FormLabel.vue";
import FormControl from "../ui/form/FormControl.vue";
import { FormField } from "@/components/ui/form";

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
