<template>
  <div class="space-y-4">
    <!-- Configuración de notificaciones -->
    <div class="space-y-4">
      <div class="rounded-lg border bg-card shadow-sm">
        <div class="p-6">
          <h4 class="text-lg font-semibold">Notificaciones por Email</h4>
          <p class="text-sm text-muted-foreground">
            Configure qué emails recibe
          </p>

          <div class="mt-6 space-y-4">
            <div
              v-for="(setting, index) in emailSettings"
              :key="index"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-2">
                <component class="h-4 w-4 text-muted-foreground" />
                <div class="grid gap-0.5">
                  <div class="font-medium">{{ setting.title }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ setting.description }}
                  </div>
                </div>
              </div>
              <div class="">

              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-lg border bg-card shadow-sm">
        <div class="p-6">
          <h4 class="text-lg font-semibold">Notificaciones en la Aplicación</h4>
          <p class="text-sm text-muted-foreground">
            Configure qué notificaciones aparecen en el sistema
          </p>

          <div class="mt-6 space-y-4">
            <div
              v-for="(setting, index) in appSettings"
              :key="index"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-2">
                <component class="h-4 w-4 text-muted-foreground" />
                <div class="grid gap-0.5">
                  <div class="font-medium">{{ setting.title }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ setting.description }}
                  </div>
                </div>
              </div>
              <div
                class=""
              >

              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          class="rounded-md bg-button px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const emailSettings = [
  {
    title: "Adición de Usuario",
    description: "Recibir emails cuando se añaden nuevos usuarios",
    id: 1,
  },
  {
    title: "Cambios de Rol",
    description: "Recibir emails cuando se modifican roles de usuario",
    id: 2,
  },
  {
    title: "Cambios de Permisos",
    description: "Recibir emails cuando se modifican permisos",
    id: 3,
  },
];

// Configuración de notificaciones en la aplicación
const appSettings = ref([
  {
    title: "Adición de Usuario",
    description: "Mostrar notificaciones cuando se añaden nuevos usuarios",
  },
  {
    title: "Cambios de Rol",
    description: "Mostrar notificaciones cuando se modifican roles de usuario",
  },
  {
    title: "Eventos",
    description: "Mostrar notificaciones de los eventos creados",
  },
  {
    title: "Alertas",
    description:
      "Mostrar notificaciones sobre el cambio de comportamiento de los indicadores",
  },
]);

</script>
