<template>
  <div class="max-w-6xl mx-auto space-y-6 p-4">
    <div class="p-6 rounded border border-gray-200 bg-white shadow-sm">
      <div class="mb-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 pb-2">
          Gestión de Indicadores
        </h1>
      </div>
      <div class="space-y-4 py-4">
        <h2 class="p-2 w-full text-xl font-medium">Nuevo indicador</h2>
        <form class="space-y-2">
          <div class="flex">
            <div class="space-y-2 p-2 flex-1">
              <Label class="py-2">Nombre</Label>
              <Input class="flex"></Input>
            </div>
            <div class="space-y-2 p-2 basis-72">
              <Label> Tipo de dato</Label>
              <Select v-model="typeData" class="w-1/2">
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de dato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="binary">Binario (0 o 1)</SelectItem>
                    <SelectItem value="count">Número</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="space-y-2 p-2">
            <Label class="py-2">Descripción</Label>
            <Textarea class="w-full" v-model="descriptions"></Textarea>
          </div>
          <div class="space-y-2 p-2">
            <Label class="py-2">Palabras claves</Label>
            <Textarea class="w-full" v-model="keyboards"></Textarea>
          </div>
          <div class="p-4 flex justify-end space-x-4">
            <Button class="border basis-36" variant="secondary">
              Cancelar
            </Button>
            <Button class="bg-button basis-36"> Guardar</Button>
          </div>
        </form>

        <div
          class="flex p-2 items-center w-full justify-between text-lg font-medium"
        >
          Modificar indicador
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ref } from "vue";

const typeData = ref();
const descriptions = ref("");
const keyboards = ref("");
</script>
