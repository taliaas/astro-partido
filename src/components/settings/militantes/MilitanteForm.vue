<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clasificacion, Nivel, Raza, Sexo } from "@/enum/Status";
import type { Core, Militant } from "@/interface/Militante";
import {
  militanteSchema,
  type MilitanteSchema,
} from "@/schemas/militanteSchema";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Loader2, Save } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { militant, cores, core } = defineProps<{
  militant?: Militant;
  cores: Core[];
  core: string | null;
}>();

const form = useForm<MilitanteSchema>({
  validationSchema: toTypedSchema(militanteSchema),
  initialValues: {
    id: String(militant?.id) || "",
    lastname: militant?.lastname || "",
    address: militant?.address || "",
    ci: militant?.ci || "",
    date: militant?.date,
    firstname: militant?.firstname || "",
    organization: militant?.organization || "PCC",
    phone: militant?.phone || "",
    core: militant?.core.id || Number(core) || 0,
    email: militant?.email || "",
    clasificacion: militant?.clasificacion,
    cuenta_propia: !!militant?.cuenta_propia,
    CIPCC: militant?.CIPCC || "",
    expediente: militant?.expediente ?? "",
    fundador: !!militant?.fundador,
    militant_doble: !!militant?.militant_doble,
    nivel_escolar: militant?.nivel_escolar,
    raza: militant?.raza,
    religion: militant?.religion || "",
    sexo: militant?.sexo,
    work: militant?.work || "",
  },
  validateOnMount: true,
});

const previous = () => {
  navigate("/settings/militants");
};

const saveMember = form.handleSubmit(async (data: MilitanteSchema) => {
  try {
    if (militant) {
      console.log(data.date);

      await actions.militants.updateMember.orThrow({
        ...data,
        core: { id: data.core },
      });
      toast.success("Militante actualizado correctamente");
    } else {
      console.log(data.date);
      await actions.militants.createMember.orThrow({
        ...data,
        core: { id: data.core },
      });
      toast.success("Militante creado correctamente");
    }
    navigate("/settings/militants");
  } catch (error) {
    throw new Error("Error al guardar al usuario");
  }
});
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-4">
    <div class="flex justify-between">
      <div class="flex gap-4 space-x-3">
        <Button type="button" size="icon" variant="outline" @click="previous">
          <ArrowLeft class="size-6" />
        </Button>
        <div>
          <h2 class="text-2xl font-medium">
            {{ militant ? "Editar Militante" : "Añadir militante" }}
          </h2>
          <p class="text-muted-foreground">
            {{
              militant
                ? " Actualice la información del militante"
                : "Complete los datos para agregar un nuevo militante"
            }}
          </p>
        </div>
      </div>
      <Button
        form="save-militant"
        type="submit"
        :disabled="form.isSubmitting.value || !form.meta.value.dirty"
      >
        <Loader2 v-if="form.isSubmitting.value" class="animate-spin" />
        <Save v-else />
        {{ form.isSubmitting.value ? "Guardando..." : "Guardar Cambios" }}
      </Button>
    </div>
    <form @submit="saveMember($event)" class="space-y-4 p-8" id="save-militant">
      <Card>
        <CardHeader>
          <CardTitle class="text-xl">Información Personal</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-2 gap-2">
          <FormField v-slot="{ componentField }" name="firstname">
            <FormItem>
              <FormLabel class=""> Nombre *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nombre"
                  required
                  :="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastname">
            <FormItem>
              <FormLabel class=""> Apellidos *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Apellidos"
                  required
                  :="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="ci">
            <FormItem>
              <FormLabel class=""> CI *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Carnet de Identidad"
                  required
                  :="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel class=""> Correo *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Correo"
                  required
                  :="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel class=""> Teléfono </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Número de teléfono"
                  :="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="address">
            <FormItem>
              <FormLabel class=""> Dirección </FormLabel>
              <FormControl>
                <Input type="text" placeholder="Dirección" :="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-xl">Datos Demográficos</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-4 gap-2">
          <FormField v-slot="{ componentField }" name="sexo">
            <FormItem>
              <FormLabel class=""> Sexo </FormLabel>
              <FormControl>
                <Select :="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in Sexo" :value="item">{{
                      item
                    }}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="raza">
            <FormItem>
              <FormLabel class=""> Raza </FormLabel>
              <FormControl>
                <Select :="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la raza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in Raza" :value="item">{{
                      item
                    }}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="nivel_escolar">
            <FormItem>
              <FormLabel class=""> Nivel Escolar </FormLabel>
              <FormControl>
                <Select required :="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el nivel escolar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in Nivel" :value="item">{{
                      item
                    }}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="religion">
            <FormItem>
              <FormLabel class=""> Religión </FormLabel>
              <FormControl>
                <Input type="text" placeholder="Religión" :="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-xl"
            >Información Laboral y Organizacional</CardTitle
          >
        </CardHeader>
        <CardContent class="space-y-2">
          <FormField v-slot="{ componentField }" name="core">
            <FormItem>
              <FormLabel class=""> Núcleo *</FormLabel>
              <FormControl>
                <Select required :="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el núcleo" />
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

          <div class="grid grid-cols-2 gap-2">
            <FormField v-slot="{ componentField }" name="organization">
              <FormItem>
                <FormLabel class=""> Organización </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Organización"
                    :="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="clasificacion">
              <FormItem>
                <FormLabel class=""> Clasificación </FormLabel>
                <FormControl>
                  <Select :="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la clasificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="item in Clasificacion"
                        :key="item"
                        :value="item"
                      >
                        {{ item }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="date">
              <FormItem>
                <FormLabel class=""> Fecha de incorporación </FormLabel>
                <FormControl>
                  <Input type="date" :="componentField" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="work">
              <FormItem>
                <FormLabel class=""> Puesto de Trabajo </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Puesto de Trabajo"
                    :="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="expediente">
              <FormItem>
                <FormLabel class=""> Expediente </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Expediente"
                    :="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="CIPCC">
              <FormItem>
                <FormLabel class=""> CI PCC </FormLabel>
                <FormControl>
                  <Input type="text" placeholder="CI PCC" :="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <FormField v-slot="{ field }" name="cuenta_propia">
              <FormItem class="flex">
                <FormControl>
                  <Checkbox
                    type="checkbox"
                    :model-value="field.checked"
                    @update:model-value="field.onChange"
                  />
                </FormControl>
                <FormLabel class=""> Trabajador por cuenta Propia </FormLabel>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ field }" name="fundador">
              <FormItem class="flex">
                <FormControl>
                  <Checkbox
                    type="checkbox"
                    :model-value="field.checked"
                    @update:model-value="field.onChange"
                  />
                </FormControl>
                <FormLabel class=""> Miembro fundador </FormLabel>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ field }" name="militant_doble">
              <FormItem class="flex">
                <FormControl>
                  <Checkbox
                    type="checkbox"
                    :model-value="field.checked"
                    @update:model-value="field.onChange"
                  />
                </FormControl>
                <FormLabel class=""> Militante Doble </FormLabel>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </Card>
    </form>
  </div>
</template>
