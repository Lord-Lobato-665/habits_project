<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-pink-100 font-sans flex flex-col">
    <ProfileMenu />
    <!-- Header -->
    <Menubar :model="items" class="bg-white shadow-md px-4">
      <template #start>
        <div class="text-orange-600 font-bold text-xl tracking-wide">FeelingPartner</div>
      </template>
    </Menubar>

    <!-- Contenido -->
    <div class="scaled-content">
      <main class="p-6 space-y-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-orange-600">Estadísticas en tiempo real</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="enlarged-chart">
            <StatChart table="temperature_recording" label="Temperatura (°C)" color="#f97316" />
          </div>
          <div class="enlarged-chart">
            <StatChart table="heart_rate_recording" label="Ritmo cardiaco (bpm)" color="#0ea5e9" />
          </div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-white shadow-inner py-6 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-center items-center gap-4">
      <span>Hecho con ❤️ por FeelingPartner. Monitoreando lo invisible.</span>
      <div class="flex space-x-6 text-orange-400">
        <a href="https://twitter.com/feelingpartner" target="_blank" aria-label="Twitter" class="hover:text-orange-600 transition">
          <i class="pi pi-twitter text-xl"></i>
        </a>
        <a href="https://facebook.com/feelingpartner" target="_blank" aria-label="Facebook" class="hover:text-orange-600 transition">
          <i class="pi pi-facebook text-xl"></i>
        </a>
        <a href="https://instagram.com/feelingpartner" target="_blank" aria-label="Instagram" class="hover:text-orange-600 transition">
          <i class="pi pi-instagram text-xl"></i>
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
import StatChart from '../components/StatsChart.vue'
import ProfileMenu from "../components/ProfileMenu.vue";

const items = ref([
  { label: 'Inicio', icon: 'pi pi-home', command: () => window.location.href = '/' },
  { label: 'Hábitos', icon: 'pi pi-check-square', command: () => window.location.href = '/habits' },
  { label: 'Estadísticas', icon: 'pi pi-chart-bar', command: () => window.location.href = '/stats' }
])
</script>

<style scoped>
.scaled-content {
  transform: scale(0.8);
  transform-origin: top center;
}

.enlarged-chart {
  transform: scale(1);
  transform-origin: center;
}
</style>
