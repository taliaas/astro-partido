<template>
  <!-- Modal -->
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/50" @click="closeModal"></div>

    <!-- Modal Content -->
    <div
      class="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6 border-b">
        <h2 class="text-2xl font-semibold">Detalles del Militante</h2>
        <p class="text-muted-foreground mt-1">
          Información completa de {{ militants?.firstname }}
          {{ militants?.lastname }}
        </p>
      </div>

      <div class="p-6 space-y-6" v-if="militants">
        <!-- Información Personal -->
        <div class="bg-white shadow-sm rounded-lg border">
          <div class="p-4 border-b">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <UsersIcon class="w-5 h-5" />
              Información Personal
            </h3>
          </div>
          <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-sm font-medium text-muted-foreground"
                >Nombre</Label
              >
              <p class="text-lg font-semibold">
                {{ militants.firstname }}
              </p>
            </div>
            <div>
              <Label class="text-sm font-medium text-muted-foreground"
                >Apellido</Label
              >
              <p class="text-lg font-semibold">
                {{ militants.lastname }}
              </p>
            </div>
            <div>
              <Label class="text-sm font-medium text-muted-foreground"
                >Carnet de Identidad</Label
              >
              <p class="text-lg">{{ militants.ci }}</p>
            </div>
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="bg-white shadow-sm rounded-lg border">
          <div class="p-4 border-b">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <MailIcon class="w-5 h-5" />
              Información de Contacto
            </h3>
          </div>
          <div class="p-4 space-y-4">
            <div class="flex items-center gap-3">
              <MailIcon class="w-4 h-4 text-muted-foreground" />
              <div>
                <Label class="text-sm font-medium text-muted-foreground"
                  >Email</Label
                >
                <p>{{ militants.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <PhoneIcon class="w-4 h-4 text-muted-foreground" />
              <div>
                <Label class="text-sm font-medium text-muted-foreground"
                  >Teléfono</Label
                >
                <p>{{ militants.phone }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <MapPinIcon class="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <Label class="text-sm font-medium text-muted-foreground"
                  >Dirección</Label
                >
                <p>{{ militants.address }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Organizacional -->
        <div class="bg-white shadow-sm rounded-lg border">
          <div class="p-4 border-b">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <BuildingIcon class="w-5 h-5" />
              Información Organizacional
            </h3>
          </div>
          <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label class="text-sm font-medium text-muted-foreground"
                >Organización</Label
              >
              <p class="text-lg font-semibold">
                {{ militants.organization }}
              </p>
            </div>
            <div>
              <Label class="text-sm font-medium text-muted-foreground"
                >Núcleo</Label
              >
              <p class="text-lg font-semibold">
                {{ militants.core.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- transfer -->
        <div class="bg-white shadow-sm rounded-lg border">
          <div class="p-4 border-b">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <ArrowRightLeftIcon class="w-5 h-5" />
              Historial de transferencias ({{ militants.transfer?.length }})
            </h3>
          </div>
          <div class="p-4">
            <div v-if="militants.transfer?.length > 0" class="space-y-4">
              <div
                v-for="traslado in militants.transfer"
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
              Historial de Sanciones ({{ militants.sancions?.length }})
            </h3>
          </div>
          <div class="p-4">
            <div v-if="militants.sancions?.length > 0" class="space-y-4">
              <div
                v-for="sancion in militants.sancions"
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

      <div class="p-6 border-t flex justify-end gap-2">
        <Button variant="outline" @click="closeModal"> Cerrar </Button>
        <Button
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Exportar
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import Label from "@/components/ui/label/Label.vue";
import type { Militant } from "@/interface/Militante";
import { format } from "date-fns";
import {
  AlertTriangleIcon,
  ArrowRightLeftIcon,
  BuildingIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
} from "lucide-vue-next";

const { militants, closeModal } = defineProps<{
  militants: Militant | null;
  closeModal: () => void;
}>();
</script>
