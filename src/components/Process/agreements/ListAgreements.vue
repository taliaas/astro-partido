<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import Badge from "@/components/ui/badge/Badge.vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Agreements } from "@/interface/Militante";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  Download,
  Eye,
  MoreVerticalIcon,
  PencilIcon,
  SearchIcon,
  Trash,
} from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

const { agreements } = defineProps<{
  agreements: { data: Agreements[] };
}>();

const loading = ref(false);

const handleAction = (action: string, agreement: Agreements) => {
  if (action === "view") navigate(`/process/agreements/view/${agreement.id}`);
  else if (action === "edit")
    navigate(`/process/agreements/edit/${agreement.id}`);
  else if (action === "delete") deleteAgreement(agreement.id);
};

async function deleteAgreement(id: string) {
  loading.value = true;
  try {
    await actions.agreements.deleteAgreement.orThrow(+id);
    toast.success("Acuerdo elimnado exitosamente");
    navigate("");
  } catch (e) {
    console.error(e);
    toast.error("Ah ocurrido un error al intentar de eliminar el acuerdo");
  }
  loading.value = false;
}
</script>
<template>
  <div class="p-2 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Acuerdos</h2>
        <p class="text-gray-600">
          Administra los acuerdos de las actas del núcleo
        </p>
      </div>
      <div>
        <Button variant="outline" @click="">
          <Download class="size-4" />
          Exportar
        </Button>
      </div>
    </div>
    <div>
      <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <Table class="w-full">
            <TableHeader class="uppercase">
              <TableRow class="font-medium text-left">
                <TableHead class="px-2 text-center">No.</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead class="text-center">Participantes</TableHead>
                <TableHead>Fecha Creado</TableHead>
                <TableHead>Fecha de Cumplimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead class="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="(agreement, index) in agreements.data"
                :key="agreement.id"
                class="hover:bg-gray-50"
              >
                <TableCell class="font-medium text-center">{{
                  index + 1
                }}</TableCell>
                <TableCell
                  class="overflow-hidden text-ellipsis whitespace-nowrap w-[150px] max-w-[150px]"
                >
                  <span v-if="agreement.descripcion">{{
                    agreement.descripcion
                  }}</span>
                  <span v-else>-</span>
                </TableCell>
                <TableCell class="text-center">
                  <span v-if="agreement.responsable"
                    >{{ agreement.responsable?.firstname }}
                    {{ agreement.responsable?.lastname }}</span
                  >
                  <span v-else>-</span></TableCell
                >
                <TableCell
                  class="text-center overflow-hidden text-ellipsis whitespace-nowrap w-[150px] max-w-[150px]"
                >
                  <span
                    v-if="agreement.participants.length"
                    v-for="participant in agreement.participants"
                    :key="participant.id"
                  >
                    {{ participant.firstname }} {{ participant.lastname }}
                  </span>
                  <span v-else>-</span>
                </TableCell>
                <TableCell class="text-center">{{
                  agreement.created
                }}</TableCell>
                <TableCell class="text-center">{{
                  agreement.enddate
                }}</TableCell>
                <TableCell>
                  <Badge variant="outline">{{ agreement.status }}</Badge>
                </TableCell>
                <TableCell class="text-center">
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger class="focus:outline-none">
                        <Button
                          variant="ghost"
                          size="icon"
                          class="rounded-full"
                        >
                          <MoreVerticalIcon class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          @click="handleAction('view', agreement)"
                        >
                          <Eye class="h-4 w-4" />
                          Ver
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          @click="handleAction('edit', agreement)"
                        >
                          <PencilIcon class="size-4" />
                          Editar
                        </DropdownMenuItem>
                        <Separator />
                        <AlertDialogTrigger as-child>
                          <DropdownMenuItem variant="destructive" class="p-2">
                            <Trash class="h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar acuerdo</AlertDialogTitle>
                        <AlertDialogDescription
                          >Esta acción eliminará el acuerdo de forma permanente.
                          ¿Desea continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel> Cancelar </AlertDialogCancel>

                        <Button
                          @click="handleAction('delete', agreement)"
                          variant="destructive"
                        >
                          Eliminar
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell v-if="agreements.data.length === 0"
                  >No hay acuerdos</TableCell
                >
              </TableRow>
            </TableBody>
          </Table>

          <!-- Empty State -->
          <div v-if="agreements.data.length === 0" class="text-center p-4">
            <div
              class="mx-auto text-gray-400 rounded-full flex items-center justify-center"
            >
              <SearchIcon class="h-6 w-6" />
            </div>
            <h3 class="mt-4 text-sm font-medium text-gray-900">
              No se encontraron acuerdos
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Ajuste los filtros o cree una nueva acuerdo para comenzar.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
