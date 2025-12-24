<template>
  <!-- Create Dialog -->
  <Dialog open>
    <DialogContent class="font-medium">
      <DialogHeader>
        <DialogTitle class="text-xl">
          <h2 class="text-xl font-semibold leading-none tracking-tight">
            {{ currentMember ? "Editar militante" : "Añadir militante" }}
          </h2>
        </DialogTitle>
        <DialogDescription>
          <p class="text-md text-muted-foreground">
            {{
              currentMember
                ? "Actualizar la información de los militantes"
                : "Complete los datos para agregar un nuevo militante"
            }}
          </p>
        </DialogDescription>
      </DialogHeader>
      {{ form.values }}
      <form
        @submit="saveMember($event)"
        class="grid grid-cols-2 space-y-4 gap-2"
      >
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
        </div>
        <div class="space-y-2">
          <FormField v-slot="{ componentField }" name="sexo">
            <FormItem>
              <FormLabel class=""> Sexo </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Seleccione el sexo"
                  required
                  :="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="space-y-2"></div>
        <div class="space-y-2"></div>
        <div class="space-y-2"></div>
        <div class="space-y-2"></div>

        <div class="flex justify-end gap-2"></div>
      </form>
      <DialogFooter>
        <DialogClose>
          <Button type="button" variant="outline" @click="close">
            Cancelar</Button
          >
        </DialogClose>
        <Button type="submit">
          {{ currentMember ? "Actualizar" : "Añadir" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Militant } from "@/interface/Militante";
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
  currentMember: Militant | null;
  close: () => void;
}>();

const form = useForm<MilitanteSchema>({
  validationSchema: toTypedSchema(militanteSchema),
  initialValues: {
    id: String(currentMember?.id) || "",
    lastname: currentMember?.lastname || "",
    address: currentMember?.address || "",
    ci: currentMember?.ci || "",
    firstname: currentMember?.firstname || "",
    organization: currentMember?.organization || "PCC",
    phone: currentMember?.phone || "",
    core: currentMember?.core.id || "",
    email: currentMember?.email || "",
    abscents: currentMember?.abscents,
    clasificacion: currentMember?.clasificacion,
    cuenta_propia: currentMember?.cuenta_propia,
    CIPCC: currentMember?.CIPCC || "",
    date: currentMember?.date,
    expediente: currentMember?.expediente,
    fundador: currentMember?.fundador,
    militant_doble: currentMember?.militant_doble,
    nivel_escolar: currentMember?.nivel_escolar || "",
    raza: currentMember?.raza,
    religion: currentMember?.religion || "",
    sexo: currentMember?.sexo,
    user: currentMember?.user,
    work: currentMember?.work || "",
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
