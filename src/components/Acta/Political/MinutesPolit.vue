<template>
  <form
    @submit.prevent="submitForm"
    class="min-h-screen bg-gray-50 p-6"
    id="minute-cp"
  >
    <div
      class="mb-8 text-center transform transition-all duration-500 hover:scale-102"
    >
      <h1 v-if="!edit" class="text-3xl font-bold text-gray-800 mb-2">
        Acta de {{ cp ? "Círculo Político" : "Extraordinaria" }}
      </h1>
      <h1 v-else class="text-3xl font-bold text-gray-800">
        Editar acta de {{ cp ? "Círculo Político" : "Extraordinaria" }}
      </h1>
    </div>
    <div class="max-w-7xl mx-auto rounded overflow-hidden p-2 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 space-y-4">
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
            <Plus
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
                <Button
                  variant="ghost"
                  @click="invitados.remove(index)"
                  type="button"
                  class="text-destructive hover:text-destructive/90"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
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
        <Label class="block mb-3 text-md font-medium text-gray-700"
          >Relación de Militantes del Núcleo</Label
        >
        <Table class="min-w-full divide-y rounded divide-gray-200 border">
          <TableHeader class="bg-gray-100">
            <TableRow>
              <TableHead v-for="header in headers" :key="header">
                {{ header }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="bg-white divide-y divide-gray-200">
            <TableRow v-for="(abs, index) of militants" :key="index">
              <TableCell class="p-6 text-left whitespace-nowrap">
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
              </TableCell>
              <TableCell class="px-6 py-4 whitespace-nowrap">
                {{ abs?.firstname }}
                {{ abs?.lastname }}
              </TableCell>
              <TableCell class="py-4 whitespace-nowrap">
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
              </TableCell>
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
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colspan="4">
                <div class="flex justify-end gap-2">
                  <Button size="icon" variant="outline">
                    <ArrowLeft />
                  </Button>
                  <Button size="icon" variant="outline"> <ArrowRight /></Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <!-- Empty State -->
        <div
          v-if="militants?.length === 0"
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

      <!-- Datos del Tema Evaluado -->
      <div class="py-4">
        <FormField name="topic" v-slot="{ componentField }">
          <FormItem>
            <FormLabel class="text-md">Tema</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                rows="3"
                required
                placeholder="Tema evaluado en la reunión ..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Principales Planteamientos -->
      <div class="space-y-4">
        <div class="flex justify-between">
          <h3 class="text-md font-medium">Desarrollo</h3>
          <Button
            type="button"
            @click="
              developments.push({
                argument: '',
                militant: { id: null },
                id: null,
              })
            "
            variant="outline"
          >
            <Plus class="size-4" /> Agregar Intervención</Button
          >
        </div>
        <Card
          class=""
          v-for="(item, developmentIndex) of developments.fields.value"
          :key="developmentIndex"
        >
          <CardContent>
            <div class="flex justify-between">
              <Label>Planteamiento no. {{ developmentIndex + 1 }}</Label>
              <Button
                type="button"
                variant="outline"
                @click="developments.remove(developmentIndex)"
              >
                <Trash class="size-4 text-destructive-foreground" />
              </Button>
            </div>
            <div class="space-y-2 py-2">
              <!-- Tomar bien al militante -->
              <FormField
                :name="`development.${developmentIndex}.militant.id`"
                v-slot="{ componentField }"
              >
                <FormItem>
                  <FormLabel>Militante</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="w-1/3">
                        <SelectValue placeholder="Seleccione un militante" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="item of militants" :value="item.id"
                          >{{ item.firstname }} {{ item.lastname }}</SelectItem
                        >
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :name="`development.${developmentIndex}.argument`"
                v-slot="{ componentField }"
              >
                <FormItem>
                  <FormLabel>Planteamiento</FormLabel>
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      rows="3"
                      required
                      placeholder="Escribir el planteamiento del militante..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
          <CardFooter class="flex justify-end"> </CardFooter>
        </Card>
      </div>

      <div class="flex justify-end gap-3 mt-4 py-4">
        <Button variant="outline" @click="cerrar" type="reset"
          >Cancelar
        </Button>
        <Button type="submit" form="minute-cp">
          Enviar
          <SendHorizonal class="size-4" />
        </Button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  cpForm,
  type FormCP,
} from "@/components/Acta/Ordinary/Create/form_schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardFooter from "@/components/ui/card/CardFooter.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  TableFooter,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { absenceReasons, cargos } from "@/enum/absenceReasons";
import { MinuteStatus, MinuteType } from "@/enum/Estado";
import { Reason } from "@/interface/Absent";
import type { Core, Militant } from "@/interface/Militante";
import type Minute from "@/interface/Minute";
import { toTypedSchema } from "@vee-validate/zod";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  SendHorizonal,
  Trash,
  TrashIcon,
} from "lucide-vue-next";
import { useFieldArray, useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";

const { cores, cp, edit, militants, minute } = defineProps<{
  cores: Core[];
  militants: Militant[];
  cp: boolean;
  edit: boolean;
  minute: Minute | null;
}>();
const headers = ["No.", "Nombre y Apellidos", "Estado", "Causa"];

const loading = ref(false);

const form = useForm({
  validationSchema: toTypedSchema(cpForm),
  initialValues: {
    id: minute?.id ?? "",
    core: minute?.core?.id ?? "",
    abscents:
      (minute?.abscents as any) ??
      militants?.map((i) => ({
        estado: "Presente" as const,
        reason: Reason.ENF,
        militanteId: i.id,
      })),
    date: (minute?.date as any) ?? "",
    hour: minute?.hour ?? "",
    invitados: minute?.invitados ?? [],
    observaciones: minute?.observaciones ?? "",
    place: minute?.place ?? "",
    status: minute?.status ?? MinuteStatus.CREATE,
    type: minute?.type ?? "",
    topic: minute?.political?.topic ?? "",
    development: minute?.political?.development ?? [
      {
        id: null,
        militant: { id: null },
        argument: "",
      },
    ],
  },
});

const developments =
  useFieldArray<FormCP["development"][number]>("development");
const invitados = useFieldArray<FormCP["invitados"][number]>("invitados");

const cerrar = async () => {
  await navigate("/minutes/");
};

const submitForm = async () => {
  loading.value = true;
  const data = form.values;
  data.core = { id: data.core };
  data.status = MinuteStatus.CREATE;
  try {
    if (!cp) {
      data.type = MinuteType.ex;
    }
    if (edit) {
      await actions.political.updateMinute.orThrow({
        id: data.id ?? "",
        data: data,
      });
      toast.success("Se actualizó el acta correctamente");
    } else {
      await actions.political.createMinute.orThrow({
        data,
        mode: "Model", //cambiar y pedir al usuario que lo cree
        type: "Circulo Politico",
      });
      toast.success("Se creó el acta correctamente");
    }

    await navigate("/minutes");
  } catch (e) {
    loading.value = false;
    if (e instanceof ActionError) {
      toast.error(e.message);
    }
  }
};
</script>
