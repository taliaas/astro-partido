<template>
    <div class="min-h-screen bg-gray-50">
    <form @submit.prevent="submitForm" class="space-y-8 max-w-7xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-8 text-center">Reunión Ordinaria</h1>
  
      <!-- 1. Información General -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">1. Información General</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label for="fecha" class="block text-sm font-medium text-gray-700">
              Fecha de la reunión<span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="fecha"
              v-model="formData.fecha"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div class="space-y-2">
            <label for="hora" class="block text-sm font-medium text-gray-700">
              Hora<span class="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="hora"
              v-model="formData.hora"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div class="space-y-2">
            <label for="lugar" class="block text-sm font-medium text-gray-700">
              Lugar<span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lugar"
              v-model="formData.lugar"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div class="space-y-2">
            <label for="area" class="block text-sm font-medium text-gray-700">
              Área<span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="area"
              v-model="formData.area"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      </section>
  
      <!-- 2. Presidencia -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">2. Presidencia</h2>
        <div class="space-y-2">
          <label for="secretario" class="block text-sm font-medium text-gray-700">
            Nombre del Secretario General<span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="secretario"
            v-model="formData.secretario"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </section>
  
      <!-- 3. Asistencia -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">3. Asistencia</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label for="total" class="block text-sm font-medium text-gray-700">
              Número total de miembros<span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="total"
              v-model="formData.totalMiembros"
              required
              @input="calcularPorcentaje"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div class="space-y-2">
            <label for="asistentes" class="block text-sm font-medium text-gray-700">
              Número de asistentes<span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="asistentes"
              v-model="formData.asistentes"
              required
              @input="calcularPorcentaje"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div class="space-y-2">
            <label for="porcentaje" class="block text-sm font-medium text-gray-700">
              Porcentaje de asistencia
            </label>
            <input
              type="text"
              id="porcentaje"
              v-model="formData.porcentajeAsistencia"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
            />
          </div>
        </div>
      </section>
  
      <!-- 4. Relación de Asistencia -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">4. Relación de Asistencia</h2>
        <div class="space-y-2">
          <label for="asistencia" class="block text-sm font-medium text-gray-700">
            Nombre Completo y Estado<span class="text-red-500">*</span>
          </label>
          <textarea
            id="asistencia"
            v-model="formData.relacionAsistencia"
            rows="4"
            required
            placeholder="Nombre Completo - Estado (Presente/Virtual/Ausente)"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
      </section>
  
      <!-- 5. Orden del Día -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">5. Orden del Día</h2>
        <div class="space-y-2">
          <label for="orden" class="block text-sm font-medium text-gray-700">
            Temas tratados<span class="text-red-500">*</span>
          </label>
          <textarea
            id="orden"
            v-model="formData.ordenDelDia"
            rows="4"
            required
            placeholder="Lista de temas tratados en la reunión"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
      </section>
  
      <!-- 6. Acuerdos -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">6. Acuerdos</h2>
        <div class="space-y-2">
          <label for="acuerdos" class="block text-sm font-medium text-gray-700">
            Acuerdos<span class="text-red-500">*</span>
          </label>
          <textarea
            id="acuerdos"
            v-model="formData.acuerdos"
            rows="4"
            required
            placeholder="Número - Descripción - Responsable - Fecha de cumplimiento"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
      </section>
  
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
  
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Enviar Formulario
      </button>
    </form>
</div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const formData = ref({
    fecha: '',
    hora: '',
    lugar: '',
    area: '',
    secretario: '',
    totalMiembros: 0,
    asistentes: 0,
    porcentajeAsistencia: '0%',
    relacionAsistencia: '',
    ordenDelDia: '',
    acuerdos: '',
    salidasExtranjero: '',
    proximaReunion: '',
    preparacionReunion: '',
    circuloEstudios: '',
    observaciones: '',
    firmaSecretario: ''
  })
  
  const calcularPorcentaje = () => {
    if (formData.value.totalMiembros > 0 && formData.value.asistentes > 0) {
      const porcentaje = (formData.value.asistentes / formData.value.totalMiembros) * 100
      formData.value.porcentajeAsistencia = porcentaje.toFixed(2) + '%'
    } else {
      formData.value.porcentajeAsistencia = '0%'
    }
  }
  
  const submitForm = () => {
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData.value)
    // You can add your form submission logic here
  }
  </script>