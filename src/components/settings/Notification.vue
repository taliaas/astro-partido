<template>
<div class="space-y-4">
    <div class="flex space-x-1 rounded-lg bg-muted p-1">
      <button
          v-for="tab in notificationTabs"
          :key="tab.id"
          @click="activeNotificationTab = tab.id"
          :class="[
                  'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                  activeNotificationTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Configuración de notificaciones -->
    <div v-if="activeNotificationTab === 'settings'" class="space-y-4">
      <div class="rounded-lg border bg-card shadow-sm">
        <div class="p-6">
          <h4 class="text-lg font-semibold">Notificaciones por Email</h4>
          <p class="text-sm text-muted-foreground">Configure qué emails recibe</p>

          <div class="mt-6 space-y-4">
            <div v-for="(setting, index) in emailSettings" :key="index" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <component :is="setting.icon" class="h-4 w-4 text-muted-foreground" />
                <div class="grid gap-0.5">
                  <div class="font-medium">{{ setting.title }}</div>
                  <div class="text-xs text-muted-foreground">{{ setting.description }}</div>
                </div>
              </div>
              <div class="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                <input
                    type="checkbox"
                    :id="`email-${index}`"
                    class="peer h-0 w-0 opacity-0"
                    :checked="setting.enabled"
                />
                <span
                    :class="[
                            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all',
                            setting.enabled ? 'translate-x-5 bg-primary' : ''
                          ]"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-lg border bg-card shadow-sm">
        <div class="p-6">
          <h4 class="text-lg font-semibold">Notificaciones en la Aplicación</h4>
          <p class="text-sm text-muted-foreground">Configure qué notificaciones aparecen en el sistema</p>

          <div class="mt-6 space-y-4">
            <div v-for="(setting, index) in appSettings" :key="index" class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <component :is="setting.icon" class="h-4 w-4 text-muted-foreground" />
                <div class="grid gap-0.5">
                  <div class="font-medium">{{ setting.title }}</div>
                  <div class="text-xs text-muted-foreground">{{ setting.description }}</div>
                </div>
              </div>
              <div class="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                <input
                    type="checkbox"
                    :id="`app-${index}`"
                    class="peer h-0 w-0 opacity-0"
                    :checked="setting.enabled"
                />
                <span
                    :class="[
                            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all',
                            setting.enabled ? 'translate-x-5 bg-primary' : ''
                          ]"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Guardar Configuración
        </button>
      </div>
    </div>

    <!-- Centro de notificaciones -->
    <div v-if="activeNotificationTab === 'notifications'" class="space-y-4">
      <div class="rounded-lg border bg-card shadow-sm">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h4 class="text-lg font-semibold">Centro de Notificaciones</h4>
              <p class="text-sm text-muted-foreground">Vea y gestione sus notificaciones del sistema</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="rounded-md border px-3 py-2 text-sm font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M13.73 21a9.97 9.97 0 0 1-10.42-9.78A10 10 0 0 1 13.27 3h.23a10 10 0 0 1 7.95 16"/><path d="m9 11 3 3L22 4"/></svg>
                Marcar Todo como Leído
              </button>
              <button class="rounded-md border px-3 py-2 text-sm font-medium">
                Limpiar Todo
              </button>
            </div>
          </div>

          <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-muted-foreground/50"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <h3 class="mt-4 text-lg font-medium">No hay notificaciones</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              ¡Está al día! No hay nuevas notificaciones para mostrar.
            </p>
          </div>

          <div v-else class="space-y-4">
            <div
                v-for="(notification, index) in notifications"
                :key="index"
                :class="[
                        'flex items-start gap-4 rounded-lg border p-4',
                        !notification.read ? 'bg-muted/50' : ''
                      ]"
            >
              <div
                  :class="[
                          'rounded-full p-2',
                          !notification.read ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        ]"
              >
                <component :is="notification.icon" class="h-4 w-4" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium">{{ notification.title }}</h4>
                  <span class="text-xs text-muted-foreground">{{ notification.time }}</span>
                </div>
                <p class="mt-1 text-sm text-muted-foreground">{{ notification.description }}</p>
              </div>
              <div v-if="!notification.read" class="h-2 w-2 rounded-full bg-primary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {ref} from "vue";

const activeNotificationTab = ref('settings')

// Pestañas de notificaciones
const notificationTabs = [
  { id: 'settings', name: 'Configuración' },
  { id: 'notifications', name: 'Notificaciones' },
]
// Actividades recientes
const recentActivities = [
  {
    title: 'Rol de Usuario Actualizado',
    description: 'Los permisos del rol Editor de Marketing fueron actualizados',
    time: 'Hace 2 horas',
  },
  {
    title: 'Nuevo Usuario Añadido',
    description: 'Sara Jiménez fue añadida al sistema',
    time: 'Ayer a las 15:45',
  },
  {
    title: 'Cambio de Permisos',
    description: 'Permiso de eliminación de documentos añadido a Gestores',
    time: 'Hace 2 días',
  },
  {
    title: 'Respaldo del Sistema',
    description: 'Respaldo automático del sistema completado con éxito',
    time: 'Hace 3 días',
  },
]

// Configuración de notificaciones por email
const emailSettings = [
  {
    title: 'Adición de Usuario',
    description: 'Recibir emails cuando se añaden nuevos usuarios',
    enabled: true,
  },
  {
    title: 'Cambios de Rol',
    description: 'Recibir emails cuando se modifican roles de usuario',
    enabled: true,
  },
  {
    title: 'Documento Compartido',
    description: 'Recibir emails cuando se comparten documentos contigo',
    enabled: true,
  },
  {
    title: 'Cambios de Permisos',
    description: 'Recibir emails cuando se modifican permisos',
    enabled: true,
  },
]

// Configuración de notificaciones en la aplicación
const appSettings = [
  {
    title: 'Adición de Usuario',
    description: 'Mostrar notificaciones cuando se añaden nuevos usuarios',
    enabled: true,
  },
  {
    title: 'Cambios de Rol',
    description: 'Mostrar notificaciones cuando se modifican roles de usuario',
    enabled: true,
  },
  {
    title: 'Actualizaciones del Sistema',
    description: 'Mostrar notificaciones para actualizaciones y mantenimiento del sistema',
    enabled: true,
  },
]

</script>

<style scoped>

</style>