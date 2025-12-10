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
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
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
import { MoreVerticalIcon, Pencil, Trash2Icon } from "lucide-vue-next";
import { reactive, ref, watch } from "vue";
import { toast } from "vue-sonner";

const { cores, militants, comites } = defineProps<{
  cores: { data: Core[] };
  militants: Militant[];
  comites: Comite[];
}>();

const openModal = defineModel<boolean>("open");
const currentCore = ref<Core>();
const isEditing = ref(false);
const isLoading = ref(false);
const open = ref(false);

const coreForm = reactive<Core>({
  id: "",
  name: "",
  disabled: false,
  generalSecretary: null as any,
  operationSecretary: null as any,
  comite: null as any,
  militants: [],
  users: [],
});

// Watch para actualizar el formulario cuando currentCore cambie
watch(
  currentCore,
  (newCore) => {
    if (newCore) {
      coreForm.id = newCore.id;
      coreForm.name = newCore.name;
      coreForm.disabled = newCore.disabled;
      coreForm.generalSecretary = newCore.generalSecretary;
      coreForm.operationSecretary = newCore.operationSecretary;
      coreForm.comite = newCore.comite;
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
  },
  { immediate: true }
);

const handleEditCore = (core: any) => {
  currentCore.value = core;
  isEditing.value = true;
  openModal.value = true;
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

const saveCore = () => {};
</script>

<template>
  <div class="p-4">
    <div class="rounded-md border">
      <table class="w-full text-md">
        <thead>
          <tr class="border-b font-semibold">
            <th
              class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
            >
              Nombre
            </th>
            <th
              class="h-10 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Cómite
            </th>
            <th
              class="h-10 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Secretario General
            </th>
            <th
              class="h-10 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Secretario del Funcionamiento
            </th>
            <th
              class="h-10 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Militantes
            </th>
            <th
              class="h-10 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Estado
            </th>
            <th
              class="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]"
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cores.data?.length === 0">
            <td colspan="3" class="p-4 text-center text-muted-foreground">
              No hay núcleos registrados.
            </td>
          </tr>

          <tr v-for="core in cores.data" :key="core.id" class="p-2 border">
            <td class="h-10 px-6 py-4 text-left">{{ core.name }}</td>
            <td class="h-10 px-4 text-center">{{ core.comite.name }}</td>
            <td class="h-10 px-4 text-center">
              <span v-if="core.generalSecretary?.id"
                >{{ core.generalSecretary?.firstname }}
                {{ core.generalSecretary?.lastname }}</span
              >
              <span v-else>-</span>
            </td>
            <td class="h-10 px-4 text-center">
              <span v-if="core.operationSecretary?.id">
                {{ core.operationSecretary?.firstname }}
                {{ core.operationSecretary?.lastname }}</span
              >
              <span v-else>-</span>
            </td>
            <td class="h-10 px-4 text-center">
              <Badge variant="outline">{{ core?.militants?.length }}</Badge>
            </td>
            <td class="h-10 px-4 text-center">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  core.disabled
                    ? 'bg-red-50 text-red-700 border border-red-300'
                    : 'bg-green-50 text-green-700 border border-green-300',
                ]"
              >
                {{ core.disabled ? "Inactivo" : "Activo" }}
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
                  <DropdownMenuItem @click="handleEditCore(core)">
                    <Pencil class="h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="handleDeleteCore(core.id)"
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
    <!-- Diálogo para añadir/editar núcleo -->
    <Dialog v-model:open="openModal">
      <DialogContent>
        <DialogHeader>
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
        </DialogHeader>
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
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="secretario-general" class="text-left"
              >Secretario General</Label
            >
            <Select
              v-bind:default-value="coreForm.generalSecretary?.id"
              @update:model-value="
                coreForm.generalSecretary = {
                  id: $event?.toString() ?? '',
                } as any
              "
              class="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el secretario general" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="militant in militants"
                  :key="militant.id"
                  :value="militant.id"
                >
                  {{ militant.firstname }} {{ militant.lastname }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="secretario-funcionamiento" class="text-left"
              >Secretario de Funcionamiento</Label
            >
            <Select
              v-bind:default-value="coreForm.operationSecretary?.id"
              @update:model-value="
                coreForm.operationSecretary = {
                  id: $event?.toString() ?? '',
                } as any
              "
              class="col-span-3"
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Seleccione el secretario de funcionamiento"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="militant in militants"
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
            <Select
              v-bind:default-value="coreForm.comite?.id"
              @update:model-value="
                coreForm.comite = {
                  id: $event?.toString() ?? '',
                } as any
              "
              class="col-span-3"
            >
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
  </div>
</template>
