<script setup lang="ts">
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
import Badge from "@/components/ui/badge/Badge.vue";
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent } from "@/components/ui/card";
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
import Input from "@/components/ui/input/Input.vue";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Comite, Core, Militant } from "@/interface/Militante";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  Eye,
  FileCheck,
  MoreHorizontal,
  Pencil,
  Plus,
  PlusIcon,
  Trash2,
  Users,
} from "lucide-vue-next";
import { reactive, ref, watch } from "vue";
import { toast } from "vue-sonner";

const { comite, comites, cores } = defineProps<{
  comite: Comite;
  comites: Comite[];
  cores: { data: Core[] };
}>();

const openModal = defineModel<boolean>("open");
const currentCore = ref({} as Core);
const openEnable = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const coreForm = reactive<Core>({
  id: "",
  name: "",
  disabled: false,
  generalSecretary: { id: "" } as Militant,
  operationSecretary: { id: "" } as Militant,
  comite: { id: comite.id ?? null } as Comite,
  militants: [],
  users: [],
});

const militantsByCore = (coreId: string) => {
  return cores.data.find((core) => core.id === coreId)?.militants;
};

// Watch para actualizar el formulario cuando currentCore cambie
watch(currentCore, (newCore) => {
  if (newCore) {
    coreForm.id = newCore.id;
    coreForm.name = newCore.name;
    coreForm.disabled = newCore.disabled;
    coreForm.generalSecretary = {
      id: newCore.generalSecretary?.id ?? "",
    } as Militant;
    coreForm.operationSecretary = {
      id: newCore.operationSecretary?.id ?? "",
    } as Militant;
    coreForm.comite = { id: newCore.comite?.id ?? "" } as Comite;
    coreForm.militants = newCore.militants || [];
    coreForm.users = newCore.users || [];
  } else {
    // Resetear el formulario si no hay currentCore
    coreForm.id = "";
    coreForm.name = "";
    coreForm.disabled = false;
    coreForm.generalSecretary = null as any;
    coreForm.operationSecretary = null as any;
    coreForm.comite = null as any;
    coreForm.militants = [];
    coreForm.users = [];
  }
});

const open = (comite: Comite) => {
  openModal.value = true;
  currentCore.value.comite = comite;
  console.log(currentCore.value);
};

const handleEditCore = (core: Core, comite: Comite) => {
  console.log(core);

  currentCore.value = { ...core, comite };
  isEditing.value = true;
  openModal.value = true;
};

const handleEnable = (core: Core) => {
  currentCore.value = core;
  openEnable.value = true;
};

const handleViewCore = (core: Core) => {
  navigate(`/settings/comites/core/${core.id}`);
};

const handleDeleteCore = async (coreId: string) => {
  const { error } = await actions.core.deleteCore(coreId);
  if (error instanceof ActionError) {
    console.error(error);
    toast.error("Error al eliminar el núcleo");
  } else {
    toast.success("El núcleo se eliminó con éxito");
    navigate("");
  }
};

const enable = async () => {
  const { error } = await actions.core.enableCore(currentCore.value!.id);
  if (error instanceof ActionError) {
    console.error(error);
    toast.error("Error al intentar habilitar el núcleo");
  } else {
    toast.success("El núcleo se habilitó con éxito");
    navigate("");
  }
};

