<template>
  <form
    @submit.prevent="submitForm"
    class="min-h-screen bg-gray-50 p-6"
    id="minuteForm"
  >
    <div
      class="mb-8 text-center transform transition-all duration-500 hover:scale-102"
    >
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Acta de Círculo Político
      </h1>
    </div>
    <div class="max-w-7xl mx-auto rounded overflow-hidden p-2">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 space-y-4">
        <!-- Núcleo -->
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
        <!-- fecha -->
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
        <!-- Hora -->
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
        <!-- Lugar -->
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
      </div>
      <!-- Causas de Ausencias -->

      <!-- Datos del Tema Evaluado -->
      <div class="space-y-2">
        <div>
          <Label for="temaTratado" class="block text-lg font-medium"
            >Tema evaluado en la reunión</Label
          >
          <div class="mt-1 relative rounded shadow-sm">
            <Textarea
              id="temaTratado"
              v-model="formData.tema"
              rows="3"
              required
              class="block w-full text-lg p-2 text-gray-500 border border-gray-300 bg-transparent focus:outline-none rounded transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              placeholder="Título del tema"
            />
          </div>
        </div>
      </div>

      <!-- Principales Planteamientos -->
      <div class="space-y-1 flex justify-between">
        <h3 class="text-lg font-medium flex items-center">Desarrollo</h3>
      </div>
      <div class="p-2">
        <div class="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            @click="
              developments.push({
                name: '',
                argument: '',
              })
            "
          >
            <PlusIcon class="size-4" />
            Añadir
          </Button>
        </div>
        <Table class="">
          <TableHeader class="uppercase">
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Planteamiento</TableHead>
              <TableHead class="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(development, developmentIndex) in developments">
              <TableCell>{{ developmentIndex + 1 }}.</TableCell>
              <TableCell>
                <FormField
                  :name="'development.' + developmentIndex + '.name'"
                  v-slot="{ componentField }"
                >
                  <FormItem class="w-3/4">
                    <FormControl>
                      <Select :="componentField">
                        <SelectTrigger>
                          <SelectValue placeholder="Responsable"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="item of militants"
                            :key="item.id"
                            :value="item.id + ''"
                            >{{ item.firstname }}
                            {{ item.lastname }}</SelectItem
                          >
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </TableCell>
              <TableCell
                ><FormField
                  :name="'development.' + developmentIndex + '.argument'"
                  v-slot="{ componentField }"
                >
                  <FormItem class="w-3/4">
                    <FormControl>
                      <Input
                        type="text"
                        v-bind="componentField"
                        placeholder="Descripción"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </TableCell>
              <TableCell class="text-center">
                <Button type="button" variant="outline">
                  <Trash class="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div
        class="flex p-4 border rounded text-muted-foreground shadow-sm justify-center"
      >
        No hay planeamientos
      </div>

      <div class="flex justify-between mt-4 py-4">
        <Button
          variant="outline"
          @click="cerrar"
          type="reset"
          class="w-1/3 px-4 py-2 rounded bg-gray-100 border border-gray-300 hover:bg-gray-200 shadow-md"
          >Cancelar
        </Button>
        <Button type="button" @click="">
          Enviar
          <SendHorizonal class="size-4" />
        </Button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import type ButtonVue from "@/components/ui/button/Button.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type InputVue from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Core, Militant } from "@/interface/Militante";
import type { CPDevelopment } from "@/interface/MinutePolitical";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { PlusIcon, SendHorizonal, Trash } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

const { cores, militants } = defineProps<{
  cores: Core[];
  militants: Militant[];
}>();

const selectedNucleo = ref(null);
const edit = ref(false);
const developments: CPDevelopment = [];

const formData = ref({
  lugar: "",
  hora: "",
  fecha: "",
  total_organismo: 0,
  total_trabajador: 0,
  ausentes: 0,
  causa: [] as { nombre: string; motivo: string }[],
  tema: "",
  planteamientos: "",
  valoracion: "",
  name_orientador: "",
  name_secretario: "",
});

const cerrar = async () => {
  await navigate("/minutes/");
};

const submitForm = async () => {
  try {
    await actions.political.createMinute.orThrow({
      ...formData.value,
      core: selectedNucleo.value,
    });
    toast.success("Se creó el acta correctamente");

    await navigate("/minutes");
  } catch (e) {
    if (e instanceof ActionError) {
      toast.error(e.message);
    }
  }
};
</script>
