<template>
  <div class="min-h-screen bg-gray-50">
    <div
      class="mx-auto bg-gradient-to-r from-blue-400 to-blue-800 h-48 relative"
    >
      <Tabs v-model="activeTab" class="space-y-4">
        <TabsList class="w-full text-gray-700 p-2">
          <TabsTrigger v-for="tab in menuItems" :key="tab.id" :value="tab.name">
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          v-for="tab in menuItems"
          :key="tab.id"
          :value="tab.name"
          class="space-y-4"
        >
          <component
            :is="tab.components"
          />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BuildingIcon,
  CogIcon,
  FileTextIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-vue-next";
import { ref } from "vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListCore from "@/components/Core/ListCore.vue";
import Usuarios from "@/components/settings/Usuarios.vue";
import Notifications from "@/components/settings/Notifications.vue";
import Permisos from "@/components/settings/Permisos.vue";
import Documents from "@/components/settings/Documents.vue";

const menuItems = [
  { id: "usuarios", name: "Usuarios", icon: UsersIcon, components: Usuarios },
  {
    id: "noti",
    name: "Notificación",
    icon: CogIcon,
    components: Notifications,
  },
  { id: "permisos", name: "Permisos", icon: ShieldIcon, components: Permisos },
  {
    id: "documentos",
    name: "Documentos",
    icon: FileTextIcon,
    components: Documents,
  },
  { id: "core", name: "Núcleo", icon: "BuildingIcon", components: ListCore },
];

const activeTab = ref("usuarios");
</script>
