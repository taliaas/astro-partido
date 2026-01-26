<template>
  <div class="min-h-screen max-w-7xl mx-auto p-4">
    <Card class="w-full">
      <CardHeader>
        <div class="flex justify-between items-center">
          <div class="space-y-2">
            <div class="flex gap-2 items-center">
              <FileText />
              <CardTitle class="text-3xl font-bold">
                {{ minute?.name }} {{ minute?.id }}
              </CardTitle>
              <Badge>{{ minute.status }}</Badge>
            </div>
            <p class="font-medium pl-2 text-muted-foreground">
              {{ minute?.type }}
            </p>
          </div>
          <Button variant="outline" @click="exportarActa">
            <DownloadIcon class="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref="infoActa" class="space-y-6">
          <!-- Información General -->
          <section class="border-b pb-2" title="Información General">
            <Label class="text-xl font-semibold"> Información General </Label>
            <div
              class="grid grid-cols-5 gap-2 text-lg p-2 text-muted-foreground"
            >
              <div class="card flex items-center gap-1">
                <Building2 class="size-5" />
                <span class="">Núcleo:</span>
                {{ minute?.core?.name || "-" }}
              </div>
              <div class="card flex items-center gap-1">
                <MapPin class="size-5" />
                <span>Lugar:</span>
                {{ minute?.place || "-" }}
              </div>
              <div class="card flex items-center gap-1">
                <Calendar class="size-5" />
                <span>Fecha:</span>
                {{ minute?.date || "-" }}
              </div>
              <div class="card flex items-center gap-1">
                <Clock class="size-5" />
                <span>Hora:</span>
                {{ minute?.hour || "-" }}
              </div>
              <div class="card flex items-center gap-1">
                <Calendar class="size-5" />
                <span>Creada:</span>
                {{ minute?.createdAt || "-" }}
              </div>
              <div class="card">
                <span>Ausentes:</span>
                {{ getAbscents() }}
              </div>
              <div class="card">
                <span>Total:</span>
                {{ minute?.core?.militants.length || "-" }}
              </div>
              <div class="card">
                <span>Porciento:</span>
                {{ porciento }}
              </div>
            </div>
          </section>

          <!-- Asistencia -->
          <section title="Asistencia" class="border-b pb-2">
            <div class="flex items-center gap-2">
              <Users class="size-5" />
              <Label class="text-xl">Asistencia</Label>
            </div>
            <div class="space-y-3">
              <div v-if="minute?.abscents.length !== 0" class="space-y-2">
                <p
                  v-if="
                    !minute?.abscents.filter((i) => i.estado === StatusAtte.A)
                  "
                  class="text-muted-foreground"
                >
                  No hay militantes ausentes
                </p>
                <div
                  v-else
                  v-for="(causa, index) of minute?.abscents.filter(
                    (i) => i.estado === StatusAtte.A,
                  )"
                  :key="index"
                  class="grid grid-cols-2"
                >
                  <Label class="text-md font-medium text-gray-700"
                    >Ausente</Label
                  >
                  <Label class="text-md font-medium text-gray-700"
                    >Motivo</Label
                  >

                  <div class="flex gap-2">
                    {{ causa.militant.firstname }}
                    {{ causa.militant.lastname }}
                  </div>
                  <div class="flex gap-2">
                    {{ causa.reason }}
                  </div>
                </div>
              </div>

              <div>
                <div class="grid grid-cols-2">
                  <Label class="text-md font-medium text-gray-700">
                    Invitados
                  </Label>
                  <Label class="text-md font-medium text-gray-700">
                    Responsabilidad
                  </Label>
                </div>
                <div v-for="item of minute.invitados" :value="item.id">
                  <span
                    class="grid grid-cols-2"
                    v-if="item.cargo !== Cargo.org_sup"
                  >
                    <p>{{ item.nombre_apellidos }}</p>
                    <p>{{ item.cargo }}</p>
                  </span>
                </div>
              </div>

              <div>
                <div class="grid grid-cols-2">
                  <Label class="text-md font-medium text-gray-700">
                    Del organismo superior:
                  </Label>
                  <Label class="text-md font-medium text-gray-700">
                    Responsabilidad
                  </Label>
                </div>
                <div v-for="item of minute.invitados" :value="item.id">
                  <span
                    class="grid grid-cols-2"
                    v-if="item.cargo === Cargo.org_sup"
                  >
                    <p>{{ item.nombre_apellidos || "-" }}</p>
                    <p>{{ item.cargo }}</p>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Orden del día -->
          <section title="topic" class="space-y-2">
            <div class="flex items-center gap-2">
              <MessageSquare />
              <Label class="text-xl font-semibold">Tema</Label>
            </div>
            <div class="p-2 bg-gray-100 rounded-md space-y-2">
              <p class="text-lg p-2">{{ minute?.political?.topic }}</p>
              <Label class="text-lg font-semibold">Desarrollo</Label>
              <div class="text-md pr-6 pl-2">
                <p
                  class="text-muted-foreground"
                  v-if="!minute?.political?.development"
                >
                  No hay desarrollo
                </p>
                <ol class="list-disc list-inside space-y-1 text-blue-600">
                  <li
                    v-for="(item, index) in minute?.political?.development"
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
              <div class="flex gap-2 text-lg">
                <Label class="font-medium text-lg">Opinaron:</Label>
                <p
                  class="text-muted-foreground"
                  v-if="!minute?.political?.development"
                >
                  No hay opiniones
                </p>
                <p v-else>
                  {{
                    minute.political?.development
                      .map((i) => i.militant.firstname)
                      .join(", ")
                  }}
                </p>
              </div>
            </div>
          </section>

          <section title="Valoracion">
            <h2 class="text-xl font-semibold">Observaciones</h2>
            <p v-if="minute?.observaciones" class="text-md p-2">
              {{ minute?.observaciones }}
            </p>
            <p v-else class="text-muted-foreground">No hay observaciones</p>
          </section>
          <!-- Próximas fechas -->
          <section class="firmas text-lg">
            <Label class="text-xl font-semibold text-gray-800">Firmas</Label>

            <div class="flex gap-4">
              <Label class="text-md">Secretario del Núcleo:</Label>

              <p
                v-if="minute.core?.generalSecretary.firstname"
                class="font-normal"
              >
                {{ minute.core?.generalSecretary.firstname
                }}{{ minute.core?.generalSecretary.lastname }}
              </p>
              <p v-else>{{ "No especificado" }}</p>
            </div>
          </section>
        </div>
      </CardContent>
      <CardFooter
        class="flex justify-end border-t p-6"
        v-if="
          minute?.status === MinuteStatus.PENDIENTE ||
          minute?.status === MinuteStatus.APROBADA
        "
      >
        <div
          class="flex gap-5"
          v-if="minute?.status === MinuteStatus.PENDIENTE"
        >
          <Button
            @click="updateStatus(MinuteStatus.APROBADA)"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Aprobando..." : "Aprobada" }}
          </Button>
        </div>
        <div v-if="minute?.status === MinuteStatus.APROBADA">
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
import { Cargo } from "@/enum/Cargo.ts";
import { MinuteStatus, StatusAtte } from "@/enum/Estado";
import type Minute from "@/interface/Minute";
import { exportarCP } from "@/lib/export_cp";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  DownloadIcon,
  FileText,
  MapPin,
  MessageSquare,
  Users,
} from "lucide-vue-next";
import { ref } from "vue";

const { acta: minute } = defineProps<{
  acta: Minute;
}>();

defineEmits(["move"]);

const infoActa = ref<HTMLElement | null>(null);
const isSubmitting = ref(false);
const updateStatus = async (status: string) => {
  isSubmitting.value = true;
  try {
    await actions.political.updateStatusMinutes({ id: minute?.id, status });

    await navigate("/minutes");
  } catch (e) {
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
};
const exportarActa = () => {
  exportarCP(minute);
};

function getAbscents() {
  return (
    minute?.abscents
      ?.filter((item) => item.estado === StatusAtte.A)
      .reduce((acc, i) => acc + 1, 0) || 0
  );
}

let porciento = 0;
if (minute?.core?.militants?.length) {
  const absc = getAbscents();
  const parte = minute.core.militants.length - absc;
  porciento = absc === 0 ? 100 : (parte * 100) / minute.core.militants.length;
}
</script>
