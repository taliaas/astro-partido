<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Severity } from "@/enum/Estado";
import type { User } from "@/interface/Militante";
import { useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowLeft,
  ArrowRight,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  InfoIcon,
} from "lucide-vue-next";
import { ref } from "vue";

interface NotificationData {
  id: string;
  title: string;
  message: string;
  read: boolean;
  subject: string;
  kpiId: string;
  channel: "email" | "app";
  severity: Severity;
  user: User;
  createdAt: Date;
  expiresAt: Date | null;
}

const { notifications, page, limit } = defineProps<{
  notifications: {
    data: NotificationData[];
    page: number;
    limit: number;
    total: number;
    all: number;
  };
  page: number;
  limit: number;
}>();

const currentPage = ref(page);
const hasNextPage = ref(notifications?.total);
const searchParams = useUrlSearchParams();

function goToNextPage() {
  const query = new URLSearchParams(searchParams as any);
  if (notifications.total > currentPage.value) {
    currentPage.value++;
    query.set("page", currentPage.value + "");
    navigate(`?` + query.toString());
  }
}

function goToPreviousPage() {
  const query = new URLSearchParams(searchParams as any);
  if (currentPage.value > 1) {
    currentPage.value--;
    query.set("page", currentPage.value + "");
    navigate(`?` + query.toString());
  }
}

const handleFilterByValue = (filter: string, value: any) => {
  const query = new URLSearchParams(searchParams as any);
  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }
  navigate("?" + query.toString());
};
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
                <BellIcon class="h-6 w-6 text-blue-600" />
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
                      notification.severity === Severity.LOW ||
                      !notification.severity,
                    'bg-yellow-100 text-yellow-600':
                      notification.severity === Severity.WARNING ||
                      notification.severity === Severity.MEDIUM,
                    'bg-red-100 text-red-600':
                      notification.severity === Severity.CRITICAL,
                    'bg-green-100 text-green-600':
                      notification.severity === Severity.SUCCESS,
                  }"
                  class="p-2 rounded-full"
                >
                  <InfoIcon
                    v-if="
                      notification.severity === Severity.INFO ||
                      !notification.severity
                    "
                    class="h-4 w-4"
                  />
                  <AlertTriangleIcon
                    v-else-if="
                      notification.severity === Severity.WARNING ||
                      notification.severity === Severity.MEDIUM
                    "
                    class="h-4 w-4"
                  />
                  <AlertCircleIcon
                    v-else-if="notification.severity === Severity.LOW"
                    class="h-4 w-4"
                  />
                  <CheckCircleIcon
                    v-else-if="notification.severity === Severity.SUCCESS"
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
                      Mensaje: {{ notification.message }}
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
                            ? new Date(
                                notification.createdAt,
                              ).toLocaleDateString("es", { dateStyle: "long" })
                            : "Hace unos momentos"
                        }}
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
          v-if="notifications?.total !== 0"
          class="flex justify-between border-t"
        >
          <div
            class="text-md text-muted-foreground flex items-center gap-1 p-4"
          >
            Mostrando
            <span class="font-medium">{{ notifications.page || 0 }}</span> de
            <span class="font-medium">{{ notifications?.total || 1 }}</span>
            páginas
          </div>

          <div class="flex gap-2 p-4">
            <Button
              size="icon"
              :disabled="currentPage === 1"
              variant="outline"
              @click="goToPreviousPage"
            >
              <ArrowLeft />
            </Button>
            <Button
              size="icon"
              :disabled="currentPage >= hasNextPage"
              variant="outline"
              @click="goToNextPage"
            >
              <ArrowRight
            /></Button>

            <Select
              :default-value="searchParams.limit ?? '10'"
              @update:model-value="handleFilterByValue('limit', $event)"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent class="font-normal">
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- <div
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
                <ArrowLeft />
              </Button>
              <Button
                :disabled="currentPage >= notifications.total"
                @click="next"
              >
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
