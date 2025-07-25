<template>
  <div :class="`rounded-xl shadow-md p-5 transition duration-300 ${color}`">
    <div class="flex justify-between items-center cursor-pointer" @click="show = !show">
      <h4 :class="`text-xl font-bold ${textColor}`">{{ emotion }}</h4>
      <span class="text-xl">{{ show ? '−' : '+' }}</span>
    </div>
    <ul v-if="show" class="mt-3 list-disc list-inside text-sm text-gray-700">
      <li v-for="(tip, i) in tips" :key="i">{{ tip }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  emotion: String,
  color: String,
  textColor: String,
  tips: Array
})

const show = ref(false)
</script>
