<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-pink-100 font-sans flex flex-col text-sm">
    <ProfileMenu />
    <!-- Menú superior -->
    <Menubar :model="items" class="bg-white shadow-md px-2 py-2">
      <template #start>
        <div class="text-orange-600 font-bold text-lg tracking-wide">FeelingPartner</div>
      </template>
    </Menubar>

    <!-- Introducción -->
    <section class="text-center px-4 md:px-10 py-8 flex-grow">
      <h2 class="text-4xl md:text-5xl font-extrabold text-orange-600 drop-shadow-md mb-3 animate-fadeIn">
        FeelingPartner
      </h2>
      <p class="mt-3 text-base text-gray-700 max-w-xl mx-auto leading-relaxed tracking-wide animate-fadeIn delay-200">
        Cuantifica y comprende tus emociones con una pulsera inteligente que mide tu ritmo cardíaco y temperatura. Gestiona hábitos y accede a estadísticas emocionales en tiempo real.
      </p>

      <!-- Botones -->
      <div class="mt-6 flex justify-center gap-3 animate-fadeIn delay-300">
        <Button
          label="Explora emociones"
          icon="pi pi-heart"
          class="p-button-sm bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white font-bold shadow-md transition-transform transform hover:scale-105"
          @click="router.push('/habits')"
        />
        <Button
          label="Estadísticas"
          icon="pi pi-chart-bar"
          class="p-button-sm bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white font-bold shadow-md transition-transform transform hover:scale-105"
          @click="router.push('/stats')"
        />
      </div>
    </section>

    <!-- Tarjetas -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10 pb-12" aria-label="Consejos emocionales">
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

    <!-- Sensores -->
    <section class="px-4 md:px-10 pb-16 max-w-4xl mx-auto text-sm" aria-label="Cuantificación por sensores y gráficas">
      <h3 class="text-2xl font-bold text-orange-600 mb-5 text-center drop-shadow-md">¿Cómo cuantificamos tus emociones?</h3>
      <Accordion multiple>
        <AccordionTab header="Ritmo Cardíaco ❤️‍🔥" headerClass="text-red-600 font-semibold text-base">
          <p class="text-gray-700 leading-relaxed mb-2">
            Utilizamos sensores ópticos PPG que detectan cambios en el volumen de sangre mediante luz infrarroja, calculando tus latidos por minuto.
          </p>
          <img src="../assets/pulso.png" alt="Sensor ritmo cardíaco" class="mx-auto rounded shadow-md max-w-[160px]" />
        </AccordionTab>

        <AccordionTab header="Temperatura Corporal 🌡️" headerClass="text-orange-600 font-semibold text-base">
          <p class="text-gray-700 leading-relaxed mb-2">
            Sensores térmicos miden la temperatura de tu piel en tiempo real. Las emociones intensas afectan la circulación y temperatura superficial.
          </p>
          <img src="../assets/tempertura.png" alt="Sensor temperatura" class="mx-auto rounded shadow-md max-w-[160px]" />
        </AccordionTab>

        <AccordionTab header="Visualización de Datos 📊" headerClass="text-yellow-600 font-semibold text-base">
          <p class="text-gray-700 leading-relaxed mb-2">
            Los datos se envían a la app donde se visualizan en gráficas en tiempo real. Puedes ver tendencias diarias, detectar patrones y tomar decisiones.
          </p>
          <img src="../assets/grafica.png" alt="Gráficas" class="mx-auto rounded shadow-md max-w-[200px]" />
        </AccordionTab>
      </Accordion>
    </section>

    <!-- Footer -->
    <footer class="bg-white shadow-inner py-4 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-center items-center gap-3">
      <span>Hecho con ❤️ por FeelingPartner</span>
      <div class="flex space-x-4 text-orange-400">
        <a href="https://twitter.com/feelingpartner" target="_blank" aria-label="Twitter" class="hover:text-orange-600 transition">
          <i class="pi pi-twitter text-base"></i>
        </a>
        <a href="https://facebook.com/feelingpartner" target="_blank" aria-label="Facebook" class="hover:text-orange-600 transition">
          <i class="pi pi-facebook text-base"></i>
        </a>
        <a href="https://instagram.com/feelingpartner" target="_blank" aria-label="Instagram" class="hover:text-orange-600 transition">
          <i class="pi pi-instagram text-base"></i>
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
import ProfileMenu from "../components/ProfileMenu.vue";

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
