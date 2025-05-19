<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Configuración</h1>
      </div>
    </div>

    <div class="flex flex-col gap-8 md:flex-row">
      <!-- Barra lateral de navegación -->
      <aside class="md:w-1/4">
        <nav class="grid gap-2 md:sticky md:top-20">
          <a
              v-for="item in navigationItems"
              :key="item.id"
              href="#"
              @click.prevent="activeSection = item.id"
              :class="[
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeSection === item.id
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.title }}</span>
          </a>
        </nav>
      </aside>

      <!-- Contenido principal -->
      <div class="flex-1 md:max-w-6xl">
        <!-- Vista General -->
        <div v-if="activeSection === 'general'" class="space-y-6">
          <!-- Pestañas -->
          <div class="space-y-4">
            <div class="flex space-x-1 rounded-lg bg-muted p-1">
              <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                  'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                ]"
              >
                {{ tab.name }}
              </button>
            </div>

            <!-- Contenido de pestañas -->
            <div v-if="activeTab === 'overview'" class="space-y-4">
              <!-- Tarjeta de resumen -->
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Resumen del Sistema</h4>
                  <p class="text-sm text-muted-foreground">Vea el estado actual de su sistema de gestión de documentos</p>

                  <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="stat in systemStats" :key="stat.title" class="rounded-lg border bg-card p-3 shadow-sm">
                      <div class="text-sm font-medium text-muted-foreground">{{ stat.title }}</div>
                      <div class="mt-1 text-2xl font-bold">{{ stat.value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pestaña de seguridad -->
            <div v-if="activeTab === 'security'" class="space-y-4">
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Configuración de Seguridad</h4>
                  <p class="text-sm text-muted-foreground">Configure los ajustes de seguridad de su sistema</p>

                  <div class="mt-6 space-y-6">
                    <!-- Políticas de contraseña -->
                    <div>
                      <h5 class="text-md font-medium mb-3">Políticas de Contraseña</h5>
                      <div class="space-y-3">
                        <div class="flex items-center justify-between">
                          <div>
                            <span class="font-medium">Longitud mínima</span>
                            <p class="text-sm text-muted-foreground">Mínimo de caracteres requeridos</p>
                          </div>
                          <select class="rounded-md border px-3 py-1 bg-background">
                            <option>8 caracteres</option>
                            <option>10 caracteres</option>
                            <option>12 caracteres</option>
                          </select>
                        </div>

                        <div class="flex items-center justify-between">
                          <div>
                            <span class="font-medium">Complejidad requerida</span>
                            <p class="text-sm text-muted-foreground">Requisitos de caracteres especiales</p>
                          </div>
                          <div class="flex items-center">
                            <input type="checkbox" id="complexity" class="rounded border-gray-300 mr-2" checked />
                            <label for="complexity">Activado</label>
                          </div>
                        </div>

                        <div class="flex items-center justify-between">
                          <div>
                            <span class="font-medium">Expiración de contraseña</span>
                            <p class="text-sm text-muted-foreground">Forzar cambio periódico</p>
                          </div>
                          <select class="rounded-md border px-3 py-1 bg-background">
                            <option>90 días</option>
                            <option>60 días</option>
                            <option>30 días</option>
                            <option>Nunca</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- Trazas de actividad -->
                    <div>
                      <h5 class="text-md font-medium mb-3">Trazas de Actividad</h5>
                      <div class="rounded-md border">
                        <table class="w-full text-sm">
                          <thead>
                          <tr class="border-b bg-muted/50 font-medium">
                            <th class="h-10 px-4 text-left">Usuario</th>
                            <th class="h-10 px-4 text-left">Acción</th>
                            <th class="h-10 px-4 text-left">Fecha</th>
                            <th class="h-10 px-4 text-left">IP</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(trace, index) in securityTraces" :key="index" class="border-b transition-colors hover:bg-muted/50">
                            <td class="p-4">{{ trace.user }}</td>
                            <td class="p-4">{{ trace.action }}</td>
                            <td class="p-4">{{ trace.date }}</td>
                            <td class="p-4">{{ trace.ip }}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="mt-2 text-xs text-muted-foreground">
                        Mostrando las últimas 5 actividades. <a href="#" class="text-primary hover:underline">Ver todas</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pestaña de apariencia -->
            <div v-if="activeTab === 'appearance'" class="space-y-4">
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Configuración de Apariencia</h4>
                  <p class="text-sm text-muted-foreground">Personalice la apariencia de su sistema</p>

                  <div class="mt-6 space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-medium">Tema</span>
                        <p class="text-sm text-muted-foreground">Seleccione el tema del sistema</p>
                      </div>
                      <select class="rounded-md border px-3 py-1 bg-background">
                        <option>Claro</option>
                        <option>Oscuro</option>
                        <option>Sistema</option>
                      </select>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-medium">Densidad</span>
                        <p class="text-sm text-muted-foreground">Ajuste la densidad de la interfaz</p>
                      </div>
                      <select class="rounded-md border px-3 py-1 bg-background">
                        <option>Compacta</option>
                        <option>Normal</option>
                        <option>Cómoda</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pestaña avanzada -->
            <div v-if="activeTab === 'advanced'" class="space-y-4">
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Configuración Avanzada</h4>
                  <p class="text-sm text-muted-foreground">Configure ajustes avanzados del sistema</p>

                  <div class="mt-6 space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-medium">Caché del sistema</span>
                        <p class="text-sm text-muted-foreground">Limpiar caché del sistema</p>
                      </div>
                      <button class="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">
                        Limpiar caché
                      </button>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-medium">Respaldo de datos</span>
                        <p class="text-sm text-muted-foreground">Configurar respaldos automáticos</p>
                      </div>
                      <div class="flex items-center">
                        <input type="checkbox" id="backup" class="rounded border-gray-300 mr-2" checked />
                        <label for="backup">Activado</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gestión de Usuarios -->
        <div v-if="activeSection === 'users'" class="space-y-6">
          <UserManage :users/>
        </div>

        <!-- Gestión de Roles -->
        <div v-if="activeSection === 'roles'" class="space-y-6">
          <RolesManage :roles/>
        </div>

        <!-- Gestión de Permisos -->
        <div v-if="activeSection === 'permissions'" class="space-y-6">
          <ClaimsManage :roles/>
        </div>

        <!-- Gestión de Notificaciones -->
        <div v-if="activeSection === 'notifications'" class="space-y-6">
          <div>
            <h3 class="text-lg font-medium">Configuración de Notificaciones</h3>
            <p class="text-sm text-muted-foreground">Administre cómo y cuándo recibe notificaciones</p>
          </div>

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
        </div>

        <!-- Gestión de Comites y Nucleos -->
        <div v-if="activeSection === 'comites'" class="space-y-6">
          <CoreManage />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserManage from "@/components/settings/UserManage.vue";
import RolesManage from "@/components/settings/RolesManage.vue";
import ClaimsManage from "@/components/settings/ClaimsManage.vue";
import CoreManage from "@/components/settings/CoreManage.vue";

const {users, roles} = defineProps<{
  users: any,
  roles: any,
}>();

// Estado de la aplicación
const activeSection = ref('general')
const activeTab = ref('overview')
const activeNotificationTab = ref('settings')

// Elementos de navegación
const navigationItems = [
  { id: 'general', title: 'General' },
  { id: 'users', title: 'Gestión de Usuarios' },
  { id: 'roles', title: 'Roles' },
  { id: 'permissions', title: 'Permisos'},
  { id: 'notifications', title: 'Notificaciones' },
  { id: 'comites', title: 'Cómite CUJAE'},
]

// Pestañas
const tabs = [
  { id: 'overview', name: 'Resumen' },
  { id: 'security', name: 'Seguridad' },
  { id: 'appearance', name: 'Apariencia' },
  { id: 'advanced', name: 'Avanzado' },
]

// Pestañas de notificaciones
const notificationTabs = [
  { id: 'settings', name: 'Configuración' },
  { id: 'notifications', name: 'Notificaciones' },
]

// Datos de estadísticas del sistema
const systemStats = [
  { title: 'Usuarios Activos', value: users.length },
  { title: 'Actas RO', value: '568' },
  { title: 'Actas CP', value: '456' },
  { title: 'Roles', value: roles.length },
  { title: 'Conjuntos de Permisos', value: '12' },
  { title: 'Tiempo de Actividad', value: '99.8%' },
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

// Trazas de seguridad
const securityTraces = [
  {
    user: 'admin@ejemplo.com',
    action: 'Inicio de sesión',
    date: 'Hoy, 14:32',
    ip: '192.168.1.105',
  },
  {
    user: 'maria@ejemplo.com',
    action: 'Cambio de permisos',
    date: 'Hoy, 11:15',
    ip: '192.168.1.120',
  },
  {
    user: 'juan@ejemplo.com',
    action: 'Documento eliminado',
    date: 'Ayer, 16:45',
    ip: '192.168.1.110',
  },
  {
    user: 'admin@ejemplo.com',
    action: 'Usuario creado',
    date: 'Ayer, 10:20',
    ip: '192.168.1.105',
  },
  {
    user: 'carlos@ejemplo.com',
    action: 'Intento de acceso fallido',
    date: '15/05/2023, 09:30',
    ip: '192.168.1.130',
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

// Notificaciones
const notifications = [
  {
    id: '1',
    title: 'Usuario Añadido',
    description: 'Juan Pérez añadió a Sara Martínez al sistema',
    time: 'Ahora mismo',
    read: false,
  },
  {
    id: '2',
    title: 'Permiso Cambiado',
    description: 'Admin cambió permisos de visualización para la carpeta Marketing',
    time: 'Hace 5 minutos',
    read: false,
  },
  {
    id: '3',
    title: 'Documento Compartido',
    description: 'Informe de Marketing Q2 ha sido compartido contigo',
    time: 'Hace 1 hora',
    read: true,
  },
  {
    id: '4',
    title: 'Rol Actualizado',
    description: 'Tu rol ha sido actualizado a Editor',
    time: 'Ayer',
    read: true,
  },
]


</script>
