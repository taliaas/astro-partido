<script setup lang="ts">
import Badge from "@/components/ui/badge/Badge.vue";
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Label from "@/components/ui/label/Label.vue";
import type { Core } from "@/interface/Militante";
import { navigate } from "astro:transitions/client";
import {
  ArrowLeft,
  ChevronDownIcon,
  Shield,
  User,
  Users,
} from "lucide-vue-next";

const { currentCore } = defineProps<{
  currentCore: Core;
}>();
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-2">
      <Button variant="outline" @click="navigate('/settings/comites')"
        ><ArrowLeft
      /></Button>
      <div>
        <h2 class="font-medium text-2xl">Detalles del núcleo</h2>
        <p class="text-muted-foreground">
          Información completa del núcleo {{ currentCore?.name }}
        </p>
      </div>
    </div>
    <Card>
      <CardHeader>
        <CardTitle class="flex gap-3">
          <Shield class="size-4" />Información del Núcleo</CardTitle
        >
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 space-y-3">
          <div>
            <Label class="text-muted-foreground">Nombre</Label>
            <p>{{ currentCore?.name }}</p>
          </div>
          <div>
            <Label class="text-muted-foreground">Estado</Label>
            <Badge
              :class="
                currentCore?.disabled
                  ? 'bg-green-100 text-foreground'
                  : 'bg-red-100 text-foreground'
              "
              >{{ currentCore?.disabled ? "Activo" : "Inactivo" }}</Badge
            >
          </div>
          <div>
            <Label class="text-muted-foreground">Secretario General</Label>
            <p v-if="!currentCore.generalSecretary">No especificado</p>
            <p v-else>
              {{ currentCore?.generalSecretary.firstname }}
              {{ currentCore.generalSecretary.lastname }}
            </p>
          </div>
          <div>
            <Label class="text-muted-foreground"
              >Secretario de funcionamiento
            </Label>
            <p v-if="!currentCore.operationSecretary">No especificado</p>
            <p v-else>
              {{ currentCore?.operationSecretary.firstname }}
              {{ currentCore?.operationSecretary.lastname }}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Collapsible class="border rounded-md shadow-md p-4">
      <CollapsibleTrigger as-child>
        <div class="flex justify-between p-2">
          <div class="flex gap-3 items-center">
            <Users class="size-4" />
            <h2 class="font-medium">
              Militantes asociados ({{ currentCore?.militants.length || 0 }})
            </h2>
          </div>
          <ChevronDownIcon
            class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div class="px-2 space-y-2">
          <Card v-for="militant in currentCore?.militants">
            <CardHeader>
              <CardTitle>
                <div class="flex items-center gap-2">
                  <User
                    class="rounded-full bg-blue-100 size-8 p-2 text-blue-700"
                  />
                  <div>
                    <h2>{{ militant.firstname }} {{ militant.lastname }}</h2>
                    <p class="text-muted-foreground text-xs">
                      CI: {{ militant.ci }}
                    </p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
