<template>
  <div
    class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
  >
    <div class="flex flex-col space-y-1.5 text-center sm:text-left py-2">
      <h2 class="text-xl font-semibold leading-none tracking-tight">
        {{ currentMember ? "Editar militante" : "Añadir militante" }}
      </h2>
      <p class="text-md text-muted-foreground">
        {{
          currentMember
            ? "Actualizar la información de los militantes"
            : "Complete los datos para agregar un nuevo militante"
        }}
      </p>
    </div>
    <form @submit="saveMember($event)" class="space-y-4">
      <div class="space-y-2">
        <FormField v-slot="{ componentField }" name="firstname">
          <FormItem>
            <FormLabel class=""> Nombre </FormLabel>
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
      </div>
      <div class="space-y-2">
        <FormField v-slot="{ componentField }" name="lastname">
          <FormItem>
            <FormLabel class=""> Apellidos </FormLabel>
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
      </div>

      <div class="space-y-2">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel class=""> Correo </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Correo"
                required
                :="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="space-y-2">
        <FormField v-slot="{ componentField }" name="address">
          <FormItem>
            <FormLabel class=""> Dirección </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Dirección"
                required
                :="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="space-y-2">
        <FormField v-slot="{ componentField }" name="phone">
          <FormItem>
            <FormLabel class=""> Teléfono </FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder="Número de teléfono"
                required
                :="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="space-y-2">
        <FormField v-slot="{ componentField }" name="ci">
          <FormItem>
            <FormLabel class=""> CI </FormLabel>
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
      </div>

      <div class="flex justify-between gap-4">
        <div class="space-y-2">
          <FormField v-slot="{ componentField }" name="organization">
            <FormItem>
              <FormLabel class=""> Organización </FormLabel>
              <FormControl>
                <Select required :="componentField">
                  <SelectTrigger class="w-24">
                    <SelectValue placeholder="Seleccione la organización" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PCC"> PCC </SelectItem>
                    <SelectItem value="UJC"> UJC </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Label
            for=""
            class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          ></Label>
        </div>
        <div class="space-y-2">
          <FormField v-slot="{ componentField }" name="core">
            <FormItem>
              <FormLabel class=""> Núcleo </FormLabel>
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
        </div>
        <div class="space-y-2 basis-24">
          <FormField v-slot="{ componentField, field }" name="estado">
            <FormItem>
              <FormLabel class=""> Estado </FormLabel>
              <FormControl>
                <div class="flex gap-2 items-center">
                  <Checkbox
                    :model-value="componentField.modelValue"
                    @update:model-value="componentField.onChange"
                  />
                  <Label class="text-md">
                    {{ field.value ? "Activo" : "Inactivo" }}
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button type="button" variant="outline" @click="close">Cancelar</Button>
        <Button type="submit">
          {{ currentMember ? "Actualizar" : "Añadir" }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import { FormField } from "@/components/ui/form";
import FormControl from "@/components/ui/form/FormControl.vue";
import FormItem from "@/components/ui/form/FormItem.vue";
import FormLabel from "@/components/ui/form/FormLabel.vue";
import FormMessage from "@/components/ui/form/FormMessage.vue";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import Select from "@/components/ui/select/Select.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";
import type { Militantes } from "@/interface/Militante";
import {
  militanteSchema,
  type MilitanteSchema,
} from "@/schemas/militanteSchema";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { currentMember, cores, close } = defineProps<{
  cores: any[];
  currentMember: Militantes | null;
  close: () => void;
}>();

const form = useForm<MilitanteSchema>({
  validationSchema: toTypedSchema(militanteSchema),
  initialValues: {
    id: currentMember?.id || 0,
    lastname: currentMember?.lastname || "",
    address: currentMember?.address || "",
    ci: currentMember?.ci || "",
    estado: currentMember?.estado || true,
    firstname: currentMember?.firstname || "",
    organization: currentMember?.organization || "PCC",
    phone: currentMember?.phone || "",
    core: currentMember?.core.id || 0,
    email: currentMember?.email || "",
  },
});

const saveMember = form.handleSubmit(async (data: MilitanteSchema) => {
  try {
    if (currentMember) {
      await actions.militants.updateMember({
        ...data,
        core: { id: data.core },
      });
      toast.success("Militante actualizado correctamente");
    } else {
      await actions.militants.createMember({
        ...data,
        core: { id: data.core },
      });
      toast.success("Militante creado correctamente");
    }
    navigate("");
  } catch (error) {
    throw new Error("Error al guardar al usuario");
  }
});
</script>
