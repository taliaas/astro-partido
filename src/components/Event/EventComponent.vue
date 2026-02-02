<template>
  <div class="min-h-screen mt-4 rounded-xl p-4 bg-gray-50">
    <Card class="container mx-auto p-4">
      <CardHeader>
        <CardTitle class="text-2xl">Gestion de Eventos</CardTitle>
        <CardDescription class="text-md">
          Gestiona y visualiza todos tus eventos programados
        </CardDescription>
      </CardHeader>

      <CardContent class="p-4 space-y-2">
        <div class="flex gap-2">
          <Input type="search" placeholder="Buscar..." />
          <Dialog>
            <DialogTrigger as-child>
              <Button @click="isEditing = true">
                <CalendarPlus class="h-4 w-4" />Añadir</Button
              >
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{{
                  isEditing ? "Crear eventos" : "Modificar eventos"
                }}</DialogTitle>
                <DialogDescription>
                  {{
                    isEditing
                      ? "Completa los datos para crear un nuevo evento"
                      : "Modifica los datos del evento"
                  }}
                </DialogDescription>
                <form class="flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <Label name="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Nombre del evento"
                      required
                    />
                  </div>

                  <div class="flex flex-col gap-2">
                    <Form
                    <Label name="description">Descripción</Label>
                    <Textarea
                      id="description"
                      placeholder="Descripcion del evento"
                      rows="3"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                      <Label name="date">Fecha</Label>
                      <Input id="date" type="date" required />
                    </div>
                    <div class="flex flex-col gap-2">
                      <Label name="time">Hora</Label>
                      <Input id="time" type="time" required />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                      <Label>Tipo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem :value="0"> </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div class="flex flex-col gap-2">
                      <Label>Estado</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem :value="0"> </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <Label>Responsable</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem :value="0"> </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="flex flex-col gap-2">
                    <Label name="location">Ubicacion</Label>
                    <Input id="location" placeholder="Lugar del evento" />
                  </div>

                  <DialogFooter class="pt-4">
                    <Button type="button" variant="outline"> Cancelar </Button>
                    <Button type="submit">{{
                      isEditing ? "Guardar" : "Crear"
                    }}</Button>
                  </DialogFooter>
                </form>
              </DialogHeader>
              <EventCreate :isEditing :event="currentEvent" />
            </DialogContent>
          </Dialog>
        </div>
        <Table class="border">
          <TableHeader class="text-gray-500 uppercase">
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead class="text-center">Tipo</TableHead>
              <TableHead class="text-center">Creado por</TableHead>
              <TableHead class="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(event, index) in events?.data"
              :key="event.id"
              class="hover:bg-gray-50/50 transition-colors duration-200"
            >
              <TableCell> {{ indexPage(index) }} </TableCell>
              <TableCell>{{ event.title }}</TableCell>
              <TableCell>{{ event.date }}</TableCell>
              <TableCell class="text-center">{{ event.type }}</TableCell>
              <TableCell class="text-center">{{ event.user.name }}</TableCell>
              <TableCell class="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger class="focus:outline-none">
                    <Button variant="ghost" size="icon" class="rounded-full">
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="handleAction('view', event)">
                      <Eye class="h-4 w-4" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil class="h-4 w-4" />
                      isEditingar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Trash class="size-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colspan="6">
                <div v-if="events?.total !== 0" class="flex justify-between">
                  <div
                    class="text-md text-muted-foreground flex items-center gap-1"
                  >
                    Mostrando
                    <span class="font-medium">{{ page || 1 }}</span> de
                    <span class="font-medium">{{ events?.total || 1 }}</span>
                    páginas
                  </div>

                  <div class="flex gap-2">
                    <Button
                      size="icon"
                      :disabled="currentPage === 1"
                      variant="outline"
                      @click="goToPreviousPage"
                    >
                      <ArrowLeft />
                    </Button>
                    <Button
                      size="icon"
                      :disabled="currentPage >= hasNextPage"
                      variant="outline"
                      @click="goToNextPage"
                    >
                      <ArrowRight />
                    </Button>

                    <Select
                      :default-value="searchParams.limit ?? '10'"
                      @update:model-value="handleFilterByValue('limit', $event)"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent class="font-normal">
                        <SelectGroup>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="15">15</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableFooter,
  TableBody,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/interface/Militante";
import { useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import {
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Eye,
  MoreVerticalIcon,
  Pencil,
  Trash,
} from "lucide-vue-next";
import { ref } from "vue";
import Card from "@/components/ui/card/Card.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import Input from "@/components/ui/input/Input.vue";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import EventCreate from "@/components/Event/EventCreate.vue";
import Label from "@/components/ui/label/Label.vue";
import Textarea from "@/components/ui/textarea/Textarea.vue";

export interface EventItem {
  id: number;
  type: string;
  title: string;
  date: Date;
  user: User;
  read: boolean;
  createdAt: Date;
  expiresAt: Date;
}

const { events, page, limit } = defineProps<{
  events: { data: EventItem[]; total: number; page: number; limit: number };
  page: number;
  limit: number;
}>();

const currentPage = ref(page || 1);
const currentEvent = ref<Event | null>(null);
const isEditing = ref(false);
const hasNextPage = ref(events?.total);
const searchParams = useUrlSearchParams();

async function handleAction(action: string, event: EventItem) {
  if (action === "view") {
    navigate(`event/${event.id}`);
  } else if (action === "isEditing") {
    navigate(`event/${event.id}/isEditing`);
  } else if (action === "delete") {
  }
}

function goToNextPage() {
  const query = new URLSearchParams(searchParams as any);
  if (events.total > currentPage.value) {
    currentPage.value++;
    query.set("page", currentPage.value + "");
    navigate(`?` + query.toString());
  }
}

function goToPreviousPage() {
  const query = new URLSearchParams(searchParams as any);
  if (currentPage.value > 1) {
    currentPage.value--;
    query.set("page", currentPage.value + "");
    navigate(`?` + query.toString());
  }
}

const handleFilterByValue = (filter: string, value: any) => {
  const query = new URLSearchParams(searchParams as any);
  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }
  navigate("?" + query.toString());
};

const indexPage = (index: number) => {
  const limit: number = events.limit;
  const page: number = events.total;
  return Number(page - 1) * Number(limit) + (index + 1);
};
</script>
