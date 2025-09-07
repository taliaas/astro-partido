<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { navigate } from "astro:transitions/client";
import {
  BellIcon,
  InfoIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronRight,
  ChevronLeft,
} from "lucide-vue-next";

const { notifications } = defineProps<{
  notifications: {
    data: any[];
    page: number;
    limit: number;
    total: number;
    all: number;
  };
}>();

const currentPage = Number(notifications.page);

function next() {
  if (notifications.total > currentPage)
    navigate(`/notification?page=${currentPage + 1}`);
}

function previous() {
  if (currentPage > 1) {
    navigate(`/notification?page=${currentPage - 1}`);
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-4 max-w-7xl">
      <div
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      >
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-lg">
                <BellIcon class="h-6 w-6" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  Notificaciones del Sistema
                </h1>
                <p class="text-sm text-gray-600 mt-1">
                  {{
                    notifications?.all === 1
                      ? "1 notificación"
                      : (notifications?.all || 0) + " notificaciones"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div
          v-if="notifications && notifications?.data.length > 0"
          class="divide-y divide-gray-100"
        >
          <div
            v-for="notification in notifications?.data"
            :key="notification.id"
            class="p-6 hover:bg-gray-50 transition-colors group"
          >
            <div class="flex items-start space-x-4">
              <!-- Notification Icon -->
              <div class="flex-shrink-0 mt-1">
                <div
                  :class="{
                    'bg-blue-100 text-blue-600':
                      notification.type === 2 || !notification.type,
                    'bg-yellow-100 text-yellow-600':
                      notification.type === 1 || notification.type === 3,
                    'bg-red-100 text-red-600': notification.type === 0,
                    'bg-green-100 text-green-600': notification.type === 4,
                  }"
                  class="p-2 rounded-full"
                >
                  <InfoIcon
                    v-if="notification.type === 2 || !notification.type"
                    class="h-4 w-4"
                  />
                  <AlertTriangleIcon
                    v-else-if="
                      notification.type === 1 || notification.type === 3
                    "
                    class="h-4 w-4"
                  />
                  <AlertCircleIcon
                    v-else-if="notification.type === 0"
                    class="h-4 w-4"
                  />
                  <CheckCircleIcon
                    v-else-if="notification.type === 4"
                    class="h-4 w-4"
                  />
                </div>
              </div>

              <!-- Notification Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <!-- Title -->
                    <h3 class="text-xl font-semibold text-gray-900 mb-1">
                      {{ notification.title || "Notificación del Sistema" }}
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
                        {{
                          notification.createdAt
                            ? notification.createdAt.slice(0, 10)
                            : "Hace unos momentos"
                        }}
                      </div>

                      <div
                        v-if="notification.tipo_alerta"
                        class="flex items-center"
                      >
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {{ notification.tipo_alerta }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <div
            class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"
          >
            <BellIcon class="h-12 w-12 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            No hay notificaciones
          </h3>
          <p class="text-gray-500 max-w-sm mx-auto">
            Todas las notificaciones importantes del sistema aparecerán aquí. Te
            mantendremos informado sobre actualizaciones y eventos relevantes.
          </p>
        </div>

        <!-- Footer -->
        <div
          v-if="notifications && notifications.data.length > 0"
          class="p-4 bg-gray-50 border-t border-gray-200"
        >
          <div class="flex items-center justify-between text-sm text-gray-600">
            <p>Página{{ notifications.page }} de {{ notifications.total }}</p>

            <div class="flex gap-3">
              <Button
                :disabled="currentPage === 1"
                variant="secondary"
                @click="previous"
              >
                <ChevronLeft />
              </Button>
              <Button
                :disabled="currentPage >= notifications.total"
                @click="next"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
