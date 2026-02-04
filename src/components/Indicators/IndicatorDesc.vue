<script setup lang="ts">
import Asistencia from "@/components/Indicators/AttendanceComponents/Asistencia.vue";
import IndicatorLater from "@/components/Indicators/AttendanceComponents/IndicatorLater.vue";
import ReasonAttendance from "@/components/Indicators/AttendanceComponents/ReasonAttendance.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Comite } from "@/interface/Militante";
import { indicators } from "@/utils/indicators";
import { useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import { XIcon } from "lucide-vue-next";
import type { AcceptableValue } from "reka-ui";

const { indicator, comite, computos } = defineProps<{
  indicator: string;
  computos: any[];
  comite: Comite[];
}>();

const searchParams = useUrlSearchParams("history", {
  removeFalsyValues: true,
  initialValue: {
    date: getDefaultFilterDate(),
    indicator: "",
    name: "",
  },
});

function getDefaultFilterDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const handleModelFilter = (filter: string, value: string) => {
  const query = new URLSearchParams(searchParams as any);
  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }
  navigate("?" + query.toString());
};

const handleNavigate = (ind: AcceptableValue) => {
  navigate(
    `/indicators/comite/${ind}?${new URLSearchParams(searchParams as any).toString()}`,
  );
};
</script>

<template>
  <div class="mx-auto p-6">
    <!-- Selected Indicator Analysis -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-end">
        <Button
          variant="ghost"
          @click=""
          class="text-gray-500 hover:text-gray-700"
        >
          <a href="/indicators/comite"><XIcon class="h-5 w-5" /></a>
        </Button>
      </div>
      <div class="flex items-center justify-between mb-6">
        <div class="w-full">
          <Select
            :default-value="indicator"
            @update:model-value="handleNavigate"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="[key, indicator] of Object.entries(indicators)"
                  :value="key"
                  >{{ indicator.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <!-- Date -->
        <Input
          type="month"
          class="basis-1/10"
          :model-value="searchParams.date as string"
          @update:model-value="handleModelFilter('date', $event as string)"
        />
      </div>

      <div v-if="indicator === 'asistencia'">
        <Asistencia :comite :computos />
      </div>

      <div v-else-if="indicator === 'reason'">
        <ReasonAttendance :comite :computos />
      </div>
      <div v-else class="space-y-3">
        <IndicatorLater :comite :computos />
      </div>
    </div>
  </div>
</template>
