<template>
  <div class="rounded-lg border bg-card shadow-sm">
    <div class="p-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4"
      >
        <div>
          <h4 class="text-lg font-semibold">Matriz de Permisos</h4>
        </div>
        <div class="flex items-center gap-2">
          <select
            class="rounded-md border px-3 py-2 bg-background"
            v-model="selectRole"
          >
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
          <button
            @click="saveClaims"
            class="rounded-md bg-button px-3 py-2 text-sm font-medium text-primary-foreground flex items-center gap-1"
          >
            Guardar
          </button>
        </div>
      </div>

      <div class="rounded-md border overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="h-10 w-[200px] px-4 py-4 text-left font-medium">
                Recurso
              </th>
              <th
                v-for="action in permissionActions"
                :key="action.id"
                class="h-10 px-2 text-center font-medium"
              >
                {{ action.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="resource in permissionResources"
              :key="resource"
              class="border-b transition-colors hover:bg-muted/50"
            >
              <td class="px-4">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ resource }}</span>
                </div>
              </td>
              <td
                v-for="action in permissionActions"
                :key="action.id"
                class="p-4 text-center"
              >
                <input
                  type="checkbox"
                  :id="`${resource}-${action.id}`"
                  class="rounded border-gray-300"
                  :checked="isPermissionChecked(resource, action.id)"
                  @change="togglePermission(resource, action.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle class="w-4 h-4 bg-secondary" />
          Editando permisos para:
          <span class="font-medium">{{ roles.find(r => r.id === selectRole).name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import type { Claims } from "@/interface/Claims.ts";
import type { Role } from "@/interface/Roles.ts";
import { actions } from "astro:actions";

const { claims, roles } = defineProps<{ claims: Claims[]; roles: Role[] }>();
const selectRole = ref(claims[0]?.role?.id ?? null);

// Definir las acciones posibles
const permissionActions = [
  { id: "create", name: "Crear" },
  { id: "update", name: "Editar" },
  { id: "delete", name: "Eliminar" },
  { id: "read", name: "Ver" },
  { id: "export", name: "Exportar" },
];

// Obtener los módulos únicos de los claims
const permissionResources = ["Documentos", "Análisis", "Reportes", "Usuarios"];

// Claims filtrados por rol seleccionado
const filteredClaims = computed(() => {
  return claims.filter((c) => c.role?.name === selectRole.value);
});

// Estado local editable de los permisos por rol
const editableClaims = ref<Claims[]>([...claims]);

// Actualizar el estado de un permiso (check/uncheck)
function togglePermission(resource: string, actionId: string) {
  const idx = editableClaims.value.findIndex(
    (c) =>
      c.role?.id === selectRole.value &&
      c.module === resource &&
      c.action === actionId
  );
  if (idx !== -1) {
    // Si existe, quitar el permiso (uncheck)
    editableClaims.value.splice(idx, 1);
  } else {
    // Si no existe, agregar el permiso (check)
    const roleObj = roles.find((r) => r.id === selectRole.value);
    if (roleObj) {
      editableClaims.value.push({
        id: Date.now(), // id temporal, el backend debe asignar el real
        action: actionId as Claims["action"],
        module: resource,
        role: roleObj,
      });
    }
  }
}

// Saber si el permiso está activo para el recurso y acción (usando editableClaims)
function isPermissionChecked(resource: string, actionId: string) {
  return editableClaims.value.some(
    (perm) =>
      perm.role?.id === selectRole.value &&
      perm.module === resource &&
      perm.action === actionId
  );
}

// Guardar cambios (ejemplo: emitir evento o llamar API)
function saveClaims() {
  try {
    // Filtrar los claims editables solo para el rol seleccionado
    const claimsToSave = editableClaims.value.filter(
      (c) => c.role?.id === selectRole.value
    );
    actions.role.updateRole({ id: selectRole.value, data: claimsToSave });
  } catch (e) {
    console.log(e);
    throw new Error(e as any);
  }
}

// Al cambiar de rol, filtrar los claims editables para ese rol
watch(selectRole, (newRole) => {
  // Opcional: podrías recargar editableClaims desde claims si quieres descartar cambios no guardados
});
</script>
