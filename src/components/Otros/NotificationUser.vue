<template>
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto p-4">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <!-- Header -->
          <div class="p-4 border-b border-gray-200">
            <h1 class="text-xl font-semibold text-gray-900">Notificaciones del Sistema</h1>
          </div>
  
          <!-- Notifications List -->
          <div class="divide-y divide-gray-200">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              class="p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-md my-2 font-semibold text-gray-900">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-gray-700">
                    {{ notification.message }}
                  </p>
                  <div class="mt-2 flex items-center space-x-4">
                    <span class="text-xs text-gray-500">{{ formatDate(notification.date) }}</span>
                    <button 
                      v-if="notification.action"
                      class="text-xs font-medium text-blue-700 hover:text-gray-700 transition-colors duration-200"
                      @click="handleAction(notification.action)"
                    >
                      {{ notification.action }}
                    </button>
                  </div>
                </div>
                <div class="flex-shrink-0">
                  <button 
                    @click="dismissNotification(notification.id)"
                    class="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  >
                    <XIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <BellIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay notificaciones</h3>
            <p class="mt-1 text-sm text-gray-500">Todas las notificaciones importantes aparecerán aquí.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { BellIcon, CheckCircle, XIcon } from 'lucide-vue-next';
import { ref } from 'vue';
  
  const notifications = ref([
    {
      id: 1,
      type: 'success',
      title: 'Documento aprobado',
      message: 'El acta de la última sesión ha sido aprobada por todos los miembros.',
      date: new Date(2023, 11, 15, 10, 30),
      action: 'Ver documento'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Recordatorio de reunión',
      message: 'La próxima reunión del comité ejecutivo está programada para mañana a las 15:00.',
      date: new Date(2023, 11, 14, 9, 0),
      action: 'Confirmar asistencia'
    },
    {
      id: 3,
      type: 'info',
      title: 'Actualización de normativa',
      message: 'Se ha publicado una actualización de la normativa interna. Por favor, revise los cambios.',
      date: new Date(2023, 11, 13, 14, 45),
      action: 'Leer más'
    }
  ])
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const handleAction = (action) => {
    console.log(`Action triggered: ${action}`)
    // Implement action handling logic here
  }
  
  const dismissNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }
  </script>