<script setup lang="ts">
import type { User } from "@/interface/Militante";

const { user } = defineProps<{
  user?: User;
}>();
</script>

<template>
  {{ user }}
</template>
