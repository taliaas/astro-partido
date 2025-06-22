<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="">
        <h2 class="text-2xl font-semibold">Trazas del Sistema</h2>
        <p class="text-gray-600 mt-1">Monitorea las actividades del sistema y acciones de usuarios en todos los módulos</p>
      </div>
    <!-- Tarjeta principal -->
    <div class="bg-white rounded-lg border shadow-sm">
      <div class="p-6">
        <!-- Tabla de trazas -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium text-gray-900">Acción</th>
                <th class="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                <th class="text-left py-3 px-4 font-medium text-gray-900">Módulo</th>
                <th class="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 w-24">Detalles</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="traza in trazas" 
                :key="traza.id"
                class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td class="py-3 px-4">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ traza.accion }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-3">
                    <div>
                      <div class="font-medium text-gray-900">{{ traza.usuario.nombre }}</div>
                      <div class="text-sm text-gray-500">{{ traza.usuario.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 font-medium text-gray-900">{{ traza.modulo }}</td>
                <td class="py-3 px-4 text-sm text-gray-500">{{ format(traza.creadoEn, 'yyyy-MM-dd') }}</td>
                <td class="py-3 px-4">
                  <button 
                    @click="abrirDetalle(traza)"
                    class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div 
      v-if="modalAbierto" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="cerrarModal"
    >
      <div 
        class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">Detalles de la Traza</h3>
              <p class="text-sm text-gray-600 mt-1">Información completa para la traza ID: {{ trazaSeleccionada?.id }}</p>
            </div>
            <button 
              @click="cerrarModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <div v-if="trazaSeleccionada" class="p-6 space-y-6">
          <!-- Acción y Módulo -->
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <div class="text-sm font-medium text-gray-500">Acción</div>
              <span 
                :class="obtenerClaseAccion(trazaSeleccionada.accion)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
              >
                {{ trazaSeleccionada.accion }}
              </span>
            </div>
            <div class="space-y-1 text-right">
              <div class="text-sm font-medium text-gray-500">Módulo</div>
              <div class="font-medium text-gray-900">{{ trazaSeleccionada.modulo }}</div>
            </div>
          </div>

          <!-- Información del Usuario -->
          <div class="space-y-3">
            <div class="text-sm font-medium text-gray-500 flex items-center gap-2">
              <UserIcon class="h-4 w-4" />
              Información del Usuario
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <img 
                    v-if="trazaSeleccionada.usuario.avatar" 
                    :src="trazaSeleccionada.usuario.avatar" 
                    :alt="trazaSeleccionada.usuario.nombre"
                    class="h-12 w-12 rounded-full object-cover"
                  />
                  <span v-else class="text-sm font-medium text-gray-600">
                    {{ obtenerIniciales(trazaSeleccionada.usuario.nombre) }}
                  </span>
                </div>
                <div class="space-y-1">
                  <div class="font-medium text-gray-900">{{ trazaSeleccionada.usuario.nombre }}</div>
                  <div class="text-sm text-gray-500">{{ trazaSeleccionada.usuario.email }}</div>
                  <div class="text-xs text-gray-400">ID: {{ trazaSeleccionada.usuario.id }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fecha y Hora -->
          <div class="space-y-3">
            <div class="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CalendarIcon class="h-4 w-4" />
              Fecha y Hora
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="font-mono text-sm text-gray-900">{{ formatearFechaCompleta(trazaSeleccionada.creadoEn) }}</div>
            </div>
          </div>

          <!-- ID de Entidad (si existe) -->
          <div v-if="trazaSeleccionada.idEntidad" class="space-y-3">
            <div class="text-sm font-medium text-gray-500 flex items-center gap-2">
              <HashIcon class="h-4 w-4" />
              ID de Entidad
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="font-mono text-sm text-gray-900">{{ trazaSeleccionada.idEntidad }}</div>
            </div>
          </div>

          <!-- Metadatos Adicionales -->
          <div class="space-y-3">
            <div class="text-sm font-medium text-gray-500 flex items-center gap-2">
              <DatabaseIcon class="h-4 w-4" />
              Metadatos de la Traza
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="font-medium text-gray-500">ID de Traza</div>
                  <div class="font-mono text-gray-900">{{ trazaSeleccionada.id }}</div>
                </div>
                <div>
                  <div class="font-medium text-gray-500">Estado</div>
                  <div class="text-green-600">Completado</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón de cerrar -->
          <div class="flex justify-end pt-4">
            <button 
              @click="cerrarModal"
              class="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { XIcon, UserIcon, CalendarIcon, HashIcon, DatabaseIcon } from 'lucide-vue-next'

// Definir la interfaz de traza
const trazas = ref([
  {
    id: "traza-1",
    accion: "CREAR",
    modulo: "Gestión de Usuarios",
    creadoEn: new Date("2024-01-15T10:30:00Z"),
    usuario: {
      id: "usuario-1",
      nombre: "Ana García",
      email: "ana@ejemplo.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    idEntidad: 1234,
  },
  {
    id: "traza-2",
    accion: "ACTUALIZAR",
    modulo: "Catálogo de Productos",
    creadoEn: new Date("2024-01-15T09:45:00Z"),
    usuario: {
      id: "usuario-2",
      nombre: "Carlos Rodríguez",
      email: "carlos@ejemplo.com",
    },
    idEntidad: 5678,
  },
  {
    id: "traza-3",
    accion: "ELIMINAR",
    modulo: "Procesamiento de Pedidos",
    creadoEn: new Date("2024-01-15T08:20:00Z"),
    usuario: {
      id: "usuario-3",
      nombre: "María López",
      email: "maria@ejemplo.com",
    },
    idEntidad: 9012,
  },
  {
    id: "traza-4",
    accion: "INICIAR_SESIÓN",
    modulo: "Autenticación",
    creadoEn: new Date("2024-01-15T07:15:00Z"),
    usuario: {
      id: "usuario-4",
      nombre: "David Martínez",
      email: "david@ejemplo.com",
    },
  },
  {
    id: "traza-5",
    accion: "EXPORTAR",
    modulo: "Reportes",
    creadoEn: new Date("2024-01-15T06:30:00Z"),
    usuario: {
      id: "usuario-5",
      nombre: "Elena Fernández",
      email: "elena@ejemplo.com",
    },
    idEntidad: 3456,
  },
  {
    id: "traza-6",
    accion: "VER",
    modulo: "Panel de Control",
    creadoEn: new Date("2024-01-15T05:45:00Z"),
    usuario: {
      id: "usuario-1",
      nombre: "Ana García",
      email: "ana@ejemplo.com",
    },
  },
])

const trazaSeleccionada = ref(null)
const modalAbierto = ref(false)

// Función para obtener las clases CSS de la acción
const obtenerClaseAccion = (accion) => {
  switch (accion) {
    case "CREAR":
      return "bg-blue-100 text-blue-800"
    case "ACTUALIZAR":
      return "bg-yellow-100 text-yellow-800"
    case "ELIMINAR":
      return "bg-red-100 text-red-800"
    case "INICIAR_SESIÓN":
    case "CERRAR_SESIÓN":
      return "bg-green-100 text-green-800"
    case "VER":
      return "bg-gray-100 text-gray-800"
    case "EXPORTAR":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Función para formatear fecha
const formatearFecha = (fecha) => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha)
}

// Función para formatear fecha completa
const formatearFechaCompleta = (fecha) => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(fecha)
}

// Función para obtener iniciales del usuario
const obtenerIniciales = (nombre) => {
  return nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Función para abrir el modal de detalles
const abrirDetalle = (traza) => {
  trazaSeleccionada.value = traza
  modalAbierto.value = true
}

// Función para cerrar el modal
const cerrarModal = () => {
  modalAbierto.value = false
  trazaSeleccionada.value = null
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Animaciones para el modal */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>