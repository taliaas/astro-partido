<template>
    <header class="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">

                <!-- Welcome Message -->
                <div class="flex-1 text-center">
                    <h1 class="text-lg font-semibold text-gray-900">
                        PCC CUJAE
                    </h1>
                </div>

                <!-- Search Bar -->
                <div class="flex-1 max-w-md">
                    <div class="relative">
                        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="search" placeholder="Buscar documentos..."
                            class="h-10 w-full rounded-full border-0 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>


                <!-- Right Actions -->
                <div class="flex-1 flex items-center justify-end gap-2">
                    <!-- Notifications -->
                    <Button variant="ghost"
                        class="relative p-2 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full">
                        <span class="sr-only">Ver notificaciones</span>
                        <Bell class="h-5 w-5" />
                        <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                    </Button>

                    <!-- Divider -->
                    <div class="h-6 w-px bg-gray-200"></div>

                    <!-- Language Selector -->
                    <div class="relative">
                        <Button variant="ghost"
                            class="group inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <Globe class="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                            <span class="ml-1.5">ES</span>
                            <ChevronDown class="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                        </Button>
                    </div>

                    <!-- Profile -->
                    <Button variant="ghost"
                        class="group inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <div class="relative h-8 w-8 rounded-full bg-gray-100 mr-2">
                            <User
                                class="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                        <span>Perfil</span>
                    </Button>

                    <!-- Logout -->
                    <Button variant="ghost"
                        class="group inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <LogOut class="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                        <span class="ml-1.5">Cerrar sesión</span>
                    </Button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu (optional) -->
        <div class="sm:hidden border-t border-gray-200">
            <div class="flex items-center justify-around py-2">
                <Button class="flex flex-col items-center p-2 text-gray-500">
                    <Bell class="h-5 w-5" />
                    <span class="text-xs mt-1">Notificaciones</span>
                </Button>
                <Button class="flex flex-col items-center p-2 text-gray-500">
                    <Globe class="h-5 w-5" />
                    <span class="text-xs mt-1">Idioma</span>
                </Button>
                <Button class="flex flex-col items-center p-2 text-gray-500">
                    <User class="h-5 w-5" />
                    <span class="text-xs mt-1">Perfil</span>
                </Button>
                <Button class="flex flex-col items-center p-2 text-gray-500">
                    <LogOut class="h-5 w-5" />
                    <span class="text-xs mt-1">Salir</span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { Bell, Search, Globe, User, LogOut, ChevronDown } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
</script>

<style scoped>
/* Add any custom styles here */
</style>