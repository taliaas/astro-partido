<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import OrdinaryService from '@/services/OrdinaryService';
  import { navigate } from 'astro:transitions/client';

  const props = defineProps<{
    id: string;
  }>();

  const emit = defineEmits(['close']);
  const acta = ref(null);
  const cargando = ref(true); // Estado de carga añadido
  const ordinaryService = new OrdinaryService();

  const cargarActa = async () => {
    try {
      cargando.value = true;
      acta.value = await ordinaryService.getMinute(props.id);
    } catch (error) {
      console.error('Error al cargar el acta:', error);
    } finally {
      cargando.value = false;
    }
  };

  const guardarCambios = async () => {
    if (acta.value) {
      try {
        await ordinaryService.updateMinute(props.id, acta.value);
        navigate(`/minutes/?type=all`);
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
      }
    }
  };

  const cancelarEdicion = () => {
    emit('close');
    navigate(`/minutes/?type=all`);
  };

  onMounted(() => {
    cargarActa();
  });
</script>

<template>
   <div class="fixed inset-0 bg-gray-100 flex items-center justify-center">
    <div class="min-h-screen h-full overflow-y-auto px-8 py-8">
      <div class="max-w-[95%] mx-auto" h-full>
        <div v-if="cargando" class="text-center py-8">
          <div class="text-lg text-gray-600">Cargando información del acta...</div>
        </div>

        <div v-else-if="acta" class="bg-white rounded-xl shadow-md min-h-[95vh]">
          <div class="p-12">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Editar Acta {{ acta?.id }}</h1>
            
             <form @submit.prevent="guardarCambios" class="space-y-8">
               <!-- Información General -->
               <section class="bg-gray-50 p-6 rounded-lg">
                 <h2 class="text-xl font-semibold text-gray-800 mb-4">Información General</h2>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label class="block text-sm font-medium text-gray-700">Núcleo</label>
                      <input v-model="acta.core.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Secretario General</label>
                      <input v-model="acta.secretarioGeneral" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Fecha</label>
                      <input type="date" v-model="acta.fecha" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Lugar</label>
                      <input v-model="acta.lugar" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Hora</label>
                      <input type="time" v-model="acta.hora" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                   </div>
                 </div>
               </section>

               <!-- Asistencia -->
               <section class="bg-gray-50 p-6 rounded-lg">
                  <h2 class="text-xl font-semibold text-gray-800 mb-4">Asistencia</h2>
                  <div class="overflow-x-auto">
                   <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nro.</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Presente</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Causa</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="miembro in acta.militante" :key="miembro.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <input v-model="miembro.id" class="block w-full rounded-md border-gray-300 shadow-sm"/>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <input v-model="miembro.firstname" class="block w-full rounded-md border-gray-300 shadow-sm"/>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <select v-model="miembro.presente" class="block w-full rounded-md border-gray-300 shadow-sm">
                              <option value="X">Presente</option>
                              <option value="Virtual">Virtual</option>
                              <option value="">Ausente</option>
                            </select>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                           <input v-model="miembro.causa" class="block w-full rounded-md border-gray-300 shadow-sm"/>
                          </td>
                        </tr>
                      </tbody>
                   </table>
                  </div>
                </section>

                <!-- Orden del día -->
               <section class="bg-gray-50 p-6 rounded-lg">
                 <h2 class="text-xl font-semibold text-gray-800 mb-4">Orden del día</h2>
                 <div class="space-y-4">
                    <div v-for="(item, index) in acta.order" :key="index" class="flex gap-4">
                      <input v-model="acta.order[index]" class="block w-full rounded-md border-gray-300 shadow-sm"/>
                      <button type="button" @click="acta.order.splice(index, 1)" class="text-red-600">
                        Eliminar
                      </button>
                    </div>
                    <button type="button" @click="acta.order.push('')" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md">
                      Agregar punto
                    </button>
                  </div>
                </section>

                <!-- Desarrollo de la reunión -->
                <section class="bg-gray-50 p-6 rounded-lg">
                  <h2 class="text-xl font-semibold text-gray-800 mb-4">Desarrollo de la reunión</h2>

                  <!-- Orientaciones -->
                  <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-800 mb-4">Orientaciones del Organismo Superior</h3>
                    <textarea v-model="acta.orientaciones" rows="4" class="block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                  </div>

                  <!-- Análisis -->
                  <div class="mb-6">
                    <h3 css="text-lg font-medium text-gray-800 mb-4">Análisis</h3>
                    <textarea v-model="acta.analisis" rows="4" class="block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                  </div>
               </section>

                <!-- Acuerdos -->
                <section class="bg-gray-50 p-6 rounded-lg">
                  <h2 class="text-xl font-semibold text-gray-800 mb-4">Acuerdos</h2>
                  <div class="space-y-4">
                    <div v-for="(acuerdo, index) in acta.agreements" :key="index" class="space-y-2">
                      <textarea v-model="acta.agreements[index]" rows="2" class="block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                      <div class="grid grid-cols-2 gap-4">
                        <input v-model="acuerdo.responsable" placeholder="Responsable" class="block w-full rounded-md border-gray-300 shadow-sm"/>
                        <input type="date" v-model="acuerdo.fecha" class="block w-full rounded-md border-gray-300 shadow-sm"/>
                      </div>
                     </div>
                  </div>
               </section>

                <!-- Salidas al extranjero -->
                <section class="bg-gray-50 p-6 rounded-lg">
                  <h2 class="text-xl font-semibold text-gray-800 mb-4">Salidas al extranjero</h2>
                  <div class="space-y-4">
                    <div v-for="(salida, index) in acta.extranjero" :key="index" class="grid grid-cols-3 gap-4">
                      <input v-model="salida.pais" placeholder="País" class="block w-full rounded-md border-gray-300 shadow-sm"/>
                      <input type="date" v-model="salida.fecha" class="block w-full rounded-md border-gray-300 shadow-sm"/>
                      <input v-model="salida.acuerdo" placeholder="Acuerdo" class="block w-full rounded-md border-gray-300 shadow-sm"/>
                    </div>
                  </div>
                </section>

                <!-- Próximas fechas -->
                <section class="bg-gray-50 p-6 rounded-lg">
                  <h2 class="text-xl font-semibold text-gray-800 mb-4">Próximas fechas</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Próxima Reunión Ordinaria</label>
                      <input type="date" v-model="acta.fechaProx" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Preparación Próxima Reunión</label>
                      <input type="date" v-model="acta.fechaPrep" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Próximo Círculo de Estudios</label>
                      <input type="date" v-model="acta.fechaCP" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                    </div>
                  </div>
                </section>

               <!-- Botones de acción -->
               <div class="flex justify-end space-x-4 pt-6">
                  <button 
                    type="button"
                    @click="cancelarEdicion"
                    class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <div class="text-lg text-red-600">No se pudo cargar la información del acta</div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
.contenedor-editar-acta {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.titulo {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.grupo-formulario {
  margin-bottom: 1.5rem;
}

.grupo-formulario label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
}

.entrada-formulario, .area-texto {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.area-texto {
  resize: vertical;
}

.grupo-botones {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.boton-guardar, .boton-cancelar {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.boton-guardar {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.boton-guardar:hover {
  background-color: #45a049;
}

.boton-cancelar {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  color: #666;
}

.boton-cancelar:hover {
  background-color: #e9ecef;
}

.cargando, .mensaje-error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.mensaje-error {
  color: #dc3545;
}
/* Estilos para el scroll */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}
</style>