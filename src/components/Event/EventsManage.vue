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
          <Button @click="openEdit = true">
            <CalendarPlus class="h-4 w-4" />Añadir
          </Button>
        </div>
        <Table class="border">
          <TableHeader class="text-gray-500 uppercase">
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead class="text-center">Tipo</TableHead>
              <TableHead class="text-center">Estado</TableHead>
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
              <TableCell class="text-center">{{ event.status }}</TableCell>
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
                    <DropdownMenuItem @click="handleAction('edit', event)">
                      <Pencil class="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      @click="deleteEvent(event)"
                    >
                      <Trash class="size-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow v-if="events.total === 0">
              <TableCell colspan="6">
                <div class="text-muted-foreground text-center">
                  <div
                    class="mx-auto h-10 w-10 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center"
                  >
                    <CalendarFold />
                  </div>
                  <p>No hay eventos</p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-else>
              <TableCell colspan="6">
                <div v-if="events?.total !== 0" class="flex justify-between">
                  <div
                    class="text-md text-muted-foreground flex items-center gap-1"
                  >
                    Mostrando
                    <span class="font-medium">{{ page || 1 }}</span> de
                    <span class="font-medium">{{
                      events?.totalPages || 1
                    }}</span>
                    páginas
                  </div>

                  <div class="flex gap-2">
                    <Button
                      size="icon"
                      :disabled="page === 1"
                      variant="outline"
                      @click="goToPreviousPage"
                    >
                      <ArrowLeft />
                    </Button>
                    <Button
                      size="icon"
                      :disabled="!hasNextPage"
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
  <EventDialog :event="currentEvent" :users v-model:open="openEdit" />
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/interface/Militante";
import { useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import {
  ArrowLeft,
  ArrowRight,
  CalendarFold,
  CalendarPlus,
  Eye,
  MoreVerticalIcon,
  Pencil,
  Trash,
} from "lucide-vue-next";
import { ref, watch } from "vue";

import EventDialog from "@/components/Event/EventDialog.vue";
import type { EventStatus } from "@/enum/Event";
import { actions } from "astro:actions";

export interface EventItem {
  id: number;
  title: string;
  time: "";
  type: string;
  date: Date;
  read: boolean;
  status: EventStatus;
  details: string;
  owner: User;
  responsables: User[];
  place: string;
  createdAt: Date;
  expiresAt: Date;
}

const {
  events,
  page = 1,
  users,
} = defineProps<{
  events: {
    data: EventItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  page: number;
  limit: number;
  users: User[];
}>();

const currentEvent = ref<EventItem | undefined>();
const openEdit = ref(false);
const hasNextPage = Number(page) < Number(events.totalPages);
const searchParams = useUrlSearchParams();

watch(openEdit, (open) => {
  if (!open) {
    currentEvent.value = undefined;
  }
});

async function handleAction(action: string, event: EventItem) {
  if (action === "view") {
    navigate(`event/${event.id}`);
  } else if (action === "edit") {
    currentEvent.value = event;
    openEdit.value = true;
  }
}

function goToNextPage() {
  const query = new URLSearchParams(searchParams as any);
  if (events.total > page) {
    query.set("page", Number(page) + 1 + "");
    navigate(`?` + query.toString());
  }
}

function goToPreviousPage() {
  const query = new URLSearchParams(searchParams as any);
  if (page > 1) {
    query.set("page", Number(page) - 1 + "");
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
  const page: number = events.page;
  return Number(page - 1) * Number(limit) + (index + 1);
};

async function deleteEvent(event: EventItem) {
  await actions.events.deleteEvents({ id: event?.id });
  navigate("");
}
</script>
