<template>
  <div class="min-h-screen max-w-7xl mx-auto p-4">
    <Card class="w-full">
      <CardHeader>
        <div class="flex justify-between items-center">
          <CardTitle class="text-3xl font-bold">
            {{ acta?.name }} {{ acta?.id }}
            <Badge>{{ acta?.status }}</Badge>
          </CardTitle>
          <Button variant="outline" @click="exportarActa">
            <DownloadIcon class="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref="infoActa" class="space-y-8">
          <!-- Información General -->
          <section>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Información General
            </h2>
            <div class="grid grid-cols-4 gap-2 text-lg p-2">
              <div class="card">
                <span class="font-medium text-gray-700">Núcleo:</span>
                {{ acta?.core?.name }}
              </div>
              <div class="card">
                <span class="font-medium text-gray-700">Lugar:</span>
                {{ acta?.place }}
              </div>
              <div class="card">
                <span class="font-medium text-gray-700">Fecha:</span>
                {{ acta?.date }}
              </div>
              <div class="card">
                <span class="font-medium text-gray-700">Hora:</span>
                {{ acta?.hour }}
              </div>
              <div class="card">
                <span class="font-medium text-gray-700">Ausentes:</span>
                {{ getAbscents() }}
              </div>
              <div class="card">
                <span class="font-medium text-gray-700">Total:</span>
                {{ acta?.core?.militants.length }}
              </div>
              <div class="card">
                <span class="font-medium text-gray-700">Porciento:</span>
                {{ porciento }}
              </div>
            </div>
          </section>

          <!-- Asistencia -->
          <section title="Asistencia">
            <Label class="text-xl">Asistencia</Label>
            <div class="space-y-2">
              <div v-if="acta?.abscents.length !== 0" class="space-y-2">
                <p
                  v-if="acta?.abscents.filter((i) => i.estado === StatusAtte.A)"
                  class="text-muted-foreground"
                >
                  No hay militantes ausentes
                </p>
                <div
                  v-else
                  v-for="(causa, index) of acta?.abscents.filter(
                    (i) => i.estado === StatusAtte.A
                  )"
                  :key="index"
                  class="grid grid-cols-2"
                >
                  <Label class="text-xl">Ausente</Label>
                  <Label class="text-xl">Motivo</Label>

                  <div class="flex gap-2">
                    {{ causa.militant.firstname }}
                    {{ causa.militant.lastname }}
                  </div>
                  <div class="flex gap-2">
                    {{ causa.reason }}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-gray-700 space-y-2">
                <Label class="text-md">Invitados</Label>
                <Label class="text-md font-medium text-gray-700">
                  Responsabilidad
                </Label>
              </div>
              <div class="grid grid-cols-2 gap-4 text-gray-700 space-y-2">
                <Label class="font-medium text-md text-gray-700">
                  Del organismo superior:
                </Label>
                <Label class="font-medium text-md text-gray-700">
                  Responsabilidad
                </Label>
              </div>
            </div>
          </section>

          <!-- Orden del día -->
          <section>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Tema evaluado en la reunión
            </h2>
            <p class="text-md p-2">{{ acta?.political?.topic }}</p>
          </section>

          <!-- Desarrollo de la reunión -->
          <section title="Planteamientos">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Principales planteamientos realizados
            </h2>
            <div class="mb-4 text-md pr-6 pl-2">
              <p
                class="text-muted-foreground"
                v-if="!acta?.political?.development"
              >
                No hay desarrollo
              </p>
              <ol class="list-disc list-inside space-y-1 text-blue-600">
                <li
                  v-for="(item, index) in acta?.political?.development"
                  :key="index"
                  class="text-lg text-gray-800 text-justify"
                >
                  <span class="font-medium">
                    {{ item.militant.firstname }}
                    {{ item.militant.lastname }}:
                  </span>
                  <span>{{ item.argument }}</span>
                </li>
              </ol>
            </div>
          </section>

          <section title="opiniones">
            <div class="flex gap-2">
              <Label class="text-md font-medium">Opinaron:</Label>
              <p
                class="text-muted-foreground"
                v-if="!acta?.political?.development"
              >
                No hay opiniones
              </p>
              <p v-else>
                {{
                  acta.political?.development
                    .map((i) => i.militant.firstname)
                    .join(", ")
                }}
              </p>
            </div>
          </section>
          <section title="Valoracion">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Observaciones
            </h2>
            <p v-if="acta?.observaciones" class="text-md p-2">
              {{ acta?.observaciones }}
            </p>
            <p v-else class="text-muted-foreground">No hay observaciones</p>
          </section>
          <!-- Próximas fechas -->
          <section class="firmas">
            <Label class="text-xl font-semibold text-gray-800">Firmas</Label>

            <div class="flex gap-4">
              <Label class="text-md">Secretario del Núcleo:</Label>

              <p
                v-if="acta.core?.generalSecretary.firstname"
                class="font-normal"
              >
                {{ acta.core?.generalSecretary.firstname
                }}{{ acta.core?.generalSecretary.lastname }}
              </p>
              <p v-else>{{ "No especificado" }}</p>
            </div>
          </section>
        </div>
      </CardContent>
      <CardFooter
        class="flex justify-end border-t p-6"
        v-if="
          acta?.status === MinuteStatus.PENDIENTE ||
          acta?.status === MinuteStatus.APROBADA
        "
      >
        <div class="flex gap-5" v-if="acta?.status === MinuteStatus.PENDIENTE">
          <Button
            @click="updateStatus(MinuteStatus.APROBADA)"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Aprobando..." : "Aprobada" }}
          </Button>
        </div>
        <div v-if="acta?.status === MinuteStatus.APROBADA">
          <Button
            type="button"
            variant="ghost"
            class="px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100"
            @click="$emit('move')"
          >
            <ArrowLeft class="w-4 h-4" />
            Acta Ordinaria
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Badge from "@/components/ui/badge/Badge.vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Label from "@/components/ui/label/Label.vue";
import { MinuteStatus, StatusAtte } from "@/enum/Estado";
import type Minute from "@/interface/Minute";
import { exportar } from "@/lib/export_cp";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ArrowLeft, DownloadIcon } from "lucide-vue-next";
import { ref } from "vue";

const { acta } = defineProps<{
  acta: Minute;
}>();

defineEmits(["move"]);

const infoActa = ref<HTMLElement | null>(null);
const isSubmitting = ref(false);
const updateStatus = async (status: string) => {
  isSubmitting.value = true;
  try {
    await actions.political.updateStatusMinutes({ id: acta?.id, status });

    await navigate("/minutes");
  } catch (e) {
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
};
const exportarActa = () => {
  exportar(acta);
};

function getAbscents() {
  return (
    acta?.abscents
      ?.filter((item) => item.estado === StatusAtte.A)
      .reduce((acc, i) => acc + 1, 0) || 0
  );
}

let porciento = 0;
if (acta?.core?.militants?.length) {
  const absc = getAbscents();
  const parte = acta.core.militants.length - absc;
  porciento = absc === 0 ? 100 : (parte * 100) / acta.core.militants.length;
}
</script>
