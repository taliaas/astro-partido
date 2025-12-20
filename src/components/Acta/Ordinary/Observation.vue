<script setup lang="ts">
import ActaDisplay from "@/components/Acta/Ordinary/View/ActaDisplay.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type Minute from "@/interface/Minute";
import { minuteSchema, type MinuteObserv } from "@/schemas/minute";
import { getFile } from "@/utils/files";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const { minute } = defineProps<{
  minute: Minute;
}>();

const open = defineModel<boolean>("open");

const form = useForm<MinuteObserv>({
  validationSchema: toTypedSchema(minuteSchema),
  initialValues: {
    id: minute.id || "",
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
  <div class="p-6 flex">
    <div v-if="minute.file">
      <Card class="max-w-7xl p-6 flex-1 mx-6">
        <CardContent class="">
          <embed
            :src="getFile(minute.id)"
            type="application/pdf"
            width="100%"
            height="1000"
            title="Embedded PDF Viewer"
          />
        </CardContent>
      </Card>
    </div>
    <div v-else-if="minute.ordinary" class="flex-1">
      <ScrollArea class="px-6">
        <div class="max-w-6xl">
          <ActaDisplay :minute :existsCP="false" :abscents="minute.abscents" />
        </div>
      </ScrollArea>
    </div>
    <div v-else>
      <p class="text-muted-foreground">
        No hay contenido disponible para mostrar
      </p>
    </div>

    <Card class="w-1/3">
      <CardHeader>
        <CardTitle> Observaciones generales</CardTitle>
        <CardDescription
          >Resumen de las opiniones de la reunión</CardDescription
        >
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <form @submit="saveObservation($event)" class="space-y-4">
            <!-- Observaciones y Firmas -->
            <div class="space-y-2">
              <Textarea
                class="w-full"
                v-bind:default-value="minute.observaciones"
                rows="3"
              ></Textarea>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
