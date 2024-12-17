<template>
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto space-y-8">
        <!-- General Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ acta.nucleo }}</h1>
          <p class="text-lg text-gray-700">Reporte de la reunión de estudio</p>
        </div>

        <div class="space-y-6">
        <!-- Attendance -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Asistencia</h2>
          <div class="space-y-2">
            <p><span class="font-medium">Total de militantes:</span> {{ acta.totalMilitantes }}</p>
            <p><span class="font-medium">Ausentes:</span> {{ acta.ausentes }}</p>
            <p><span class="font-medium">Porcentaje de asistencia:</span> {{ acta.porcentajeAsistencia }}%</p>
            <p><span class="font-medium">Causas:</span> {{ acta.causas }}</p>
            <p><span class="font-medium">Total de trabajadores presentes:</span> {{ acta.trabajadoresPresentes }}</p>
            <p><span class="font-medium">Por el organismo superior:</span> {{ acta.organismoSuperior }}</p>
          </div>
        </section>
        <!-- Main Topic --> 
         <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Tema evaluado en la reunión</h2>
          <p class="text-gray-700">{{ acta.temaEvaluado }}</p>
         </section>
  
        <!-- Key Points -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Principales planteamientos realizados</h2>
          <ul class="space-y-4">
            <li v-for="(punto, index) in acta.planteamientos" :key="index" class="text-gray-700">
              <span class="font-medium">{{ punto.persona }}:</span> {{ punto.comentario }}
            </li>
          </ul>
        </section>

        <!-- Evaluation -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Valoración de la reunión</h2>
          <p class="text-gray-700">{{ acta.valoracion }}</p>
        </section>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const acta = ref({
    nucleo: 'Núcleo: VRP Cujae',
    totalMilitantes: 9,
    ausentes: 2,
    porcentajeAsistencia: 81.8,
    causas: 'Jose Ameneiro – turno medico, Juan Cabezola - injustificado',
    trabajadoresPresentes: 0,
    organismoSuperior: 0,
    temaEvaluado: 'Artículo de Cubadebate "Consejo de Ministros abordó marcha de las acciones para corregir distorsiones y reimpulsar la economía"',
    planteamientos: [
      {
        persona: 'Julián',
        comentario: 'Hace una introducción al tema a tratar explicando los principales aspectos tratados en esta reunión señalando las medidas que ya se han tomado como la subida de los precios del combustible y la electricidad y los incrementos en los ingresos de los sectores de la Salud y la Educación.'
      },
      {
        persona: 'Nayma',
        comentario: 'plantea que hay un problema de comunicación a nivel del país. hay problemas que se deben valorar a nivel de las altas esferas de la sociedad. Antes teníamos a Fidel para explicar todos los problemas y estaba en la televisión aclarando problemas. Se informó de un programa semanal con el presidente y no se ha realizado y no sé ha explicado por qué no se ha hecho?'
      },
      {
        persona: 'Tatiana',
        comentario: 'lo que no se informa a la población provoca una brecha para que entre toda información falsa o en contra de la revolución.'
      },
      {
        persona: 'Nancy',
        comentario: 'todos conocemos el nivel de escasez el nivel económico del pueblo, aquí en la capital estamos bien, en las provincias no hay de nada!!! el que tiene dinero es el que vive, los vulnerables que tienen problemas a veces venden lo que les dan. Todas las cosas estén muy caras, no hay nada en las bodegas, la canasta básica no se está repartiendo. Hay que estar en el pueblo. Estamos acostumbrados a Fidel.'
      },
      {
        persona: 'Lázaro',
        comentario: 'dice que la realidad es que eso es el capitalismo, que el que no tiene dinero no vive. por eso el socialismo hay que defenderlo.'
      }
    ],
    valoracion: 'Consideramos que fue bueno el circulo con buena participación de la militancia'
  });
  </script>