const saveCore = async () => {
  isLoading.value = true;
  if (isEditing.value && coreForm.id) {
    const { error } = await actions.core.updateCore({
      id: coreForm.id,
      comite: { id: coreForm.comite.id },
      name: coreForm.name,
      generalSecretary: coreForm.generalSecretary.id,
      operationSecretary: coreForm.operationSecretary.id,
    });
    if (error instanceof ActionError) {
      console.error(error);
      return toast.error("Error al editar el núcleo");
    } else {
      toast.success("El núcleo se editó con éxito");
      openModal.value = false;
      navigate("");
    }
  } else {
    const { error } = await actions.core.createCore({
      name: coreForm.name,
      comite: { id: coreForm.comite.id },
    });
    if (error instanceof ActionError) {
      return toast.error(error.message);
    } else {
      toast.success("El núcleo se creó con éxito");
      openModal.value = false;
      navigate("");
    }
  }
  isLoading.value = false;
};
</script>
<template>
  <div class="mb-4 flex items-center justify-between">
    <h4 class="text-sm font-semibold text-muted-foreground">
      {{
        comite.cores.length === 0
          ? " No hay núcleos registrados"
          : "NÚCLEOS DEL COMITÉ"
      }}
    </h4>
    <Button
      v-if="!comite.disabled"
      size="sm"
      variant="outline"
      class="gap-2 bg-transparent"
      @click="open(comite)"
    >
      <PlusIcon class="h-3 w-3" />
      Nuevo Núcleo
    </Button>
  </div>
  <Card v-for="core in comite.cores" class="mb-2">
    <CardContent class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="bg-accent p-2 rounded">
          <Users class="size-4 text-accent-foreground" />
        </span>
        <div>
          <span>
            {{ core.name }}
            <Badge v-if="core.disabled" variant="destructive" class="text-xs">
              Deshabilitado
            </Badge>
          </span>

          <p class="text-sm text-muted-foreground">
            {{ core.militants.length }} militante(s)
          </p>
        </div>
      </div>
      <div>
        <AlertDialog>
          <DropdownMenu @update:open="if ($event) currentCore = core;">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" class="rounded-md">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="handleViewCore(core)">
                <Eye class="mr-2 h-4 w-4" />
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="navigate(`/settings/militants/new?core=${core.id}`)"
              >
                <Plus class="mr-2 h-4 w-4" />
                Añadir militante
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleEditCore(core, comite)">
                <Pencil class="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="core.disabled"
                @click="handleEnable(core)"
              >
                <FileCheck class="mr-2 h-4 w-4" />
                Habilitar
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
              <AlertDialogTitle>Eliminar núcleo</AlertDialogTitle>
              <AlertDialogDescription
                >Esta acción deshabilitará el núcleo. ¿Desea continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel> Cancelar </AlertDialogCancel>
              <Button @click="handleDeleteCore(core.id)" variant="destructive">
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardContent>
  </Card>

  <!-- Diálogo para añadir/editar núcleo -->
  <Dialog v-model:open="openModal">
    <DialogContent>
      <AlertDialogHeader>
        <DialogTitle
          >{{ isEditing ? "Editar Núcleo" : "Añadir Núcleo" }}
        </DialogTitle>
        <DialogDescription>
          {{
            isEditing
              ? "Modifica los datos del núcleo seleccionado."
              : "Completa los datos para crear un nuevo núcleo"
          }}
        </DialogDescription>
      </AlertDialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-left">Nombre</Label>
          <Input
            id="name"
            v-model="coreForm.name"
            class="col-span-3"
            placeholder="Nombre del núcleo"
          />
        </div>
        <div v-if="isEditing" class="grid grid-cols-4 items-center gap-4">
          <Label for="secretario-general" class="text-left"
            >Secretario General</Label
          >
          <Select
            v-model:modelValue="coreForm.generalSecretary.id"
            class="col-span-3"
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el secretario general" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-if="!militantsByCore(coreForm.id)"
                disabled
                value="0"
                >No hay militantes </SelectItem
              ><SelectItem
                v-for="militant of militantsByCore(coreForm.id)"
                :key="militant.id"
                :value="militant.id"
              >
                {{ militant.firstname }} {{ militant.lastname }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div v-if="isEditing" class="grid grid-cols-4 items-center gap-4">
          <Label for="secretario-funcionamiento" class="text-left"
            >Secretario de Funcionamiento</Label
          >
          <Select
            v-model:modelValue="coreForm.operationSecretary.id"
            class="col-span-3"
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Seleccione el secretario de funcionamiento"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-if="!militantsByCore(coreForm.id)"
                disabled
                value="0"
                >No hay militantes
              </SelectItem>
              <SelectItem
                v-for="militant of militantsByCore(coreForm.id)"
                :key="militant.id"
                :value="militant.id"
              >
                {{ militant.firstname }} {{ militant.lastname }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="comite" class="text-right">Comité</Label>
          <Select v-model:modelValue="coreForm.comite.id" class="col-span-3">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar comité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="comite in comites"
                :key="comite.id"
                :value="comite.id"
              >
                {{ comite.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline"> Cancelar </Button>
        </DialogClose>
        <Button
          @click="saveCore"
          :loading="isLoading"
          :disabled="
            !coreForm.name ||
            !coreForm.generalSecretary ||
            !coreForm.operationSecretary ||
            !coreForm.comite.id
          "
        >
          {{ isEditing ? "Guardar cambios" : "Crear núcleo" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="openEnable">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Habilitar</DialogTitle>
        <DialogDescription
          >Esta acción habilitará el núcleo. ¿Desea
          continuar?</DialogDescription
        >
      </DialogHeader>
      <DialogFooter>
        <DialogClose class="border rounded-md p-2">Cancelar</DialogClose>
        <Button @click="enable">Habilitar</Button>
      </DialogFooter>
    </DialogContent></Dialog
  >
</template>
