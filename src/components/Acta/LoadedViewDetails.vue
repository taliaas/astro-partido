<script setup lang="ts">
import {
Card,
CardContent,
CardHeader,
CardTitle
} from "@/components/ui/card";
import { getFile } from "@/utils/files.ts";
const { acta } = defineProps<{
  acta: any;
}>();
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <Card class="w-full">
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle class="text-3xl font-bold">
              {{ acta?.name }}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <embed
            :src="getFile(acta.id)"
            type="application/pdf"
            width="100%"
            height="1000"
            title="Embedded PDF Viewer"
            
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
