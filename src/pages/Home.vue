<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-pink-100 font-sans flex flex-col">
    <!-- Menú superior con PrimeVue -->
    <Menubar :model="items" class="bg-white shadow-md px-4" >
      <template #start>
        <div class="text-orange-600 font-bold text-xl tracking-wide">FeelingPartner</div>
      </template>
    </Menubar>

    <!-- Introducción -->
    <section class="text-center px-6 md:px-20 py-12 flex-grow">
      <h2 class="text-5xl md:text-6xl font-extrabold text-orange-600 drop-shadow-md mb-4 animate-fadeIn">
        FeelingPartner
      </h2>
      <p class="mt-4 text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed tracking-wide animate-fadeIn delay-200">
        Cuantifica y comprende tus emociones con una pulsera inteligente que mide tu ritmo cardíaco y temperatura. Gestiona hábitos y accede a estadísticas emocionales en tiempo real.
      </p>
      
      <!-- Botones principales -->
      <div class="mt-8 flex justify-center gap-4 animate-fadeIn delay-300">
        <Button
          label="Explora tus emociones"
          icon="pi pi-heart"
          class="bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white font-bold shadow-lg transition-transform transform hover:scale-105"
          @click="router.push('/habits')"
        />
        <Button
          label="Ver estadísticas"
          icon="pi pi-chart-bar"
          class="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white font-bold shadow-lg transition-transform transform hover:scale-105"
          @click="router.push('/stats')"
        />
      </div>
    </section>

    <!-- Tarjetas emocionales -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20 pb-20" aria-label="Consejos emocionales">
      <CardEmotion
        emotion="Alegría"
        icon="pi pi-sun"
        color="bg-yellow-100"
        textColor="text-yellow-800"
        :tips="alegriaTips"
      />
      <CardEmotion
        emotion="Tristeza"
        icon="pi pi-cloud"
        color="bg-blue-100"
        textColor="text-blue-800"
        :tips="tristezaTips"
      />
      <CardEmotion
        emotion="Enojo"
        icon="pi pi-bolt"
        color="bg-red-100"
        textColor="text-red-800"
        :tips="enojoTips"
      />
    </section>

    <!-- Sección sensores -->
    <section class="px-6 md:px-20 pb-20 max-w-5xl mx-auto" aria-label="Cuantificación por sensores y gráficas">
      <h3 class="text-3xl font-bold text-orange-600 mb-6 text-center drop-shadow-md">¿Cómo cuantificamos tus emociones?</h3>
      <Accordion multiple>
        <AccordionTab header="Medición del Ritmo Cardíaco ❤️‍🔥" headerClass="text-red-600 font-semibold">
          <p class="text-gray-700 leading-relaxed mb-3">
            Utilizamos sensores ópticos PPG (fotopletismografía) que detectan cambios en el volumen de sangre mediante luz infrarroja, calculando tus latidos por minuto en tiempo real.
            Estos datos permiten identificar respuestas emocionales como estrés o alegría a través de la variabilidad cardíaca.
          </p>
          <img src="https://imgs.search.brave.com/6sH5txArnM86mCywdk0Pd8ziX90CbOaCqO9-o2JAWco/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzg0OTA5OS1NTE03/NjYzNjkxMDI1OV8w/NTIwMjQtVi1tYXgz/MDEwMi1zZW5zb3It/cHVsc28tY29uY2Vu/dHJhY2lvbi1veGln/ZW5vLWFyZHVpbm8u/d2VicA" alt="Sensor ritmo cardíaco" class="mx-auto rounded shadow-lg max-w-xs" />
        </AccordionTab>

        <AccordionTab header="Medición de Temperatura Corporal 🌡️" headerClass="text-orange-600 font-semibold">
          <p class="text-gray-700 leading-relaxed mb-3">
            La pulsera cuenta con sensores térmicos que miden la temperatura de tu piel en tiempo real. Estos datos son clave para detectar cambios en tu estado emocional, ya que emociones intensas afectan la circulación y temperatura superficial.
          </p>
          <img src="https://imgs.search.brave.com/qPema_oaGmOhP4VO4PSVBpsjt1zRYr8i8oXEAM9u0IQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzczNjY3Ni1NTE04/NTY2NzY0ODA3NF8w/NjIwMjUtVi1zZW5z/b3ItaW5mcmFycm9q/by1neS05MDYtbWx4/OTA2MTQtdGVtcGVy/YXR1cmEtcHJlY2lz/YS53ZWJw" alt="Sensor de temperatura" class="mx-auto rounded shadow-lg max-w-xs" />
        </AccordionTab>

        <AccordionTab header="Visualización de Datos 📊" headerClass="text-yellow-600 font-semibold">
          <p class="text-gray-700 leading-relaxed mb-3">
            Los datos de temperatura y ritmo cardíaco se envían a la app donde se procesan y visualizan en gráficas en tiempo real. Así puedes ver tus tendencias emocionales diarias, detectar patrones y tomar acciones para mejorar tu bienestar.
          </p>
          <p class="text-gray-700 leading-relaxed mb-3">
            Las gráficas muestran cambios a lo largo del tiempo, combinando ambos sensores para una lectura más completa. Puedes pausar la actualización en vivo para analizar datos históricos con calma.
          </p>
          <img src="../assets/grafica.png" alt="Gráficas de datos" class="mx-auto rounded shadow-lg max-w-md" />
        </AccordionTab>
      </Accordion>
    </section>

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
import { useRouter } from 'vue-router'
import CardEmotion from '../components/CardEmotion.vue'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

const router = useRouter()

const items = ref([
  { label: 'Inicio', icon: 'pi pi-home', command: () => router.push('/') },
  { label: 'Hábitos', icon: 'pi pi-check-square', command: () => router.push('/habits') },
  { label: 'Estadísticas', icon: 'pi pi-chart-bar', command: () => router.push('/stats') }
])

const alegriaTips = [
  'Identifica los momentos que te generan alegría.',
  'Dopamina y serotonina elevadas.',
  'Practica la gratitud.',
  'Rodéate de personas positivas.',
  'Realiza actividades que disfrutes conscientemente.'
]

const tristezaTips = [
  'Acepta tus emociones sin juzgarte.',
  'Serotonina baja puede influir.',
  'Habla con alguien de confianza.',
  'Escribe tus pensamientos.',
  'Haz caminatas suaves.'
]

const enojoTips = [
  'Reconoce señales físicas del enojo.',
  'Cortisol y adrenalina aumentan.',
  'Respira profundamente.',
  'Expresa con seguridad.',
  'Pausa antes de reaccionar.'
]
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.7s ease forwards;
}
.animate-fadeIn.delay-200 {
  animation-delay: 0.2s;
}
</style>
