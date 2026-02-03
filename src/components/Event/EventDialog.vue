<script setup lang="ts">
import EventCreate from "@/components/Event/EventCreate.vue";
import type { EventItem } from "@/components/Event/EventsManage.vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/interface/Militante";
import { computed } from "vue";

const { event, users } = defineProps<{
  event?: EventItem;
  users: User[];
}>();

const open = defineModel<boolean>("open", { default: false, required: true });
const edit = computed(() => Boolean(event));
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ edit ? "Modificar eventos" : "Crear eventos" }}
        </DialogTitle>
        <DialogDescription>
          {{
            edit
              ? "Modifica los datos del evento"
              : "Completa los datos para crear un nuevo evento"
          }}
        </DialogDescription>
      </DialogHeader>
      <EventCreate :event :users />
    </DialogContent>
  </Dialog>
</template>
