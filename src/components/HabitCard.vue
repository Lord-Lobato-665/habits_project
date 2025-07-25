<template>
  <div class="habit-card bg-white rounded-xl shadow-md p-6 mb-4 relative select-none">
    <!-- Botón eliminar pequeño en esquina superior izquierda -->
    <button
      class="absolute top-4 left-4 text-red-600 hover:text-red-800 p-1 rounded"
      @click.stop="$emit('delete', habit)"
      title="Eliminar hábito"
      style="transform: scale(0.8);"
    >
      <i class="pi pi-trash"></i>
    </button>

    <!-- Etiqueta de emoción en esquina superior derecha -->
    <span
      class="absolute top-4 right-4 px-3 py-1 rounded-full font-semibold text-sm"
      :class="emotionColors[habit.emotional_state]?.bg"
      :style="{ color: emotionColors[habit.emotional_state]?.text }"
    >
      {{ habit.emotional_state }}
    </span>

    <!-- Contenido clickeable para editar -->
    <div @click="$emit('edit', habit)" class="cursor-pointer">
      <h3 class="text-xl font-extrabold text-orange-600 truncate mb-2">
        {{ habit.title_habit }}
      </h3>

      <time
        class="block text-sm text-gray-500 mb-4 flex items-center space-x-2"
        :datetime="habit.notification"
      >
        <svg
          class="w-5 h-5 text-orange-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2v-7H3v7a2 2 0 0 0 2 2z" />
        </svg>
        <span>{{ formattedDate }}</span>
      </time>

      <p class="text-gray-700 leading-relaxed whitespace-pre-line">
        {{ habit.description_habit }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  habit: Object
})

const emotionColors = {
  Alegría: { bg: 'bg-yellow-100', text: '#D97706' }, // amarillo pastel y naranja oscuro
  Tristeza: { bg: 'bg-blue-100', text: '#1E40AF' },  // azul pastel y azul oscuro
  Enojo: { bg: 'bg-red-100', text: '#B91C1C' },      // rojo pastel y rojo oscuro
  default: { bg: 'bg-gray-200', text: '#4B5563' }    // gris suave y texto gris
}

const formattedDate = computed(() => {
  if (!props.habit.notification) return ''
  try {
    return format(new Date(props.habit.notification), "dd 'de' MMM yyyy, HH:mm")
  } catch {
    return ''
  }
})
</script>

<style scoped>
.habit-card {
  will-change: transform;
  animation: fadeInUp 0.4s ease forwards;
  position: relative;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
