<template>
  <div class="rounded-lg border bg-card shadow-sm">
    <div class="p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h4 class="text-lg font-semibold">Matriz de Permisos</h4>
        </div>
        <div class="flex items-center gap-2">
          <select class="rounded-md border px-3 py-2 bg-background" v-model="selectRole">
            <option v-for="role in roles" :key="role.id" :value="role.name">{{ role.name }}</option>
          </select>
          <button class="rounded-md bg-button px-3 py-2 text-sm font-medium text-primary-foreground flex items-center gap-1">
            Guardar Cambios
          </button>
        </div>
      </div>

      <div class="rounded-md border overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
          <tr class="border-b bg-muted/50">
            <th class="h-10 w-[200px] px-4 text-left font-medium">Recurso</th>
            <th v-for="action in permissionActions" :key="action.id" class="h-10 px-4 text-center font-medium">
              {{ action.name }}
            </th>
            <th class="h-10 w-[50px]"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="resource in permissionResources" :key="resource.id" class="border-b transition-colors hover:bg-muted/50">
            <td class="p-4">
              <div class="flex items-center gap-2">
                <component :is="resource.icon" class="h-4 w-4 text-muted-foreground" />
                <span class="font-medium">{{ resource.name }}</span>
              </div>
            </td>
            <td v-for="action in permissionActions" :key="action.id" class="p-4 text-center">
              <input
                  type="checkbox"
                  :id="`${resource.id}-${action.id}`"
                  class="rounded border-gray-300"
                  :checked="isPermissionChecked(resource.id, action.id)"
              />
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle class="w-4 h-4 bg-secondary"/>
            Editando permisos para: <span class="font-medium">{{selectRole}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import {ref} from "vue";

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  claims: any;
}
const { roles } = defineProps<{ roles: Role[] }>();
const selectRole = ref(roles.length > 0 ? roles[0].name : undefined)

// Recursos de permisos
const permissionResources = [
  { id: 'documents', name: 'Documentos' },
  { id: 'folders', name: 'Carpetas' },
  { id: 'templates', name: 'Plantillas' },
  { id: 'sharing', name: 'Compartir' },
]

// Verificar si un permiso está marcado
const isPermissionChecked = (resourceId, actionId) => {
  // Simulación - en una aplicación real, esto vendría de los datos del backend
  const adminPermissions = {
    documents: ['view', 'create', 'edit', 'delete', 'share', 'export'],
    folders: ['view', 'create', 'edit', 'delete', 'share'],
    templates: ['view', 'create', 'edit', 'delete', 'share', 'export'],
    sharing: ['view', 'create', 'edit', 'delete'],
  }

  return adminPermissions[resourceId]?.includes(actionId) || false
}

// Acciones de permisos
const permissionActions = [
  { id: 'view', name: 'Ver' },
  { id: 'create', name: 'Crear' },
  { id: 'edit', name: 'Editar' },
  { id: 'delete', name: 'Eliminar' },
  { id: 'share', name: 'Compartir' },
  { id: 'export', name: 'Exportar' },
]

</script>