<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex justify-between p-6">
      <div class="flex gap-4 space-x-3">
        <Button type="button" size="icon" variant="outline" @click="previous">
          <ArrowLeft class="size-6" />
        </Button>
        <div>
          <h2 class="text-2xl font-semibold">Detalles del Militante</h2>
          <p class="text-muted-foreground mt-1">
            Información completa de {{ militant?.firstname }}
            {{ militant?.lastname }}
          </p>
        </div>
      </div>
      <Button variant="default"> <Download /> Exportar </Button>
    </div>

    <div class="p-6 space-y-6" v-if="militant">
      <!-- Información Personal -->
      <Card>
        <CardHeader class="border-b">
          <CardTitle class="flex items-center space-x-2">
            <UsersIcon class="w-5 h-5" />
            <p class="text-lg">Información Personal</p>
          </CardTitle>
        </CardHeader>
        <CardContent class="grid gap-6 sm:grid-cols-2">
          <div>
            <Label class="text-sm font-medium text-muted-foreground"
              >Nombre</Label
            >
            <p class="text-lg">
              {{ militant.firstname || "No especificado" }}
            </p>
          </div>
          <div>
            <Label class="text-sm font-medium text-muted-foreground"
              >Apellidos</Label
            >
            <p class="text-lg">
              {{ militant.lastname || "No especificado" }}
            </p>
          </div>
          <div>
            <Label class="text-sm font-medium text-muted-foreground"
              >Carnet de Identidad</Label
            >
            <p class="text-lg">{{ militant.ci || "No especificado" }}</p>
          </div>
          <div>
            <Label class="text-sm font-medium text-muted-foreground"
              >Sexo</Label
            >
            <p class="text-lg">{{ militant.sexo || "No especificado" }}</p>
          </div>

          <div>
            <Label class="text-sm font-medium text-muted-foreground"
              >Raza</Label
            >
            <p class="text-lg">{{ militant.raza || "No especificado" }}</p>
          </div>
          <div>
            <Label class="text-sm font-medium text-muted-foreground"
              >Religión</Label
            >
            <p class="text-lg">{{ militant.religion || "No especificado" }}</p>
          </div>
          <div>
            <Label class="text-sm font-medium text-muted-foreground"
              >Nivel Escolar</Label
            >
            <p class="text-lg">
              {{ militant.nivel_escolar || "No especificado" }}
            </p>
          </div>
          <div>
            <Label class="text-sm font-medium text-muted-foreground">
              Fundador
            </Label>
            <p className="mt-1 text-base text-foreground">
              {{ militant.fundador ? "Sí" : "No" }}
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Información de Contacto -->
      <Card>
        <CardHeader class="border-b">
          <CardTitle class="flex items-center space-x-2">
            <MailIcon class="w-5 h-5" />
            <p>Información de Contacto</p>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center gap-3">
            <MailIcon class="w-4 h-4 text-muted-foreground" />
            <div>
              <Label class="text-sm font-medium text-muted-foreground"
                >Email</Label
              >
              <p>{{ militant.email || "No especificado" }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <PhoneIcon class="w-4 h-4 text-muted-foreground" />
            <div>
              <Label class="text-sm font-medium text-muted-foreground"
                >Teléfono</Label
              >
              <p>{{ militant.phone || "No especificado" }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <MapPinIcon class="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <Label class="text-sm font-medium text-muted-foreground"
                >Dirección</Label
              >
              <p>{{ militant.address || "No especificado" }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Información Organizacional -->
      <Card>
        <CardHeader class="border-b">
          <CardTitle class="flex items-center space-x-2">
            <BuildingIcon class="w-5 h-5" />
            <p class="text-lg">Información Organizacional</p>
          </CardTitle>
        </CardHeader>
        <CardContent class="grid gap-6 sm:grid-cols-2">
          <div>
            <Label class="text-md font-medium text-muted-foreground"
              >Núcleo</Label
            >
            <p class="text-lg">
              {{ militant.core.name || "No especificado" }}
            </p>
          </div>
          <div>
            <Label class="text-md font-medium text-muted-foreground"
              >Organización</Label
            >
            <p class="text-lg">
              {{ militant.organization || "No especificado" }}
            </p>
          </div>
          <div>
            <Label class="text-md font-medium text-muted-foreground"
              >Puesto de Trabajo</Label
            >
            <p class="text-lg">
              {{ militant.work || "No especificado" }}
            </p>
          </div>
          <div>
            <Label class="text-md font-medium text-muted-foreground"
              >Clasificación</Label
            >
            <p class="text-lg">
              {{ militant.clasificacion || "No especificado" }}
            </p>
          </div>
          <div>
            <Label class="text-md font-medium text-muted-foreground"
              >CI PCC</Label
            >
            <p class="text-lg">
              {{ militant.CIPCC || "No especificado" }}
            </p>
          </div>
          <div>
            <Label class="text-md font-medium text-muted-foreground"
              >Expediente</Label
            >
            <p class="text-lg">
              {{ militant.expediente || "No especificado" }}
            </p>
          </div>
          <div>
            <Label class="text-md font-medium text-muted-foreground"
              >Cuenta Propia</Label
            >
            <p class="text-lg">
              {{ militant.cuenta_propia ? "Sí" : "No" }}
            </p>
          </div>

          <div>
            <Label class="text-md font-medium text-muted-foreground"
              >Militante Doble</Label
            >
            <p class="text-lg">
              {{ militant.militant_doble ? "Sí" : "No" }}
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- transfer -->
      <div class="bg-white shadow-sm rounded-lg border">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <ArrowRightLeftIcon class="w-5 h-5" />
            Historial de transferencias ({{ militant.transfer?.length }})
          </h3>
        </div>
        <div class="p-4">
          <div v-if="militant.transfer?.length > 0" class="space-y-4">
            <div
              v-for="traslado in militant.transfer"
              :key="traslado.id"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-semibold">
                    {{ traslado.origen }} → {{ traslado.destino }}
                  </p>
                  <p class="text-sm text-muted-foreground">
                    Fecha: {{ format(traslado.fecha, "yyyy-MM-dd") }}
                  </p>
                </div>
                <span
                  class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                >
                  {{ traslado.estado }}
                </span>
              </div>
              <p class="text-sm">
                <span class="font-medium">Motivo:</span>
                {{ traslado.details }}
              </p>
            </div>
          </div>
          <p v-else class="text-muted-foreground text-center py-4">
            No hay transferencias registradas
          </p>
        </div>
      </div>

      <!-- Sanciones -->
      <div class="bg-white shadow-sm rounded-lg border">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <AlertTriangleIcon class="w-5 h-5" />
            Historial de Sanciones ({{ militant.sancions?.length }})
          </h3>
        </div>
        <div class="p-4">
          <div v-if="militant.sancions?.length > 0" class="space-y-4">
            <div
              v-for="sancion in militant.sancions"
              :key="sancion.id"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-semibold">Causa: {{ sancion.causa }}</p>
                  <p class="text-sm text-muted-foreground">
                    Fecha: {{ format(sancion.fecha, "yyyy-MM-dd") }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {{ sancion.severidad }}
                  </span>
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {{ sancion.estado }}
                  </span>
                </div>
              </div>
              <p class="text-sm">
                <span class="font-medium">Descripción:</span>
                {{ sancion.details }}
              </p>
            </div>
          </div>
          <p v-else class="text-muted-foreground text-center py-4">
            No hay sanciones registradas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type CardContentVue from "@/components/ui/card/CardContent.vue";
import type CardTitleVue from "@/components/ui/card/CardTitle.vue";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import Label from "@/components/ui/label/Label.vue";
import type { Militant } from "@/interface/Militante";
import { navigate } from "astro:transitions/client";
import { format } from "date-fns";
import {
  AlertTriangleIcon,
  ArrowLeft,
  ArrowRightLeftIcon,
  BuildingIcon,
  Download,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
} from "lucide-vue-next";

const { militant } = defineProps<{
  militant: Militant | null;
}>();

const previous = () => {
  navigate("/settings/militants");
};
</script>
