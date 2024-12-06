<template>
    <div class="min-h-screen bg-white p-8">
        <div class="mx-auto bg-white">
            <div class="p-3">
                <form @submit.prevent="actualizarGrafico" class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Indicadores</label>
                        <select v-model="indicadoresSeleccionados" multiple
                            class="w-full p-2 border border-gray-300 rounded">
                            <option v-for="indicador in indicadores" :key="indicador" :value="indicador">
                                {{ indicador }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Núcleo</label>
                        <select v-model="nucleoSeleccionado" class="w-full p-2 border border-gray-300 rounded">
                            <option v-for="nucleo in nucleos" :key="nucleo" :value="nucleo">
                                {{ nucleo }}
                            </option>
                        </select>
                    </div>
                    <div class="w-1/2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
                        <select v-model="periodoSeleccionado" class="w-full p-2 border border-gray-300 rounded">
                            <option value="semestre">Semestre 1</option>
                            <option value="semestral">Semestre 2</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>
                </form>

                <div class="bg-white p-4 rounded-lg shadow">
                    <canvas ref="chartCanvas"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

// Datos de ejemplo (reemplazar con datos reales)
const indicadores = ['Indicador A', 'Indicador B', 'Indicador C', 'Indicador D'];
const nucleos = ['Núcleo 1', 'Núcleo 2', 'Núcleo 3'];

const indicadoresSeleccionados = ref([]);
const periodoSeleccionado = ref('semestre');
const nucleoSeleccionado = ref('Núcleo 1');
const chartCanvas = ref(null);
let chart = null;

const colores = {
    'Indicador A': 'rgb(255, 99, 132)',
    'Indicador B': 'rgb(54, 162, 235)',
    'Indicador C': 'rgb(75, 192, 192)',
    'Indicador D': 'rgb(255, 205, 86)'
};

const datosEjemplo = {
    semestre: {
        labels: ['Enero', 'Febrero', 'MArzo', 'Abril', 'Mayo', 'Junio'],
        datasets: {
            'Indicador A': [65, 59, 45, 89, 98, 43, 78],
            'Indicador B': [28, 48, 28, 48, 40, 19],
            'Indicador C': [40, 19, 28, 48, 40, 19],
            'Indicador D': [96, 27, 28, 48, 40, 19]
        }
    },
    semestral: {
        labels: ['Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: {
            'Indicador A': [65, 59],
            'Indicador B': [28, 48],
            'Indicador C': [40, 19],
            'Indicador D': [96, 27]
        }
    },
    anual: {
        labels: ['2020', '2021', '2022', '2023'],
        datasets: {
            'Indicador A': [65, 59, 80, 81],
            'Indicador B': [28, 48, 40, 19],
            'Indicador C': [40, 19, 86, 27],
            'Indicador D': [96, 27, 90, 50]
        }
    }
};

const actualizarGrafico = () => {
    if (chart) {
        chart.destroy();
    }

    const ctx = chartCanvas.value.getContext('2d');
    const datos = datosEjemplo[periodoSeleccionado.value];

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.labels,
            datasets: indicadoresSeleccionados.value.map(indicador => ({
                label: indicador,
                data: datos.datasets[indicador],
                borderColor: colores[indicador],
                backgroundColor: colores[indicador] + '40',
                tension: 0.1
            }))
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Indicadores para ${nucleoSeleccionado.value || 'Todos los Núcleos'}`
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

onMounted(() => {
    actualizarGrafico();
});

watch([indicadoresSeleccionados, periodoSeleccionado, nucleoSeleccionado], () => {
    actualizarGrafico();
});
</script>