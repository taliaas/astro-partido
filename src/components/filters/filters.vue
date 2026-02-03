<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "@/components/ui/select/Select.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import { MinuteStatus } from "@/enum/Estado";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";

interface CurrentUser {
  roleId: number;
  coreId: number;
  name: string;
}

const { showCoreFilter, currentUser } = defineProps<{
  showCoreFilter: boolean;
  currentUser: CurrentUser | null;
}>();

const filters = reactive({
  core: "",
  doc_type: "",
  indicators: "",
  dateFrom: "",
  dateTo: "",
  text: "",
});

const form = useForm<SearchData>({
  validationSchema: toTypedSchema(searchSchema),
  initialValues: {
    name: "",
    core: "",
    doc_type: "",
    keywords: "",
    status: null,
  },
});

// Lista predefinida de núcleos
const coresList = [
  "Ing. Industrial",
  "Arquitectura",
  "Automática",
  "CIPEL",
  "CEIS",
  "Telecomunicaciones",
  "CIME",
  "Rectorado",
  "VRD",
  "VREAS",
  "VREU",
  "VRIPG",
  "VRP",
  "CEIM-CETER",
  "TCM",
  "CEMAT",
  "CIFQ",
  "DPPD",
  "MARXISMO",
  "CECAT",
  "CIH",
  "Geociencias",
  "Química",
];

const clearFilters = () => {
  filters.core = "";
  filters.doc_type = "";
  filters.indicators = "";
  filters.dateFrom = "";
  filters.dateTo = "";
  filters.text = "";
};
</script>

<template>
  <div class="h-full flex flex-col bg-white border-r shadow-sm pt-12">
    <!-- Form Content -->
    <form
      action="/busqueda"
      method="post"
      class="px-6 py-2 space-y-6 flex flex-col flex-1"
    >
      <!-- Núcleo - Solo visible para Admin y Comité CUJAE -->
      <div v-if="showCoreFilter" class="space-y-4">
        <label class="text-sm font-medium text-gray-700">Núcleo</label>
        <select
          name="core"
          v-model="filters.core"
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">Todos los núcleos</option>
          <option v-for="nucleo in coresList" :key="nucleo" :value="nucleo">
            {{ nucleo }}
          </option>
        </select>
      </div>

      <!-- Tipo de documento -->
      <div class="space-y-4">
        <label class="text-sm font-medium text-gray-700"
          >Tipo de documento</label
        >
        <select
          name="doc_type"
          v-model="filters.doc_type"
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">Todos las actas</option>
          <option value="ro">Reunión Ordinaria</option>
          <option value="cp">Círculo Político</option>
        </select>
      </div>

      <!-- Estado -->
      <div class="space-y-4">
        <FormField v-slot="{ componentField }" name="status">
          <FormItem>
            <FormLabel> Estado </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Seleccione un núcleo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="(stats, index) in statuses"
                    :key="index"
                    :value="stats"
                  >
                    {{ stats }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Palabras clave -->
      <div class="space-y-4">
        <FormField v-slot="{ componentField }" name="keywords">
          <FormItem>
            <FormLabel> Palabras claves </FormLabel>
            <FormControl>
              <Input
                :="componentField"
                type="text"
                placeholder="Ej: guardia, crecimiento, sanción"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Footer Buttons -->
      <div
        class="flex justify-between p-2 pt-4 border-t border-gray-300 mt-auto"
      >
        <button
          type="button"
          @click.prevent="clearFilters"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Limpiar
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md"
        >
          Aplicar filtros
        </button>
      </div>
    </form>
  </div>
</template>
