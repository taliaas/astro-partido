<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import { absenceReasons } from "@/enum/absenceReasons";


const handleAct = () => {};
</script>

<template>
  <div class="space-y-4">
    <h2 class="font-medium text-xl">Causas de ausencias</h2>
    <form @submit="handleAct" class="space-y-2">
      <div class="grid grid-cols-2 gap-4 space-y-2">
        <FormField
          v-for="item in absenceReasons"
          v-slot="{ componentField }"
          :name="item"
        >
          <FormItem>
            <FormLabel class=""> {{ item }} </FormLabel>
            <FormControl>
              <Input
                type="text"
                required
                placeholder="Añade el militante"
                :="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="flex justify-end">
        <Button type="submit"> Guardar </Button>
      </div>
    </form>
  </div>
</template>
