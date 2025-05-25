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
          <Select v-model="selectRole">
            <SelectTrigger>
              <SelectValue class="min-w-48" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="role in roles"
                  :key="role.id"
                  :value="role.id"
                  >{{ role.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            @click="saveClaims"
            :disabled="!hasChanges || saving"
            :loading="saving"
            class="min-w-30"
          >
            Guardar
          </Button>
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
          <span class="font-medium">{{
            roles.find((r) => r.id === selectRole)?.name
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

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
import type { Claims } from "@/interface/Claims.ts";
import type { Role } from "@/interface/Roles.ts";
import { actions } from "astro:actions";
import { AlertCircle } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

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

const saving = ref(false);

// Estado local editable de los permisos por rol
const editableClaims = ref<Claims[]>([...claims]);
const originalClaims = ref(JSON.stringify(claims));

const hasChanges = computed(() => {
  // Compara el estado actual editable con el original
  return JSON.stringify(editableClaims.value) !== originalClaims.value;
});

// Actualizar el estado de un permiso (check/uncheck)
function togglePermission(resource: string, actionId: string) {
  const claimIdx = editableClaims.value.findIndex(
    (c) => c.role?.id === selectRole.value && c.module === resource
  );
  if (claimIdx !== -1) {
    // Si existe el claim para ese módulo y rol
    const claim = editableClaims.value[claimIdx];
    const actionIdx = claim.actions.indexOf(actionId);
    if (actionIdx !== -1) {
      // Si la acción ya está, quitarla
      claim.actions.splice(actionIdx, 1);
      // Si no quedan acciones, eliminar el claim completo
      if (claim.actions.length === 0) {
        editableClaims.value.splice(claimIdx, 1);
      }
    } else {
      // Si no está la acción, agregarla
      claim.actions.push(actionId);
    }
  } else {
    // Si no existe el claim, crearlo con la acción
    const roleObj = roles.find((r) => r.id === selectRole.value);
    if (roleObj) {
      editableClaims.value.push({
        id: Date.now(), // id temporal, el backend debe asignar el real
        actions: [actionId],
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
      perm.actions.includes(actionId)
  );
}

// Guardar cambios (ejemplo: emitir evento o llamar API)
async function saveClaims() {
  saving.value = true;
  try {
    // Para cada rol, agrupar sus claims y preparar el objeto para guardar
    const rolesToSave = roles.map((role) => {
      const claimsToSave = editableClaims.value.filter(
        (c) => c.role?.id === role.id
      );
      const grouped = permissionResources.map((resource) => {
        const claim = claimsToSave.find((c) => c.module === resource);
        return {
          module: resource,
          actions: claim ? claim.actions : [],
        };
      });
      return {
        id: role.id,
        data: { claims: grouped },
      };
    });

    // Llamar a la acción para cada rol
    await Promise.all(
      rolesToSave.map((roleData) => actions.role.updateRole(roleData))
    );
    toast.success("Permisos actualizados con éxito");
    originalClaims.value = JSON.stringify(editableClaims.value);
  } catch (e) {
    console.log(e);
    toast.success("Ha ocurrido un error al tratar de actualizar los permisos");
  } finally {
    saving.value = false;
  }
}

// Al cambiar de rol, filtrar los claims editables para ese rol
watch(selectRole, (newRole) => {
  // Opcional: podrías recargar editableClaims desde claims si quieres descartar cambios no guardados
});
</script>
