<template>
  {{ event }}
</template>
<script setup lang="ts">
import type { EventItem } from "@/components/Event/EventComponent.vue";

const { event } = defineProps<{
  event: EventItem;
}>();
</script>
