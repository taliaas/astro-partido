<script setup lang="ts">
import Badge from "@/components/ui/badge/Badge.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Comite } from "@/interface/Militante";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { MoreVerticalIcon, Pencil, Trash2Icon } from "lucide-vue-next";
import { reactive, ref, watch } from "vue";
import { toast } from "vue-sonner";

const { comites } = defineProps<{
  comites: {
    data: Comite[];
  };
}>();

const openModal = defineModel<boolean>("open", { required: true });

const isEditing = ref(false);
const isLoading = ref(false);
const currentComite = ref<Comite>();
const comiteForm = reactive<Comite>({
  id: "",
  name: "",
  disabled: false,
  cores: [],
});

const open = ref(false);

const handleEditComite = (comite: Comite) => {
  currentComite.value = comite;
  isEditing.value = true;
  openModal.value = true;
};

const handleDeleteComite = async (comiteId: string) => {
  const { error } = await actions.comite.deleteComite(comiteId);
  if (error instanceof ActionError) {
    console.error(error);
    toast.error("Error al eliminar el comité");
  } else {
    toast.success("El Comité se eliminó con éxito");
    navigate("");
  }
};

const saveComite = async () => {
  isLoading.value = true;
  if (isEditing.value && comiteForm.id) {
    const { error } = await actions.comite.updateComite(comiteForm);
    if (error instanceof ActionError) {
      console.error(error);
      return toast.error("Error al editar el comité");
    } else {
      toast.success("El Comité se editó con éxito");
      openModal.value = false;

      navigate("");
    }
  } else {
    const { error } = await actions.comite.createComite(comiteForm);
    if (error instanceof ActionError) {
      console.error(error);
      return toast.error("Error al crear el comité");
    } else {
      toast.success("El Comité se creó con éxito");
      openModal.value = false;

      navigate("");
    }
  }
  isLoading.value = false;
};

watch(
  currentComite,
  (newComite) => {
    if (newComite) {
      comiteForm.id = newComite.id;
      comiteForm.name = newComite.name;
      comiteForm.disabled = newComite.disabled;
      comiteForm.cores = newComite.cores;
    } else {
      // Resetear el formulario si no hay currentCore
      comiteForm.id = "";
      comiteForm.name = "";
      comiteForm.disabled = false;
      comiteForm.cores = [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="p-4">
    <div class="rounded-md border">
      <table class="w-full text-md">
        <thead>
          <tr class="border-b font-semibold">
            <th class="h-10 px-4 text-left text-muted-foreground">Nombre</th>
            <th class="h-10 px-4 text-center text-muted-foreground">Núcleos</th>
            <th class="h-10 px-4 text-center text-muted-foreground">Estado</th>
            <th class="h-10 px-4 text-left w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="comites.data?.length === 0">
            <td colspan="3" class="p-4 text-center text-muted-foreground">
              No hay comités registrados.
            </td>
          </tr>
          <tr v-for="comite in comites.data" :key="comite.id" class="p-2">
            <td class="h-10 px-4 py-4 text-left">{{ comite.name }}</td>
            <td class="h-10 px-4 text-center">
              <TooltipProvider>
                <Tooltip
                  class="hover:bg-muted dark:hover:bg-gray-700 rounded-full"
                >
                  <TooltipTrigger as-child>
                    <Badge variant="outline">{{ comite.cores?.length }}</Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    side="top"
                    :align-offset="0"
                    :collision-padding="0"
                    :arrow-padding="0"
                    sticky="always"
                  >
                    <div v-for="item in comite.cores">
                      <p>{{ item.name }}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </td>
            <td class="h-10 px-4 text-center">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  comite.disabled
                    ? 'bg-red-50 text-red-700 border border-red-300'
                    : 'bg-green-50 text-green-700 border border-green-300',
                ]"
              >
                {{ comite.disabled ? "Inactivo" : "Activo" }}
              </span>
            </td>
            <td class="h-10 px-4 text-left w-[50px]">
              <DropdownMenu>
                <DropdownMenuTrigger class="focus:outline-none">
                  <Button variant="ghost" size="icon" class="rounded-full">
                    <MoreVerticalIcon class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleEditComite(comite)">
                    <Pencil class="h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="handleDeleteComite(comite.id)"
                    variant="destructive"
                  >
                    <Trash2Icon class="h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Diálogo para añadir/editar comité -->
  <Dialog v-model:open="openModal">
    <DialogContent>
      <DialogHeader>
        <DialogTitle
          >{{ isEditing ? "Editar Comité" : "Añadir Comité" }}
        </DialogTitle>
        <DialogDescription>
          {{
            isEditing
              ? "Modifica los datos del comité seleccionado."
              : "Completa los datos para crear un nuevo comité."
          }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="nombre" class="text-right">Nombre</Label>
          <Input
            id="nombre"
            v-model="comiteForm.name"
            class="col-span-3"
            placeholder="Nombre del comité"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline"> Cancelar </Button>
        </DialogClose>

        <Button
          @click="saveComite"
          :disabled="!comiteForm.name"
          :loading="isLoading"
        >
          {{ isEditing ? "Guardar cambios" : "Crear comité" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
