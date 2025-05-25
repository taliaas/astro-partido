<template>
  <div class="rounded-lg border bg-card shadow-sm">
    <div class="p-6">
      <div class="flex flex-row items-center justify-end mb-4">
        <CreateRoleButton />
      </div>

      <div class="rounded-md border">
        <table class="w-full">
          <thead>
            <tr class="border-b bg-muted/50 text-foreground">
              <th class="h-10 px-4 text-left">Nombre del Rol</th>
              <th class="h-10 px-4 text-left">Descripción</th>
              <th class="h-10 px-4 text-center">Usuarios</th>
              <th class="h-10 px-4 text-center">Permisos</th>
              <th class="h-10 px-4 text-left w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id" class="border-b transition-colors hover:bg-muted/50">
              <td class="p-4 font-medium">{{ role.name }}</td>
              <td class="p-4 text-muted-foreground">{{ role.description }}</td>
              <td class="p-4 text-center">{{ role.users?.length }}</td>
              <td class="p-4 text-center">{{ role.claims?.length }}</td>
              <td class="p-4">
                <div class="relative">
                  <button @click="toggleRoleDropdown(role.id)" class="rounded-md p-1 hover:bg-muted">
                    <MoreVerticalIcon class="h-4 w-4" />
                  </button>
                  <div v-if="activeRoleDropdown === role.id"
                    class="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-background shadow-lg">
                    <div class="py-2 px-3 text-sm font-medium text-muted-foreground border-b bg-muted">
                      Acciones
                    </div>
                    <div class="py-1">
                      <a href="#edit" class="block px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
                        Editar
                      </a>
                      <div class="border-t my-1"></div>
                      <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-muted flex items-center gap-2">
                        Eliminar
                      </a>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 text-xs text-muted-foreground">
        Total de roles: {{ roles.length }}
      </div>
    </div>
    <div id="edit"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MoreVerticalIcon } from "lucide-vue-next";
import type { Role } from "@/interface/Roles.ts";
import CreateRoleButton from "@/components/settings/role/CreateRoleButton.vue"

const { roles } = defineProps<{ roles: Role[] }>();
const activeRoleDropdown = ref(null);
const toggleRoleDropdown = (id) => {
  activeRoleDropdown.value = activeRoleDropdown.value === id ? null : id;
};
</script>
