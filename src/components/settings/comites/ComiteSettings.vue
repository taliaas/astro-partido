<script setup lang="ts">
import CoreManage from "@/components/settings/comites/Core/Core.vue";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import type { Comite, Core, Militant } from "@/interface/Militante";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  Building2,
  MoreVerticalIcon,
  Pencil,
  PlusIcon,
  Trash2,
} from "lucide-vue-next";
import { reactive, ref, watch } from "vue";
import { toast } from "vue-sonner";

const { comites, cores, militants } = defineProps<{
  comites: {
    data: Comite[];
  };
  cores: { data: Core[] };
  militants: Militant[];
}>();

const isEditing = ref(false);
const openModal = defineModel<boolean>("open", { required: true });
const isLoading = ref(false);
const currentComite = ref<Comite>();
const comiteForm = reactive<Comite>({
  id: "",
  name: "",
  disabled: false,
  cores: [],
});

const militantByComite = (comiteId: string) => {
  const cores = comites.data.find((item) => item.id === comiteId)?.cores;
  return cores?.reduce((sum, item) => sum + item.militants.length, 0) || 0;
};

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
  <div class="pb-4 flex justify-between">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">
        Gestión de Comités y Núcleos
      </h2>
      <p class="text-gray-600">
        Administra comités, núcleos y sus militantes asociados
      </p>
    </div>
    <Button @click="openModal = true" class="flex items-center gap-1">
      <PlusIcon class="h-4 w-4 mr-1" />
      Nuevo Comité
    </Button>
  </div>

  <div class="space-y-2">
    <Collapsible v-for="comite of comites?.data" :key="comite.id">
      <Card>
        <CardContent class="w-full">
          <div class="flex justify-between pb-4 items-center">
            <CollapsibleTrigger class="flex items-center gap-4 flex-1">
              <Building2 class="h-5 w-5 text-primary" />
              <div class="">
                <div class="flex gap-3">
                  <h3 class="text-lg text-start font-semibold">
                    {{ comite?.name || "No hay comités registrados." }}
                  </h3>
                  <Badge
                    v-if="comite.disabled"
                    variant="destructive"
                    class="text-xs"
                  >
                    Deshabilitado</Badge
                  >
                </div>
                <p class="text-muted-foreground">
                  {{ comite.cores.length }} núcleo(s) •
                  {{ militantByComite(comite.id) }} militante(s)
                </p>
              </div>
            </CollapsibleTrigger>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="rounded-full">
                    <MoreVerticalIcon class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleEditComite(comite)">
                    <Pencil class="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger as-child>
                    <DropdownMenuItem class="text-destructive">
                      <Trash2 class="mr-2 h-4 w-4 text-destructive" />
                      Eliminar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar comité</AlertDialogTitle>
                  <AlertDialogDescription
                    >Esta acción eliminará el comité de forma permanente. ¿Desea
                    continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel> Cancelar </AlertDialogCancel>

                  <Button
                    @click="handleDeleteComite(comite.id)"
                    variant="destructive"
                  >
                    Eliminar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <CollapsibleContent class="pt-4 border-t">
            <CoreManage :comite="comite" :comites="comites.data" :cores
          /></CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
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
