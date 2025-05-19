<template>
  <div class="rounded-lg border bg-card shadow-sm">
    <div class="p-6 space-y-6">
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="stat in list" :key="stat.title" class="rounded-lg border bg-card p-3 shadow-md hover:bg-muted" @click="openTable">
          <div class="text-sm font-medium text-muted-foreground">{{ stat.title }}</div>
          <div class="mt-1 text-2xl font-bold">{{ stat.value }}</div>
        </div>
      </div>

      <div class="p-2">
        <div class="flex flex-row items-center justify-between mb-4">
          <h2 class="font-medium text-muted-foreground">Cómites</h2>
          <button class="rounded-md bg-button px-3 py-2 text-sm font-medium text-primary-foreground flex items-center gap-1">
            Añadir Rol
          </button>
        </div>
        <div class="rounded-md border">
          <table class="w-full text-sm">
            <thead>
            <tr class="border-b bg-muted/50 font-medium">
              <th class="h-10 px-4 text-left">Nombre</th>
              <th class="h-10 px-4 text-left">Núcleos</th>
              <th class="h-10 px-4 text-left">Usuarios</th>
              <th class="h-10 px-4 text-left w-[50px]"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="comi in comites" :key="comi.id" class="border-b transition-colors hover:bg-muted/50">
              <td class="p-4 font-medium">{{ comi.name }}</td>
              <td class="p-4 text-muted-foreground">{{ comi.core }}</td>
              <td class="p-4">{{ comi.user }}</td>
              <td class="p-4">
                <div class="relative">
                  <button
                      @click="toggleComiteDropdown(role.id)"
                      class="rounded-md p-1 hover:bg-muted"
                  ><MoreVerticalIcon class="h-4 w-4"/></button>
                  <div
                      v-if="activeComiteDropdown === comi.id"
                      class="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-background shadow-lg"
                  >
                    <div class="py-2 px-3 text-sm font-medium text-muted-foreground border-b bg-muted">Acciones</div>
                    <div class="py-1">
                      <a href="#" class="block px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
                        Editar
                      </a>
                      <div class="border-t my-1"></div>
                      <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-muted flex items-center gap-2">
                        Eliminar
                      </a>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {MoreVerticalIcon} from "lucide-vue-next";
import {ref} from "vue";

const list = [
  { title: 'Total de Cómite', value: '5' },
  { title: 'Total de Núcleo', value: '25' },
  { title: 'Total de Miembros', value: '456' },
]

const activeComiteDropdown = ref(null)
const toggleComiteDropdown = (id) => {
  activeComiteDropdown.value = activeComiteDropdown.value === id ? null : id
}
</script>

