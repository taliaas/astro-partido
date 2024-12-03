<template>
    <div class="flex">
        <!-- Sidebar -->
        <div :class="[
            'fixed top-0 left-0 bg-blue-600 text-white h-full w-64 p-4',
            { hidden: !isOpen }
        ]">
            <div class="flex items-center justify-between">
                <FileBox class="w-8 h-8 text-blue-400" />
                <h1 class="text-lg font-bold">Nombre</h1>
                <Button variant="ghost" @click="toggleSidebar">
                    ☰
                </Button>
            </div>
            <nav :class="{ 'hidden': !sidebarOpen, 'block': sidebarOpen }" class="lg:block mt-8">
                <div class="px-4 space-y-2">
                    <a v-for="item in menuItems" :key="item.name" :href="item.href"
                        class="flex items-center space-x-2 p-2 rounded-lg hover:text-gray transition-colors"
                        :class="{ 'bg-blue-500': item.active, 'hover:bg-blue-500': !item.active, }">
                        <component :is="item.icon" class="w-5 h-5" />
                        <span>{{ item.name }}</span>
                    </a>
                </div>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 ml-64">
            <slot />
        </div>
    </div>
</template>


<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Activity, FileCheck, FileText, LayoutDashboard, Settings, FileBox } from 'lucide-vue-next';
import { ref } from "vue";

const isOpen = ref(true);

const sidebarOpen = ref(false)

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#', active: true },
    { name: 'Actas', icon: FileText, href: '#', active: false },
    { name: 'Cierre de Funcionamiento', icon: FileCheck, href: '#', active: false },
    { name: 'Estado de Funcionamiento', icon: Activity, href: 'estadofunc', active: false },
    { name: 'Configuraciones', icon: Settings, href: '#', active: false },
]
</script>
