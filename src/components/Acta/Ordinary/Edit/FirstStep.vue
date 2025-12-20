<template>
  <div class="space-y-8">
    <div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <FormField v-if="edit" name="name" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Nombre del acta</FormLabel>
            <FormControl>
              <!-- Nucleo -->
              <Input type="text" id="name" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-if="edit" name="core" v-slot="{ componentField }">
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
        <FormField name="date" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Fecha de la reunión</FormLabel>
            <FormControl>
              <Input
                type="date"
                id="fecha"
                v-bind="componentField"
                class="w-42"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="hour" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Hora</FormLabel>
            <FormControl>
              <Input
                type="time"
                id="hour"
                v-bind="componentField"
                class="w-36"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="place" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Lugar</FormLabel>
            <FormControl>
              <Input
                type="text"
                v-bind="componentField"
                class="max-w-2/3"
                placeholder="Ej: Aula 303"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Fechas Relevantes -->

        <div class="w-3/4 space-y-2">
          <FormField name="fechaProx" v-slot="{ componentField }">
            <FormItem>
              <FormLabel> Próxima reunión </FormLabel>
              <FormControl>
                <Input type="date" v-bind="componentField" />
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
                <Input type="date" v-bind="componentField" />
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
                <Input type="date" id="circulo" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
    <!-- 3. Invitados -->
    <div class="rounded">
      <div class="flex justify-between">
        <Label class="block my-2 text-md font-medium text-gray-700"
          >Invitados y Participantes</Label
        >
        <Button
          @click="invitados.push({ nombre_apellidos: '', cargo: '' as any })"
          type="button"
          variant="outline"
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
          <tr
            v-for="(item, index) of invitados.fields.value"
            :key="index"
            class="border-b"
          >
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
                v-slot="{ componentField, field }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <Select
                      type="text"
                      v-bind="componentField"
                      class="p-2 border rounded"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="cargo of cargos"
                          :key="cargo"
                          :value="cargo"
                          >{{ cargo }}</SelectItem
                        >
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 text-center align-middle">
              <button
                @click="invitados.remove(index)"
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
        v-if="invitados.fields.value.length === 0"
        class="text-center border rounded p-4 text-muted-foreground"
      >
        <h3 class="font-medium">No hay invitados ni participantes</h3>
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
          <tr v-for="(abs, index) of militantes" :key="index">
            <td class="p-6 text-left whitespace-nowrap">
              <FormField
                :name="'militant.' + index + '.id'"
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
              {{ abs?.firstname }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ abs?.lastname }}
            </td>
            <td class="py-4 whitespace-nowrap">
              <FormField
                :name="'abscents.' + index + '.estado'"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <Select
                      v-bind="componentField"
                      class="px-2 py-2 rounded bg-white"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Presente">Presente</SelectItem>
                        <SelectItem value="Virtual">Virtual</SelectItem>
                        <SelectItem value="Ausente">Ausente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              </FormField>
            </td>
            <FormField
              :name="'abscents.' + index + '.estado'"
              v-slot="{ field: estado }"
            >
              <td
                class="w-1/5 px-6 py-4 whitespace-nowrap"
                v-if="estado.value === 'Ausente'"
              >
                <FormField
                  :name="'abscents.' + index + '.reason'"
                  v-slot="{ componentField }"
                >
                  <FormItem class="w-3/4">
                    <FormControl>
                      <Select
                        v-bind="componentField"
                        class="px-2 py-2 rounded bg-white"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una causa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="causa in absenceReasons"
                            :key="causa"
                            :value="causa"
                            class="rounded"
                            >{{ causa }}</SelectItem
                          >
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </FormField>
              </td>
              <td class="w-1/5 px-6 py-4 whitespace-nowrap" v-else>
                <!-- Celda vacía para mantener la estructura cuando no es ausente -->
              </td>
            </FormField>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div
        v-if="militantes?.length === 0"
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
import { useFormContext, useFieldArray } from "vee-validate";
import type { FormSchema } from "@/components/Acta/Ordinary/Create/form_schema";
import type { Militant } from "@/interface/Militante";
import { Label } from "@/components/ui/label";

const {
  cores,
  edit = false,
  militantes,
} = defineProps<{
  cores?: any[];
  edit?: true;
  militantes: Militant[];
}>();

defineEmits(["update"]);
const headers = ["No.", "Nombre", "Apellidos", "Estado", "Causa"];

const invitados = useFieldArray<FormSchema["invitados"][number]>("invitados");
</script>
