<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { minuteSchema, type MinuteObserv } from "@/schemas/minute";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { minuteId } = defineProps<{
  minuteId: string;
}>();

const open = defineModel<boolean>("open");

const form = useForm<MinuteObserv>({
  validationSchema: toTypedSchema(minuteSchema),
  initialValues: {
    id: minuteId || "",
    observations: "",
  },
});
const saveObservation = form.handleSubmit(async (data: MinuteObserv) => {
  console.log(data);
  try {
    //llamar al actions de minute update
    actions.minute.addObversation({
      minuteId: data.id,
      observations: data.observations,
    });
    toast.success("Se ha creado la observación correctamente");
    open.value = false;
  } catch (error) {
    toast.error(
      "Ha ocurrido un error al intentar crear la observación del acta"
    );
    throw new Error("Error al guardar al usuario");
  }
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      {{ form.errors.value }}
      {{ minuteId }}
      <DialogHeader>
        <DialogTitle>Observaciones generales</DialogTitle>
      </DialogHeader>
      <form @submit="saveObservation($event)" class="space-y-4">
        <!-- Observaciones y Firmas -->
        <div class="space-y-2">
          <FormField name="observaciones" v-slot="{ componentField }">
            <FormItem class="">
              <FormControl>
                <Textarea class="w-full" v-bind="componentField"></Textarea>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" type="button">Cancelar</Button>
          </DialogClose>
          <Button type="submit" variant="default" class="cursor-pointer"
            >Guardar</Button
          >
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
