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
            <tr
              v-for="role in roles"
              :key="role.id"
              class="border-b transition-colors hover:bg-muted/50"
            >
              <td class="p-4 font-medium">{{ role.name }}</td>
              <td class="p-4 text-muted-foreground">{{ role.description }}</td>
              <td class="p-4 text-center">{{ role.users?.length }}</td>
              <td class="p-4 text-center">{{ role.claims?.length }}</td>
              <td class="p-4">
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <button class="rounded-md p-1 hover:bg-muted">
                        <MoreVerticalIcon class="size-4" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem> Editar </DropdownMenuItem>

                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem variant="destructive">
                            Eliminar
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar rol</AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Está seguro que desea eliminar el rol
                          {{ role.name }}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel> Cancelar </AlertDialogCancel>
                        <Button
                          :disabled="deleting"
                          :loading="deleting"
                          @click="handleDelete(role.id)"
                          variant="destructive"
                          >Eliminar</Button
                        >
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </DropdownMenu>
                </AlertDialog>
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
import CreateRoleButton from "@/components/settings/role/CreateRoleButton.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { actions } from "astro:actions";
import { toast } from "vue-sonner";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const { roles } = defineProps<{ roles: Role[] }>();
const activeRoleDropdown = ref(null);
const toggleRoleDropdown = (id) => {
  activeRoleDropdown.value = activeRoleDropdown.value === id ? null : id;
};

const deleting = ref(false);

async function handleDelete(id: number) {
  deleting.value = true;
  const { error, data } = await actions.role.deleteRole(id);
  if (error) {
    console.error(data);
    toast.error("Ha ocurrido un error al tratar de eliminar el role");
  }
  await navigate("");
  setTimeout(() => toast.success("Rol eliminado de forma exitosa"), 1000);
}
</script>
