<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-8 text-center transform transition-all duration-500 hover:scale-102">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Acta de Círculo Político</h1>
    </div>

    <div class="max-w-6xl mx-auto bg-white rounded shadow-xl overflow-hidden">
      <FirstPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import FirstPage from "src/components/Political/FirstPage.vue"
</script>