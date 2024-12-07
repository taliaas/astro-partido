<template>
<!-- 7. Salidas al Extranjero -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">7. Salidas al Extranjero</h2>
        <div class="space-y-2">
          <label for="salidas" class="block text-sm font-medium text-gray-700">
            Salidas al Extranjero
          </label>
          <textarea
            id="salidas"
            v-model="formData.salidasExtranjero"
            rows="4"
            placeholder="Nombre - Motivo - Destino - Fechas - Estado"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
      </section>
  
      <!-- 8. Fechas Relevantes -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">8. Fechas Relevantes</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label for="proxima" class="block text-sm font-medium text-gray-700">
              Próxima reunión ordinaria
            </label>
            <input
              type="date"
              id="proxima"
              v-model="formData.proximaReunion"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div class="space-y-2">
            <label for="preparacion" class="block text-sm font-medium text-gray-700">
              Preparación próxima reunión
            </label>
            <input
              type="date"
              id="preparacion"
              v-model="formData.preparacionReunion"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div class="space-y-2">
            <label for="circulo" class="block text-sm font-medium text-gray-700">
              Próximo círculo de estudios
            </label>
            <input
              type="date"
              id="circulo"
              v-model="formData.circuloEstudios"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      </section>
  
      <!-- 9. Observaciones y Firmas -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">9. Observaciones y Firmas</h2>
        <div class="space-y-2">
          <label for="observaciones" class="block text-sm font-medium text-gray-700">
            Observaciones generales
          </label>
          <textarea
            id="observaciones"
            v-model="formData.observaciones"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
        <div class="space-y-2">
          <label for="firma" class="block text-sm font-medium text-gray-700">
            Nombre del secretario para la firma<span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firma"
            v-model="formData.firmaSecretario"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </section>
</template>