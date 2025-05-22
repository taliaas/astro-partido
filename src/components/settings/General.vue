<template>
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
</template>
<script setup lang="ts">
import {ref} from "vue";

const { users, roles } = defineProps<{ users: any[], roles: any[] }>();
console.log(users);

const activeTab = ref('overview')

// Datos de estadísticas del sistema
const systemStats = [
  { title: 'Usuarios Activos', value: users.length },
  { title: 'Actas RO', value: '568' },
  { title: 'Actas CP', value: '456' },
  { title: 'Roles', value: roles.length },
  { title: 'Conjuntos de Permisos', value: '12' },
  { title: 'Tiempo de Actividad', value: '99.8%' },
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

</script>
