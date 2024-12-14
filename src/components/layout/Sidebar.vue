<template>
    <div class="w-64 border-l bg-white p-4 hidden xl:block">
        <div class="flex h-screen bg-gray-100">
            <!-- Sidebar for desktop -->
            <aside :class="[
                'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-blue-600 text-white lg:translate-x-0',
                { '-translate-x-full': !isOpen }
            ]">
                <div class="flex items-center justify-between p-4">
                    <a href="/" class="flex items-center space-x-2">
                        <HomeIcon class="w-8 h-8 text-blue-300" />
                        <span class="text-xl font-bold">Nombre</span>
                    </a>
                </div>
                <nav class="mt-8 px-4">
                    <ul class="space-y-2">
                        <li v-for="item in menuItems" :key="item.name">
                            <a :href="item.href" class="flex items-center space-x-2 p-2 rounded transition-colors"
                                :class="{
                                    'bg-blue-700 text-white': item.active,
                                    'hover:bg-blue-500 hover:text-white': !item.active,
                                }">
                                <component :is="item.icon" class="w-5 h-5" />
                                <span>{{ item.name }}</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- Main content -->
            <div class="flex-1 lg:ml-44">
                <!-- Top bar for mobile -->
                <header class="bg-white shadow-md p-4 flex items-center justify-between lg:hidden">
                    <Button variant="ghost" size="icon" @click="toggleSidebar">
                        <Menu class="h-6 w-6" />
                    </Button>
                    <h1 class="text-xl font-bold">Nombre</h1>
                    <div class="w-6">
                        <nav class="mt-8 px-4">
                            <ul class="space-y-2">
                                <li v-for="item in menuItems" :key="item.name">
                                    <a :href="item.href"
                                        class="flex items-center space-x-2 p-2 rounded-lg transition-colors" :class="{
                                            'bg-blue-700 text-white': item.active,
                                            'hover:bg-blue-500 hover:text-white': !item.active,
                                        }">
                                        <component :is="item.icon" class="w-5 h-5" />
                                        <span>{{ item.name }}</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div> <!-- Spacer for alignment -->
                </header>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button } from '@/components/ui/button'
import { Activity,HomeIcon, FileTextIcon, SettingsIcon, FileCheck, FileText, LayoutDashboard, Menu } from 'lucide-vue-next';

const isOpen = ref(false);
const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
};

const menuItems = [
    { name: 'Actas', icon: FileTextIcon, href: '/actas', active: false },
    { name: 'Funcionamiento', icon: SettingsIcon, href: '/estadofunc', active: false }
];
</script>
