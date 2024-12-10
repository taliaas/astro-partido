<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-700">Áreas</h2>
    <TransitionGroup name="list" tag="ul" class="space-y-4">
      <li
        v-for="(area, index) in areas"
        :key="area.id"
        class="flex items-center space-x-2"
      >
        <Input
          class="rounded border-gray-300"
          v-model="area.name"
          :placeholder="`Añadir área ${index + 1}`"
          required
        />
        <Button
          class="rounded border-gray-300"
          type="button"
          variant="destructive"
          size="icon"
          @click="removeArea(index)"
          :disabled="areas.length === 1"
        >
          <TrashIcon class="h-4 w-4 text-red-600" />
        </Button>
      </li>
    </TransitionGroup>
    <Button
      type="button"
      variant="outline"
      @click="addArea"
      class="w-full rounded border-gray-300 shadow-sm"
    >
      Añadir área
    </Button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrashIcon } from "lucide-vue-next";

interface Area {
  id: number;
  name: string;
}

const areas = ref<Area[]>([{ id: 1, name: "" }]);

const addArea = () => {
  areas.value.push({ id: Date.now(), name: "" });
};

const removeArea = (index: number) => {
  if (areas.value.length > 1) {
    areas.value.splice(index, 1);
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
