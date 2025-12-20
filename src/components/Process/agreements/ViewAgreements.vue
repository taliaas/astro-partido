<script setup lang="ts">
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Agreements } from "@/interface/Militante";
import { X } from "lucide-vue-next";

const { agreement } = defineProps<{
  agreement: Agreements;
}>();
</script>

<template>
  <div class="p-2 space-y-4">
    <Card class="p-6">
      <CardHeader class="border-b-2">
        <CardTitle class="text-lg">Detalles del Acuerdo</CardTitle>
        <CardAction class="py-2" as-child>
          <a href="/process/agreements">
            <X class="size-4" />
          </a>
        </CardAction>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="text-md">
          <p class="font-semibold text-gray-700 uppercase">Descripción</p>
          {{ agreement?.descripcion }}
        </div>
        <div class="grid grid-cols-3 gap-6">
          <div>
            <p class="font-semibold text-gray-700 uppercase">Estado</p>
            <p class="text-lg mt-2">
              {{ agreement.status }}
            </p>
          </div>
          <div>
            <p class="font-semibold text-gray-700 uppercase">Fecha Creación</p>
            <p class="text-lg mt-2">
              {{ agreement.created }}
            </p>
          </div>
          <div>
            <p class="font-semibold text-gray-700 uppercase">
              Fecha Vencimiento
            </p>
            <p class="text-lg text-black mt-2">
              {{ agreement.enddate }}
            </p>
          </div>
        </div>
        <div class="space-y-6">
          <div>
            <p class="font-semibold text-gray-700 uppercase">Responsable</p>
            <p class="text-lg mt-2">
              {{ agreement.responsable.firstname }}
              {{ agreement.responsable.lastname }}
            </p>
          </div>
          <div>
            <p class="font-semibold text-gray-700 uppercase">Participantes</p>
            <p
              v-if="agreement.participants.length === 0"
              class="text-muted-foreground text-lg"
            >
              No hay participantes
            </p>
            <ul v-for="item in agreement.participants">
              <il>{{ item.firstname }} {{ item.lastname }}</il>
            </ul>
          </div>
        </div>

        <div class="text-md pt-4 border-t-2">
          <p class="font-semibold text-gray-700 uppercase mb-3">
            Detalles de Reunión
          </p>
          <div class="space-y-2">
            <p class="text-gray-700">
              <span class="font-semibold">Orden:</span>
              {{
                agreement.development?.order?.[0] || "No especificado el punto."
              }}
            </p>
            <p class="text-gray-700">
              <span class="font-semibold">Desarrollo:</span>
              {{ agreement.development.content || "No especificado" }}
            </p>
            <p class="text-gray-700">
              <span class="font-semibold">Fecha Próxima:</span>{{ " " }}
              {{ agreement.development.minute.fechaProx || "No especificada" }}
            </p>
            <p class="text-gray-700">
              <span class="font-semibold">Fecha Preparación:</span>{{ " " }}
              {{ agreement.development.minute.fechaPrep || "No especificada" }}
            </p>
            <p class="text-gray-700">
              <span class="font-semibold">Fecha CP:</span>{{ " " }}
              {{ agreement.development.minute.fechaCP || "No especificada" }}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
