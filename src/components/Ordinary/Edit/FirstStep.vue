<template>
  <div class="space-y-8">
    <div class="mt-4 w-3/4">
      <div class="flex justify-between gap-4">
        <FormField name="core" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Núcleo</FormLabel>
            <FormControl>
              <!-- Nucleo -->
              <Select v-bind="componentField">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="nucleo in cores"
                      :key="nucleo.id"
                      :value="nucleo.id"
                      >{{ nucleo.name }}</SelectItem
                    >
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="fecha" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Fecha de la reunión</FormLabel>
            <FormControl>
              <Input
                type="date"
                id="fecha"
                required
                v-bind="componentField"
                class="w-42"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="hora" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Hora</FormLabel>
            <FormControl>
              <Input
                type="time"
                id="hora"
                required
                v-bind="componentField"
                class="w-36"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="lugar" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Lugar</FormLabel>
            <FormControl>
              <Input
                type="text"
                required
                v-bind="componentField"
                class="w-min-[300px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- 3. Invitados -->
    <div class="rounded">
      <div class="flex justify-between">
        <label class="block my-2 text-md font-medium text-gray-700"
          >Invitados y Participantes</label
        >
        <Button
          @click="addPerson"
          type="button"
          variant="outline"
          class="group inline-flex items-center m-3 justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
        >
          <PlusIcon
            class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90"
          />
          Agregar
        </Button>
      </div>
      <table class="min-w-full divide-y rounded-md divide-gray-200 border">
        <thead class="bg-gray-100 rounded">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              No.
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nombre y Apellidos
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Cargo
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) of person" :key="index" class="border-b">
            <td class="p-4 align-middle">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <FormField
                :name="'invitados.' + index + '.nombre_apellidos'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <Input
                      type="text"
                      v-bind="componentField"
                      class="w-full px-2 shadow-none border-none"
                      placeholder="Nombre"
                    />
                  </FormControl>
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <FormField
                :name="'invitados.' + index + '.cargo'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <select
                      type="text"
                      v-bind="componentField"
                      class="p-2 border rounded"
                    >
                      <option value="">Seleccione un cargo</option>
                      <option
                        v-for="cargo in cargos"
                        :key="cargo"
                        :value="cargo"
                      >
                        {{ cargo }}
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 text-center align-middle">
              <button
                @click="removeInvitados(index)"
                type="button"
                class="text-destructive hover:text-destructive/90"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Empty State -->
      <div
        v-if="person.length === 0"
        class="text-center py-16 border border-gray-300 rounded"
      >
        <div
          class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center"
        >
          <SearchIcon class="h-6 w-6" />
        </div>
        <h3 class="font-medium text-gray-500">
          No hay invitados o participantes
        </h3>
      </div>
    </div>

    <!-- 4. Relación de Asistencia -->
    <div class="overflow-x-auto mt-4 space-y-4">
      <label class="block mb-3 text-md font-medium text-gray-700"
        >Relación de Militantes del Núcleo</label
      >
      <table class="min-w-full divide-y rounded divide-gray-200 border">
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(abs, index) of abscents" :key="index">
            <td class="p-6 text-left whitespace-nowrap">
              <FormField
                :name="'militante.' + index + '.id'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <Input class="hidden" v-bind="componentField" />
                  </FormControl>
                </FormItem>
              </FormField>
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ abs.firstname }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ abs.lastname }}
            </td>
            <td class="py-4 whitespace-nowrap">
             
              <FormField
                :name="'abscents.' + index + '.estado'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <select
                      v-bind="componentField"
                      class="px-2 py-2 rounded bg-white"
                    >
                      <option value="presente">Presente</option>
                      <option value="virtual">Virtual</option>
                      <option value="ausente">Ausente</option>
                    </select>
                  </FormControl>
                </FormItem>
              </FormField>
              
            </td>
            <td
              class="w-1/5 px-6 py-4 whitespace-nowrap"
              v-if="estado[index] === 'ausente'"
            >
              <FormField
                :name="'abscents.' + index + '.reason'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <select
                      v-bind="componentField"
                      class="px-2 py-2 rounded bg-white"
                    >
                      <option
                        v-for="causa in absenceReasons"
                        :key="causa"
                        :value="causa"
                        class="rounded"
                      >
                        {{ causa }}
                      </option>
                    </select>
                  </FormControl>
                </FormItem>
              </FormField>
            </td>
            <td class="w-1/5 px-6 py-4 whitespace-nowrap" v-else>
              <!-- Celda vacía para mantener la estructura cuando no es ausente -->
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div
        v-if="abscents.length === 0"
        class="text-center py-16 border border-gray-300 rounded"
      >
        <div
          class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center"
        >
          <SearchIcon class="h-6 w-6" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-gray-500">
          No se encontraron militantes en este núcleo
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { reactive } from "vue";
import { PlusIcon, SearchIcon, TrashIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { absenceReasons, cargos } from "@/enum/absenceReasons.ts";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import Select from "@/components/ui/select/Select.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectGroup from "@/components/ui/select/SelectGroup.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import { useFormContext } from "vee-validate";
import type { FormSchema } from "@/components/Ordinary/Create/form_schema";

const { cores } = defineProps<{
  cores: any[];
}>();

defineEmits(["update"]);
const headers = ["No.", "Nombre", "Apellidos", "Estado", "Causa"];
const form = useFormContext<FormSchema>();
const person = computed(() => form.values.invitados);
const estado = reactive<string[]>([]);
const abscents = computed(() => form.values.militante)

const addPerson = () => {
  form.setFieldValue("invitados", [
    ...form.values.invitados,
    { nombre_apellidos: "", cargo: "" as any },
  ]);
};

const removeInvitados = (index: any) => {
  if (form.values.invitados.length === 1) form.setFieldValue("invitados", []);
  else
    form.setFieldValue("invitados", form.values.invitados.toSpliced(index, 1));
};
</script>
