<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header with subtle animation -->
            <div class="mb-8 text-center transform transition-all duration-500 hover:scale-102">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Estado del Funcionamiento PCC CUJAE</h1>
                <p class="text-xl font-semibold text-gray-600">Cómite UJC CUJAE</p>
            </div>

            <!-- Form with animated transitions -->
            <form @submit.prevent="actualizarGrafico"
                class="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white rounded shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl">
                <!-- Indicadores Select -->
                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">
                        Indicadores
                    </label>
                    <div class="relative">
                        <select v-model="indicadoresSeleccionados" multiple
                            class="w-full p-3 border border-gray-200 rounded shadow-sm transition-all duration-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option v-for="indicador in indicadores" :key="indicador" :value="indicador" class="py-2">
                                {{ indicador }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Núcleo Select -->
                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">
                        Núcleo
                    </label>
                    <select v-model="nucleoSeleccionado"
                        class="w-full p-3 border border-gray-200 rounded shadow-sm transition-all duration-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option v-for="nucleo in nucleos" :key="nucleo" :value="nucleo">
                            {{ nucleo }}
                        </option>
                    </select>
                </div>

                <!-- Período Select -->
                <div class="space-y-2 w-1/2">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">
                        Período
                    </label>
                    <select v-model="periodoSeleccionado"
                        class="w-full p-3 border border-gray-200 rounded shadow-sm transition-all duration-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="semestre">Semestre 1</option>
                        <option value="semestral">Semestre 2</option>
                        <option value="anual">Anual</option>
                    </select>
                </div>

                <div class="flex items-center ">
                    <Button class="rounded border border-gray-200 hover:bg-gray-50 ">
                        <DownloadIcon class="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </form>

            <!-- Chart Container with animation -->
            <transition enter-active-class="transition-all duration-700 ease-out"
                enter-from-class="opacity-0 transform translate-y-4"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform translate-y-4">
                <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-500 hover:shadow-xl">
                    <canvas ref="chartCanvas" class="transition-all duration-500"></canvas>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import Button from './ui/button/Button.vue';
import { DownloadIcon } from 'lucide-vue-next';

// Datos de ejemplo (reemplazar con datos reales)
const indicadores = ['Indicador A', 'Indicador B', 'Indicador C', 'Indicador D'];
const nucleos = ['Núcleo 1', 'Núcleo 2', 'Núcleo 3'];

const indicadoresSeleccionados = ref([]);
const periodoSeleccionado = ref('semestre');
const nucleoSeleccionado = ref('Núcleo 1');
const chartCanvas = ref(null);
let chart = null;

// Colores modernos con gradientes
const colores = {
    'Indicador A': 'rgb(255, 99, 132)',
    'Indicador B': 'rgb(54, 162, 235)',
    'Indicador C': 'rgb(75, 192, 192)',
    'Indicador D': 'rgb(255, 205, 86)'
};

const datosEjemplo = {
    semestre: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
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

    // Crear gradientes para cada línea
    const gradients = {};
    indicadoresSeleccionados.value.forEach(indicador => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        const color = colores[indicador];
        gradient.addColorStop(0, color.replace(')', ', 0.4)'));
        gradient.addColorStop(1, color.replace(')', ', 0.1)'));
        gradients[indicador] = gradient;
    });

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.labels,
            datasets: indicadoresSeleccionados.value.map(indicador => ({
                label: indicador,
                data: datos.datasets[indicador],
                borderColor: colores[indicador],
                backgroundColor: gradients[indicador],
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: colores[indicador],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: colores[indicador],
                pointHoverBorderWidth: 3,
            }))
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                title: {
                    display: true,
                    text: `Indicadores para ${nucleoSeleccionado.value || 'Todos los Núcleos'}`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
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

<style>
.scale-102 {
    transform: scale(1.02);
}

/* Smooth transitions for all interactive elements */
select,
button {
    transition: all 0.3s ease;
}

/* Custom scrollbar for the multiple select */
select[multiple] {
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

select[multiple]::-webkit-scrollbar {
    width: 6px;
}

select[multiple]::-webkit-scrollbar-track {
    background: transparent;
}

select[multiple]::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
}
</style>