<script setup lang="ts">
import { DownloadIcon } from 'lucide-vue-next';
import Button from './ui/button/Button.vue';
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <!-- Header Section -->
                <div class="p-6 border-b border-gray-100">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Estado del Funcionamiento PCC CUJAE</h1>
                        <h2 class="text-2xl font-semibold text-gray-400">Cómite UJC CUJAE</h2>
                    </div>

                    <div class="flex items-center justify-end">
                        <Button class="rounded border border-gray-200 hover:bg-gray-50 ">
                            <DownloadIcon class="h-4 w-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                </div>

                <!--Table-->
                <div>
                    
                </div>
            </div>
        </div>
    </div>
</template>