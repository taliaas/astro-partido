<script setup lang="ts">
import { BellIcon, CheckIcon, XIcon, InfoIcon, AlertTriangleIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon } from 'lucide-vue-next';

const { notifications } = defineProps<{
  notifications: any[];
}>();

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-4 max-w-7xl">
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-lg">
                <BellIcon class="h-6 w-6" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Notificaciones del Sistema</h1>
                <p class="text-sm text-gray-600 mt-1">
                    {{ notifications?.length === 1 ? '1 notificación' : (notifications?.length || 0) + ' notificaciones' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div v-if="notifications && notifications.length > 0" class="divide-y divide-gray-100">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="p-6 hover:bg-gray-50 transition-colors group"
          >
            <div class="flex items-start space-x-4">
              <!-- Notification Icon -->
              <div class="flex-shrink-0 mt-1">
                <div 
                  :class="{
                    'bg-blue-100 text-blue-600': notification.type === 2 || !notification.type,
                    'bg-yellow-100 text-yellow-600': notification.type === 1 || notification.type === 3,
                    'bg-red-100 text-red-600': notification.type === 0,
                    'bg-green-100 text-green-600': notification.type === 4
                  }"
                  class="p-2 rounded-full"
                >
                  <InfoIcon v-if="notification.type === 2 || !notification.type" class="h-4 w-4" />
                  <AlertTriangleIcon v-else-if="notification.type === 1 || notification.type === 3" class="h-4 w-4" />
                  <AlertCircleIcon v-else-if="notification.type === 0" class="h-4 w-4" />
                  <CheckCircleIcon v-else-if="notification.type === 4" class="h-4 w-4" />
                </div>
              </div>

              <!-- Notification Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <!-- Title -->
                    <h3 class="text-xl font-semibold text-gray-900 mb-1">
                      {{ notification.title || 'Notificación del Sistema' }}
                    </h3>
                    
                    <!-- Message -->
                    <p class="text-lg text-gray-700 leading-relaxed">
                      Mensaje: {{ notification.menssage }}
                    </p>
                    <p class="text-lg text-gray-500 leading-relaxed">
                      {{ notification.subject }}
                    </p>
                    
                    <!-- Metadata -->
                    <div class="flex items-center space-x-4 mt-3">
                      <div class="flex items-center text-md text-gray-500">
                        <ClockIcon class="h-3 w-3 mr-1" />
                        {{ notification.createdAt ? notification.createdAt.slice(0, 10) : 'Hace unos momentos' }}
                      </div>
                      
                      <div v-if="notification.tipo_alerta" class="flex items-center">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {{ notification.tipo_alerta }}
                        </span>
                      </div>
                      
                      <div v-if="!notification.read" class="flex items-center">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          No leída
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      v-if="!notification.read"
                      class="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      title="Marcar como leída"
                    >
                      <CheckIcon class="h-4 w-4" />
                    </button>
                    <button 
                      class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar notificación"
                    >
                      <XIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>

             

                <!-- Action Buttons -->
                <div v-if="notification.actions" class="mt-4 flex space-x-2">
                  <button 
                    v-for="action in notification.actions" 
                    :key="action.label"
                    :class="{
                      'bg-blue-600 text-white hover:bg-blue-700': action.primary,
                      'bg-gray-100 text-gray-700 hover:bg-gray-200': !action.primary
                    }"
                    class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                  >
                    {{ action.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BellIcon class="h-12 w-12 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay notificaciones</h3>
          <p class="text-gray-500 max-w-sm mx-auto">
            Todas las notificaciones importantes del sistema aparecerán aquí. 
            Te mantendremos informado sobre actualizaciones y eventos relevantes.
          </p>
        </div>

        <!-- Footer -->
        <div v-if="notifications && notifications.length > 0" class="p-4 bg-gray-50 border-t border-gray-200">
          <div class="flex items-center justify-between text-sm text-gray-600">
            <span>{{ notifications.length }} notificación{{ notifications.length !== 1 ? 'es' : '' }} en total</span>
            <button class="text-blue-600 hover:text-blue-700 font-medium">
              Ver historial completo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>