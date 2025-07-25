<template>
  <div class="border rounded-lg p-4 shadow-md bg-white flex flex-col">
    <h3 class="font-semibold text-lg text-gray-700 mb-3">{{ label }}</h3>

    <!-- Gráfico fijo -->
    <canvas ref="chartRef" class="mb-4"></canvas>

    <!-- Resumen minimizable -->
    <div>
      <button
        @click="toggleSummary"
        class="text-orange-600 hover:text-orange-800 focus:outline-none mb-2 flex items-center space-x-1"
        :aria-expanded="!summaryMinimized"
        :aria-controls="summaryId"
      >
        <span>{{ summaryMinimized ? 'Mostrar resumen' : 'Ocultar resumen' }}</span>
        <i :class="summaryMinimized ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"></i>
      </button>

      <transition name="fade">
        <div
          v-show="!summaryMinimized"
          :id="summaryId"
          class="bg-orange-50 border border-orange-300 rounded-md p-3 space-y-3 text-gray-700 text-sm"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Datos generales -->
            <div>
              <h4 class="font-semibold text-orange-600 mb-1">Datos generales</h4>
              <p><strong>Último dato:</strong> {{ latestData?.y ?? 'N/A' }} {{ unitLabel }}</p>
              <p><strong>Máximo (10 min):</strong> {{ formatNumber(maxLast10Min) }} {{ unitLabel }}</p>
              <p><strong>Mínimo (10 min):</strong> {{ formatNumber(minLast10Min) }} {{ unitLabel }}</p>
            </div>

            <!-- Promedios -->
            <div>
              <h4 class="font-semibold text-orange-600 mb-1">Promedios recientes</h4>
              <p><strong>Último minuto:</strong> {{ formatNumber(averageLast1Min) }} {{ unitLabel }}</p>
              <p><strong>Últimos 5 minutos:</strong> {{ formatNumber(averageLast5Min) }} {{ unitLabel }}</p>
              <p><strong>Últimos 10 minutos:</strong> {{ formatNumber(averageLast10Min) }} {{ unitLabel }}</p>
            </div>
          </div>

          <!-- Tendencia -->
          <div>
            <h4 class="font-semibold text-orange-600 mb-1">Tendencia (últimos 10 min)</h4>
            <p :class="trendClass" class="font-semibold text-lg">{{ trendMessage }}</p>
          </div>

          <!-- Evaluación simple -->
          <div>
            <h4 class="font-semibold text-orange-600 mb-1">Evaluación rápida</h4>
            <ul class="list-disc list-inside space-y-1">
              <li v-if="trendMessage === 'Incremento'">📈 Valores en aumento, posible subida de {{ label.toLowerCase() }}.</li>
              <li v-if="trendMessage === 'Decremento'">📉 Valores en descenso, posible bajada de {{ label.toLowerCase() }}.</li>
              <li v-if="trendMessage === 'Estable'">⚖️ Valores estables, sin cambios significativos.</li>
              <li v-if="trendMessage === 'Datos insuficientes'">❓ No hay datos suficientes para análisis.</li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '../supabase/client'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

const props = defineProps({
  table: { type: String, required: true },
  label: { type: String, required: true },
  color: { type: String, required: true }
})

const chartRef = ref(null)
let chartInstance = null

const summaryMinimized = ref(false)
const dataPoints = ref([])

const unitLabel = computed(() => {
  if (props.table === 'temperature_recording') return '°C'
  if (props.table === 'heart_rate_recording') return 'bpm'
  return ''
})

function toggleSummary() {
  summaryMinimized.value = !summaryMinimized.value
}

async function fetchData() {
  try {
    const { data, error } = await supabase
      .from(props.table)
      .select('datetime, data')
      .order('datetime', { ascending: true })
      .limit(200)

    if (error) throw error

    dataPoints.value = data.map(item => ({
      x: new Date(item.datetime),
      y: item.data
    }))

    updateChart()
  } catch (e) {
    console.error('Error fetching data:', e.message)
  }
}

function updateChart() {
  if (!chartInstance && chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: 'line',
      data: {
        datasets: [{
          label: props.label,
          data: dataPoints.value,
          borderColor: props.color,
          backgroundColor: props.color,
          fill: false,
          tension: 0.3,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        interaction: { mode: 'nearest', intersect: false },
        scales: {
          x: {
            type: 'time',
            time: { unit: 'minute', tooltipFormat: 'PPpp' },
            title: { display: true, text: 'Fecha y hora' }
          },
          y: {
            beginAtZero: false,
            title: { display: true, text: props.label }
          }
        },
        plugins: {
          legend: { display: true, labels: { color: '#555' } },
          tooltip: { mode: 'index', intersect: false }
        }
      }
    })
  } else if (chartInstance) {
    chartInstance.data.datasets[0].data = dataPoints.value
    chartInstance.update()
  }
}

function filterLastMinutes(minutes) {
  const cutoff = Date.now() - minutes * 60 * 1000
  return dataPoints.value.filter(p => p.x.getTime() >= cutoff)
}

function average(data) {
  if (data.length === 0) return null
  return data.reduce((acc, cur) => acc + cur.y, 0) / data.length
}

function max(data) {
  if (data.length === 0) return null
  return Math.max(...data.map(p => p.y))
}

function min(data) {
  if (data.length === 0) return null
  return Math.min(...data.map(p => p.y))
}

const latestData = computed(() => {
  if (dataPoints.value.length === 0) return null
  return dataPoints.value[dataPoints.value.length - 1]
})

const averageLast1Min = computed(() => average(filterLastMinutes(1)))
const averageLast5Min = computed(() => average(filterLastMinutes(5)))
const averageLast10Min = computed(() => average(filterLastMinutes(10)))

const maxLast10Min = computed(() => max(filterLastMinutes(10)))
const minLast10Min = computed(() => min(filterLastMinutes(10)))

const trendMessage = computed(() => {
  if (!averageLast10Min.value || !averageLast1Min.value) return 'Datos insuficientes'
  const diff = averageLast1Min.value - averageLast10Min.value
  const threshold = 0.1
  if (diff > threshold) return 'Incremento'
  if (diff < -threshold) return 'Decremento'
  return 'Estable'
})

const trendClass = computed(() => {
  switch (trendMessage.value) {
    case 'Incremento': return 'text-green-600 font-semibold'
    case 'Decremento': return 'text-red-600 font-semibold'
    default: return 'text-gray-600 font-semibold'
  }
})

let intervalId = null
onMounted(() => {
  fetchData()
  intervalId = setInterval(fetchData, 5000)
})
onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

function formatNumber(num) {
  if (num === null || isNaN(num)) return 'N/A'
  return num.toFixed(2)
}

const summaryId = `summary-${props.table}`
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 260px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Texto más atractivo para datos */
p, li {
  line-height: 1.4;
  font-weight: 500;
}

h4 {
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #f97316; /* naranja */
  padding-bottom: 0.25rem;
}

ul li {
  margin-left: 1rem;
}
</style>
