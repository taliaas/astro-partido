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
import { EditIcon, MoreVerticalIcon, Trash2Icon } from "lucide-vue-next";
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

function openDetails() {
  open.value = !open.value;
}

const saveCore = () => {};
</script>

<template>
  <div class="p-4">
    <div class="rounded-md border">
      <table class="w-full text-md">
        <thead>
          <tr class="border-b bg-muted/50 font-semibold">
            <th class="h-10 px-4 text-left">Nombre</th>
            <th class="h-10 px-4 text-center">Secretario General</th>
            <th class="h-10 px-4 text-center">Secretario del Funcionamiento</th>
            <th class="h-10 px-4 text-center">Militantes</th>
            <th class="h-10 px-4 text-center">Estado</th>
            <th class="h-10 px-4 text-left w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cores.data.length === 0">
            <td colspan="3" class="p-4 text-center text-muted-foreground">
              No hay núcleos registrados.
            </td>
          </tr>

          <tr v-for="core in cores.data" :key="core.id" class="p-2">
            <td class="h-10 px-4 text-left">{{ core.name }}</td>
            <td class="h-10 px-4 text-center">
              {{ core.generalSecretary.firstname }}
              {{ core.generalSecretary.lastname }}
            </td>
            <td class="h-10 px-4 text-center">
              {{ core.operationSecretary.firstname }}
              {{ core.operationSecretary.lastname }}
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
                      @click.prevent="handleEditCore(core)"
                    >
                      <EditIcon class="h-4 w-4" />
                      Editar
                    </a>

                    <div class="border-t my-1"></div>
                    <a
                      href="#"
                      class="px-4 py-2 text-sm text-red-600 hover:bg-muted flex items-center gap-2"
                      @click.prevent="handleDeleteCore(core.id)"
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
