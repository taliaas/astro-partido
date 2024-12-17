<template>
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ acta.titulo }}</h1>
          
          <div class="space-y-6">
            <!-- Información General -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">Información General</h2>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="(value, key) in acta.infoGeneral" :key="key" class="text-md">
                  <span class="font-medium text-gray-600">{{ key }}:</span> {{ value }}
                </div>
              </div>
            </section>
  
            <!-- Asistencia -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">Asistencia</h2>
              <p class="text-md text-gray-600 mb-2">
                Se encuentran presentes {{ acta.presentes }} miembros de un total de {{ acta.totalMiembros }} 
                posibles a asistir para un {{ acta.porcentajeAsistencia }}% de asistencia.
              </p>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nro.</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Presente</th>
                      <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Causa</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="miembro in acta.miembros" :key="miembro.nro" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ miembro.nro }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ miembro.nombre }}</td>
                      <td class="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span v-if="miembro.presente === 'X'" class="text-green-600">✓</span>
                        <span v-else-if="miembro.presente === 'Virtual'" class="text-blue-600">Virtual</span>
                        <span v-else>{{ miembro.presente || '-' }}</span>
                      </td>
                      <td class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">{{ miembro.causa }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
  
            <!-- Orden del día -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">Orden del día</h2>
              <ol class="list-decimal list-inside space-y-1">
                <li v-for="(item, index) in acta.ordenDelDia" :key="index" class="text-md text-gray-600">
                  {{ item }}
                </li>
              </ol>
            </section>
  
            <!-- Desarrollo de la reunión -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">Desarrollo de la reunión</h2>
              <div v-for="(punto, index) in acta.desarrolloReunion" :key="index" class="mb-4">
                <h3 class="text-lg font-medium text-gray-700 mb-2">{{ index + 1 }}. {{ punto.titulo }}</h3>
                <p class="text-md text-gray-600" v-html="punto.contenido"></p>
              </div>
            </section>
  
            <!-- Acuerdos -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">Acuerdos</h2>
              <ul class="space-y-2">
                <li v-for="acuerdo in acta.acuerdos" :key="acuerdo.numero" class="text-md text-gray-600">
                  <strong>Acuerdo {{ acuerdo.numero }}:</strong> {{ acuerdo.descripcion }}
                  <br>
                  <span class="text-gray-500">Responsable: {{ acuerdo.responsable }} | Fecha de cumplimiento: {{ acuerdo.fecha }}</span>
                </li>
              </ul>
            </section>
  
            <!-- Próximas fechas -->
            <section class="border-t border-gray-300">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">Próximas fechas</h2>
              <div class="grid grid-cols-2 gap-4 text-md text-gray-600">
                <div v-for="(fecha, evento) in acta.proximasFechas" :key="evento">
                  <span class="font-medium">{{ evento }}:</span> {{ fecha }}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const acta = ref({
    titulo: 'NÚCLEO 33 PCC CUJAE',
    infoGeneral: {
      'Acta No.': '4',
      'Tipo de Reunión': 'Ordinaria',
      'Fecha': '11 de abril del 2024',
      'Hora': '14:00',
      'Lugar': 'aula 323',
      'Presidida por': 'Fernando Vecino Guerra Secretario General del núcleo'
    },
    presentes: 27,
    totalMiembros: 29,
    porcentajeAsistencia: 93,
    miembros: [
      { nro: 1, nombre: 'Jeffrey Blanco González', presente: 'virtual', causa: '' },
      { nro: 2, nombre: 'Marta Beatriz Infante Abreu', presente: 'X', causa: '' },
      { nro: 2, nombre: 'Juan Diez Oropeza', presente: '', causa: 'Enfermedad' },
      // ... (add all other members)
    ],
    ordenDelDia: [
      'Chequeo de acuerdos.',
      'Orientaciones del Organismo Superior',
      'Análisis y discusión de la Asamblea ANEC',
      'Análisis y aprobación de traslado militantes',
      'Análisis del cumplimiento plan 1er trimestre y aprobación del plan 2do trimestre',
      'Salidas al extranjero'
    ],
    desarrolloReunion: [
      {
        titulo: 'Chequeo de acuerdos',
        contenido: 'Gerardo Lozada, Secretario: plantea que se tomaron 9 acuerdos en la reunión pasada, cumpliéndose 7 de salida al exterior. Siguen pendientes los acuerdos No. 2 y 3. ...'
      },
      // ... (add other points of the meeting)
    ],
    acuerdos: [
      { 
        numero: 17, 
        descripcion: 'Aprobada la salida de Sonia Fleitas Triana a Ecuador por 20 días entre el 10 y el 30 de abril para la etapa final como tutora de doctorado.',
        responsable: 'núcleo',
        fecha: '11-4-24'
      },
      // ... (add other agreements)
    ],
    proximasFechas: {
      'Fecha de la próxima reunión ordinaria': '9 de mayo 2024',
      'Fecha de la preparación de la próxima reunión ordinaria': '7 de mayo 2024',
      'Fecha del próximo círculo de estudios políticos': '9 de mayo 2024'
    }
  });
  </script>