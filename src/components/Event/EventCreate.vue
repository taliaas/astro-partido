<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <FormField name="title" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Título</FormLabel>
        <FormControl>
          <Input
            id="title"
            placeholder="Nombre del evento"
            v-bind="componentField"
            required
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="details" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Descripción</FormLabel>
        <FormControl>
          <Textarea
            id="description"
            placeholder="Descripcion del evento"
            rows="3"
            v-bind="componentField"
            required
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="grid grid-cols-2 gap-4">
      <FormField name="date" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Fecha</FormLabel>
          <FormControl>
            <Input id="date" type="date" v-bind="componentField" required />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField name="time" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Hora</FormLabel>
          <FormControl>
            <Input id="time" type="time" v-bind="componentField" required />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <FormField name="type" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Tipo</FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="type in EventType" :key="type" :value="type">
                  {{ type }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="status" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Estado</FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Estado del evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="status in EventStatus"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <FormField name="responsables" v-slot="{ componentField, field }">
      <FormItem>
        <FormLabel>Responsable</FormLabel>
        <FormControl>
          <Select v-bind="componentField" multiple>
            <SelectTrigger class="h-auto! w-full">
              <div
                v-if="field.value.length"
                class="flex gap-1 flex-wrap justify-start"
              >
                <Badge
                  variant="secondary"
                  v-for="value in field.value as number[]"
                  :key="value"
                  >{{ getUserFullName(value) }}</Badge
                >
              </div>
              <template v-else>Responsable del evento</template>
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="user of users" :value="user.id">
                {{ user.militant.firstname }} {{ user.militant.lastname }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="place" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Ubicación</FormLabel>
        <FormControl>
          <Input placeholder="Lugar del evento" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <DialogFooter class="pt-4">
      <DialogClose as-child>
        <Button type="button" variant="outline"> Cancelar </Button>
      </DialogClose>

      <Button type="submit">
        <span v-if="loading">Guardando...</span>
        <span v-else>{{ edit ? "Guardar" : "Crear" }}</span>
      </Button>
    </DialogFooter>
  </form>
</template>
<script setup lang="ts">
import { EventStatus, EventType } from "@/enum/Event";

import {
  eventsSchema,
  type EventsData,
} from "@/components/Event/events-schema";
import type { EventItem } from "@/components/Event/EventsManage.vue";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import type { User } from "@/interface/Militante";
import { toTypedSchema } from "@vee-validate/zod";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { Badge } from "@/components/ui/badge";

const { event, users } = defineProps<{
  event?: EventItem;
  users: User[];
}>();

const edit = Boolean(event);

const loading = ref(false);

const form = useForm<EventsData>({
  validationSchema: toTypedSchema(eventsSchema),
  initialValues: {
    id: event?.id ?? null,
    title: event?.title ?? "",
    details: event?.details ?? "",
    place: event?.place ?? "",
    read: event?.read ?? false,
    type: event?.type ?? ("" as any),
    status: event?.status ?? ("" as any),
    date: event?.date ?? (null as any),
    time: event?.time ?? "",
    createdAt: event?.createdAt ?? (null as any),
    expiresAt: event?.expiresAt ?? (null as any),
    responsables: event?.responsables.map((i) => i.id) ?? [],
  },
});

const submitForm = async () => {
  loading.value = true;
  const data = form.values;
  try {
    await actions.events.createEvent.orThrow(data);
    toast.success("Se creó el evento correctamente");
    navigate("/event");
  } catch (error) {
    loading.value = false;
    if (error instanceof ActionError) {
      toast.error(error.message);
    }
  }
};

const getUserFullName = (id: number) => {
  const user = users.find((i) => i.id === id)!;
  return `${user.militant.firstname} ${user.militant.lastname}`;
};
</script>
