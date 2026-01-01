<script setup lang="ts">
import ActaDisplay from "@/components/Acta/Ordinary/View/ActaDisplay.vue";
import Button from "@/components/ui/button/Button.vue";
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
import { Save } from "lucide-vue-next";
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
  <div class="p-6">
    <div class="flex gap-6 min-h-screen">
      <!-- Left: Acta content (2/3) -->
      <div class="w-2/3">
        <Card class="h-full overflow-hidden">
          <CardContent class="h-full p-0">
            <CardTitle class="text-2xl p-6 border-b">
              {{ minute.name }} # {{ minute.id }} - {{ minute.type }}
            </CardTitle>
            <CardDescription v-if="!minute.file" class="text-md px-4">
              {{ minute.createdAt }} | {{ minute.core?.name }} |
              {{ minute.status }}
            </CardDescription>
            <div v-if="minute.file" class="h-full">
              <embed
                :src="getFile(minute.id)"
                type="application/pdf"
                class="w-full h-full"
                title="Embedded PDF Viewer"
              />
            </div>
            <div v-else-if="minute.ordinary" class="h-full">
              <ScrollArea class="h-full p-6">
                <div class="max-w-6xl">
                  <ActaDisplay
                    :minute
                    :existsCP="false"
                    :abscents="minute.abscents"
                  />
                </div>
              </ScrollArea>
            </div>
            <div v-else class="p-6">
              <p class="text-muted-foreground">
                No hay contenido disponible para mostrar
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right: Observations (1/3) -->
      <div class="w-1/3">
        <Card class="h-full overflow-auto sticky top-6">
          <CardHeader>
            <CardTitle> Observaciones generales</CardTitle>
            <CardDescription
              >Escriba sus comentarios sobre el acta</CardDescription
            >
          </CardHeader>
          <CardContent class="flex-1">
            <form @submit="saveObservation($event)" class="space-y-4 h-10/12">
              <Textarea
                class="w-full h-full"
                placeholder="Escriba sus observaciones aquí..."
                v-bind:default-value="minute.observaciones"
                rows="6"
              />
              <Button type="submit" class="w-full">
                <Save class="size-4" />
                Guardar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
