<template>
    <div class="min-h-screen w-full bg-gray-50">

        <main class="p-4 sm:p-6 lg:p-8">
            <div class="space-y-6">
                <!-- Stats -->
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        class="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-red-600">Documentos Pendientes</p>
                                <p class="mt-2 text-3xl font-bold text-gray-900">12</p>
                            </div>
                            <div class="rounded-full bg-red-100 p-3">
                                <Clock class="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                        <div class="absolute bottom-0 left-0 h-1 w-full bg-red-100">
                            <div class="h-full w-1/3 bg-red-500"></div>
                        </div>
                    </div>

                    <div
                        class="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-green-600">Documentos Procesados</p>
                                <p class="mt-2 text-3xl font-bold text-gray-900">45</p>
                            </div>
                            <div class="rounded-full bg-green-100 p-3">
                                <CheckCircle class="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div class="absolute bottom-0 left-0 h-1 w-full bg-green-100">
                            <div class="h-full w-3/4 bg-green-500"></div>
                        </div>
                    </div>

                    <div
                        class="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-blue-600">Total Documentos</p>
                                <p class="mt-2 text-3xl font-bold text-gray-900">57</p>
                            </div>
                            <div class="rounded-full bg-blue-100 p-3">
                                <Files class="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div class="absolute bottom-0 left-0 h-1 w-full bg-blue-100">
                            <div class="h-full w-full bg-blue-500"></div>
                        </div>
                    </div>
                </div>

                <!-- Content Grid -->
                <div class=" grid gap-6 lg:grid-cols-3">
                    <!-- Recent Documents -->
                    <div class="mt-10 lg:col-span-1">
                        <div class="rounded-xl bg-white p-6 shadow-sm">
                            <h2 class="text-lg font-semibold text-gray-900">Documentos Recientes</h2>
                            <div class="mt-6 space-y-4">
                                <div v-for="doc in recentDocuments" :key="doc.id"
                                    class="group flex items-center gap-4 rounded p-3 hover:bg-gray-50">
                                    <div class="rounded bg-blue-100 p-2">
                                        <FileText class="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900">{{ doc.name }}</p>
                                        <p class="text-sm text-gray-500">{{ doc.date }}</p>
                                    </div>
                                    <Button variant="ghost" class="opacity-0 group-hover:opacity-100 transition">
                                        <MoreVertical class="h-5 w-5 text-gray-600" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tasks -->
                    <div class="mt-10 lg:col-span-1">
                        <div class="rounded-xl bg-white p-6 shadow-sm">
                            <h2 class="text-lg font-semibold text-gray-900">Tareas Pendientes</h2>
                            <div class="mt-6 space-y-4">
                                <div v-for="task in tasks" :key="task.id"
                                    class="flex items-start gap-4 rounded-lg p-3 hover:bg-gray-50">
                                    <input type="checkbox" :id="task.id" v-model="task.completed"
                                        class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <div class="flex-1 min-w-0">
                                        <label :for="task.id" class="text-sm font-medium text-gray-900">
                                            {{ task.name }}
                                        </label>
                                        <p class="text-sm text-gray-500">{{ task.dueDate }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Calendar -->
                    <div class="mt-10 lg:col-span-1">
                        <div class="rounded-xl bg-white p-6 shadow-sm flex flex-col items-center">
                            <Calendar v-model="value" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">

import { Button } from '@/components/ui/button';
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
import { CheckCircle, Clock, Files, FileText, MoreVertical } from "lucide-vue-next";
import Calendar from "src/components/ui/calendar/Calendar.vue";
import { type Ref, ref } from 'vue';

const value = ref(today(getLocalTimeZone())) as Ref<DateValue>
const sidebarOpen = ref(true)
const currentDate = ref(new Date().getDate())

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

const recentDocuments = [
    { id: 1, name: 'Informe Mensual', date: 'Hace 1 día' },
    { id: 2, name: 'Acta de Reunión', date: 'Hace 2 días' },
    { id: 3, name: 'Propuesta de Proyecto', date: 'Hace 3 días' },
    { id: 4, name: 'Evaluación Final', date: 'Hace 4 días' },
]

const tasks = ref([
    { id: 't1', name: 'Revisar documentación', completed: false, dueDate: 'Hoy' },
    { id: 't2', name: 'Actualizar registros', completed: false, dueDate: 'Mañana' },
    { id: 't3', name: 'Preparar informe', completed: false, dueDate: 'En 2 días' },
])
</script>
