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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Comite } from "@/interface/Militante";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { EditIcon, MoreVerticalIcon, Trash2Icon } from "lucide-vue-next";
import { reactive, ref } from "vue";
import { toast } from "vue-sonner";

const { comites } = defineProps<{
  comites: {
    data: Comite[];
  };
}>();

const openModal = defineModel<boolean>("open", { required: true });

const isEditing = ref(false);
const isLoading = ref(false);
const comiteForm = reactive({
  id: "",
  name: "",
});

const open = ref(false);

const handleEditComite = () => {
  isEditing.value = true;
  openModal.value = true;
};

function openDetails() {
  open.value = !open.value;
}

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
</script>

<template>
  <div class="p-4">
    <div class="rounded-md border">
      <table class="w-full text-lg">
        <thead>
          <tr class="border-b bg-muted/50 font-medium">
            <th class="h-10 px-4 text-left">Nombre</th>
            <th class="h-10 px-4 text-center">Núcleos</th>
            <th class="h-10 px-4 text-center">Estado</th>
            <th class="h-10 px-4 text-left w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="comites.data.length === 0">
            <td colspan="3" class="p-4 text-center text-muted-foreground">
              No hay comités registrados.
            </td>
          </tr>
          <tr v-for="comite in comites.data" :key="comite.id" class="p-2">
            <td class="h-10 px-4 text-left">{{ comite.name }}</td>
            <td class="h-10 px-4 text-center">
              <Badge variant="outline">{{ comite.cores?.length }}</Badge>
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
              <div class="relative">
                <Button
                  variant="ghost"
                  class="rounded-full"
                  size="icon"
                  @click="openDetails"
                >
                  <MoreVerticalIcon class="h-4 w-4" />
                </Button>
                <div
                  v-if="open"
                  class="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-background shadow-lg"
                >
                  <div
                    class="py-2 px-3 text-sm font-medium text-muted-foreground border-b bg-muted"
                  >
                    Acciones
                  </div>
                  <div class="py-1" @click="open = false">
                    <a
                      href="#"
                      class="px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                      @click.prevent="handleEditComite()"
                    >
                      <EditIcon class="h-4 w-4" />
                      Editar
                    </a>

                    <div class="border-t my-1"></div>
                    <a
                      href="#"
                      class="px-4 py-2 text-sm text-red-600 hover:bg-muted flex items-center gap-2"
                      @click.prevent="handleDeleteComite(comite.id)"
                    >
                      <Trash2Icon class="h-4 w-4" />
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
