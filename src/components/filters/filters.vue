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

const { cores } = defineProps<{
  cores: any[];
}>();

type SearchData = z.infer<typeof searchSchema>;
const searchSchema = z.object({
  name: z.string(),
  doc_type: z.string(),
  core: z.coerce.string(),
  status: z.nativeEnum(MinuteStatus).nullable(),
  keywords: z.string(),
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

const statuses = [
  MinuteStatus.CREATE,
  MinuteStatus.ERROR,
  MinuteStatus.PENDIENTE,
  MinuteStatus.PROCESADA,
  MinuteStatus.PROCESSING,
];

const typeMinutes = [
  { value: "Ordinaria", name: "Acta Ordinaria" },
  { value: "Circulo Politico", name: "Círculo Político" },
  { value: "Extraordinaria", name: "Acta Extraordinaria" },
];
</script>

<template>
  <div class="h-full flex flex-col bg-white border-r shadow-sm pt-12">
    <!-- Form Content -->
    <form
      name="busqueda"
      action="/busqueda"
      method="post"
      class="px-6 py-2 space-y-6 flex flex-col flex-1"
    >
      <!--Nombre -->
      <div class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel> Nombre </FormLabel>
            <FormControl>
              <Input type="text" placeholder="Nombre" :="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Tipo de documento -->
      <div class="space-y-4">
        <FormField v-slot="{ componentField }" name="doc_type">
          <FormItem>
            <FormLabel> Tipo de documento </FormLabel>
            <FormControl>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="type in typeMinutes"
                    :key="type.value"
                    :value="type.value"
                    >{{ type.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <!-- Nucleo -->
      <div class="space-y-4">
        <FormField v-slot="{ componentField }" name="core">
          <FormItem>
            <FormLabel> Núcleo </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Seleccione un núcleo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="nucleo in cores"
                    :key="nucleo.id"
                    :value="nucleo.id"
                  >
                    {{ nucleo.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
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
      <div class="flex justify-between gap-2">
        <Button type="reset" variant="outline"> Limpiar </Button>
        <Button type="submit"> Aplicar filtros </Button>
      </div>
    </form>
  </div>
</template>
