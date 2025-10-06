<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { absenceReasons } from "@/enum/absenceReasons";
import type { Militantes } from "@/interface/Militante";
import { XIcon } from "lucide-vue-next";

const { militantes } = defineProps<{
  militantes: Militantes[];
}>();
const handleAct = () => {};

const closeModal = () => {};
</script>

<template>
  <div class="space-y-4">
    <h2 class="font-medium text-xl">Causas de ausencias</h2>
    <form @submit="handleAct" class="space-y-2">
      <div class="flex gap-4 space-y-2">
        <FormField v-slot="{ componentField, field }" name="militante">
          <FormItem>
            <FormLabel class="sr-only"> </FormLabel>
            <FormControl>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el militante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="(item, index) of militantes"
                    :key="index"
                    :value="item.firstname"
                    >{{ item.firstname }} {{ item.lastname }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="reason">
          <FormItem>
            <FormLabel class="sr-only"> </FormLabel>
            <FormControl>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la causa de ausencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="(item, index) of absenceReasons"
                    :value="item"
                    >{{ item }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button variant="ghost" type="button"><XIcon /></Button>
      </div>
      
      <div class="flex justify-end gap-3">
        <Button type="button" variant="outline" @click="closeModal">
          Cancelar
        </Button>
        <Button type="submit"> Guardar </Button>
      </div>
    </form>
  </div>
</template>
