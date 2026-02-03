<template>
  <div class="p-4">
    <Card class="container mx-auto">
      <CardHeader>
        <div class="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            <span class="flex items-center gap-1.5">{{ event.status }} </span>
          </Badge>
          <Badge variant="default">
            <span class="flex items-center gap-1.5">{{ event.type }} </span>
          </Badge>
        </div>
        <CardTitle class="text-2xl">{{ event.title }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="mt-2 flex flex-col gap-6">
          <div class="">
            <div class="flex gap-3 text-md">
              <div class="flex items-center gap-3 py-4">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-lg bg-background/80"
                >
                  <Calendar class="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p class="text-sm font-medium capitalize text-foreground">
                    {{ formatDate(event.date) }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ getRelativeTime(event.date) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-lg bg-background/80"
                >
                  <Clock class="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p class="text-sm font-medium text-foreground">
                    {{ formatTime(event.date) }}
                  </p>
                  <p class="text-xs text-muted-foreground">Hora de inicio</p>
                </div>
              </div>

              <div v-if="event.place" class="flex items-center">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center"
                >
                  <MapPin class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="mt-0.5 truncate font-medium">
                    {{ event.place }}
                  </p>
                  <p class="text-muted-foreground text-sm">Ubicación</p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="event.details" class="rounded-lg border bg-card p-4">
            <div class="mb-3 flex items-center gap-2">
              <div class="bg-muted border p-2 rounded-md">
                <FileText class="h-4 w-4 text-blue-600" />
              </div>

              <p
                class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Descripción
              </p>
            </div>
            <p class="text-sm leading-relaxed text-foreground/90">
              {{ event.details }}
            </p>
          </div>
          <div
            v-if="event.responsables.length"
            class="flex items-start gap-3 rounded-lg border bg-card p-4"
          >
            <div class="bg-muted border p-2 rounded-md">
              <Users2 class="h-4 w-4 text-blue-600" />
            </div>
            <div class="min-w-0 flex-1">
              <p
                class="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Responsable
              </p>
              <div v-for="resp in event.responsables">
                <p class="mt-0.5 truncate text-sm font-medium">
                  {{ resp.name }}
                </p>
                <p class="truncate text-xs text-muted-foreground">
                  {{ resp.email }}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div
            class="flex flex-wrap items-center justify-between gap-4 text-md text-muted-foreground"
          >
            <div class="flex items-center gap-4">
              <span>Creado: {{ formatShortDate(event.createdAt) }}</span>
              <span>Por: {{ event.owner.name }}</span>
            </div>
            <span class="font-mono uppercase tracking-wider opacity-50">
              ID: {{ event.id }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
import type { EventItem } from "@/components/Event/EventsManage.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Separator from "@/components/ui/separator/Separator.vue";
import type { EventStatus } from "@/enum/Event";
import { Calendar, Clock, FileText, MapPin, Users2 } from "lucide-vue-next";

const { event } = defineProps<{
  event: EventItem;
}>();

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const eventDate = new Date(date);
  const diffTime = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Hace ${Math.abs(diffDays)} dia${Math.abs(diffDays) !== 1 ? "s" : ""}`;
  } else if (diffDays === 0) {
    return "Hoy";
  } else if (diffDays === 1) {
    return "Manana";
  } else if (diffDays <= 7) {
    return `En ${diffDays} dias`;
  } else {
    return formatShortDate(date);
  }
}

const statusConfig: Record<EventStatus, { color: string; bgColor: string }> = {
  Programado: {
    color: "bg-chart-2/20 text-chart-2 border-chart-2/30",
    bgColor: "bg-chart-2/10",
  },
  "En curso": {
    color: "bg-primary/20 text-primary border-primary/30",
    bgColor: "bg-primary/10",
  },
  Completado: {
    color: "bg-success/20 text-success border-success/30",
    bgColor: "bg-success/10",
  },
  Cancelado: {
    color: "bg-destructive/20 text-destructive border-destructive/30",
    bgColor: "bg-destructive/10",
  },
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("es", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
</script>
