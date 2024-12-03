<template>
    <div class="flex">
        <!-- Sidebar -->
        <div :class="[
            'fixed top-0 left-0 bg-gray-800 text-white h-full w-64 p-4',
            { hidden: !isOpen }
        ]">
            <div class="flex items-center justify-between">
                <h1 class="text-lg font-bold">Logo</h1>
                <Button variant="ghost" @click="toggleSidebar">
                    ☰
                </Button>
            </div>
            <nav class="mt-4">
                <ul>
                    <li v-for="item in menuItems" :key="item.text" class="my-2">
                        <a :href="item.link"
                            class="block px-4 py-2 rounded hover:bg-gray-200 hover:text-black transition-colors duration-300">
                            {{ item.text }}
                        </a>
                    </li>
                </ul>
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
import { ref } from "vue";

const isOpen = ref(true);

// Lista de elementos del menú
const menuItems = ref([
    { text: "Dashboard", link: "dashboard" },
    { text: "Actas", link: "actas" },
    { text: "Cierre del funcionamiento", link: "cierrefunc" },
    { text: "Estado del funcionamiento", link: "estadofunc" },
]);

const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
};
</script>
