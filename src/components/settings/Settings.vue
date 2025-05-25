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
      <div class="flex-1 max-w-7xl">
        <!-- Gestión de Usuarios -->
        <div v-if="activeSection === 'users'" class="space-y-6">
          <UserManage :users :roles />
        </div>

        <!-- Gestión de Roles -->
        <div v-if="activeSection === 'roles'" class="space-y-6">
          <RolesManage :roles />
        </div>

        <!-- Gestión de Permisos -->
        <div v-if="activeSection === 'permissions'" class="space-y-6">
          <ClaimsManage :claims :roles />
        </div>

        <!-- Gestión de Notificaciones -->
        <div v-if="activeSection === 'notifications'" class="space-y-6">
          <Notification />
        </div>

        <!-- Gestión de Comites y Nucleos -->
        <div v-if="activeSection === 'comites'" class="space-y-6">
          <CoreManage :comites :cores />
        </div>

        <div v-if="activeSection === 'militantes'" class="space-y-6">
          <Militantes :militantes />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserManage from "@/components/settings/user/UserManage.vue";
import RolesManage from "@/components/settings/role/RolesManage.vue";
import ClaimsManage from "@/components/settings/ClaimsManage.vue";
import CoreManage from "@/components/settings/CoreManage.vue";
import Notification from "@/components/settings/Notification.vue";
import Militantes from "@/components/settings/Militantes.vue";

const { users, roles, claims, comites, cores, militantes } = defineProps<{
  users: any;
  roles: any;
  claims: any;
  comites: any;
  cores: any;
  militantes: any;
}>();

// Estado de la aplicación
const activeSection = ref("users");

// Elementos de navegación
const navigationItems = [
  { id: "users", title: "Gestión de Usuarios" },
  { id: "roles", title: "Roles" },
  { id: "permissions", title: "Permisos" },
  { id: "notifications", title: "Notificaciones" },
  { id: "comites", title: "Cómite CUJAE" },
  {id: "militantes", title: "Militantes"}
];

</script>
