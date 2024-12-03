<template>
    <div :class="`bg-${color}-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`">
        <div class="flex items-center justify-between">
            <h3 :class="`text-${color}-800 font-semibold`">{{ title }}</h3>
            <component :is="icon" :class="`w-8 h-8 text-${color}-500`" />
        </div>
        <p :class="`text-3xl font-bold text-${color}-900 mt-2`">{{ value }}</p>
    </div>
</template>

<script setup>
import { FileWarning, FileCheck, Files } from 'lucide-vue-next'

const props = defineProps({
    title: String,
    value: String,
    color: String,
    icon: String
})

const iconComponents = {
    FileWarning,
    FileCheck,
    Files
}

const icon = iconComponents[props.icon]
</script>