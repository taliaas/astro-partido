<template>
  {{ edit }}
</template>
<script setup lang="ts">
import type { EventItem } from "@/components/Event/EventComponent.vue";

const { edit, event } = defineProps<{
  edit: boolean;
  event: EventItem | null;
}>();
</script>
