<template>
  <Card :class="`${color} shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl`">
    <template #title>
      <div class="flex items-center gap-2">
        <i :class="`${icon} text-2xl ${textColor}`" />
        <span class="text-xl font-bold" :class="textColor">{{ emotion }}</span>
      </div>
    </template>
    <template #content>
      <Accordion>
        <AccordionTab header="Consejos para gestionar esta emoción">
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-2">
            <li v-for="(tip, idx) in tips" :key="idx">{{ tip }}</li>
          </ul>
        </AccordionTab>
      </Accordion>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

defineProps({
  emotion: String,
  tips: Array,
  icon: String,
  color: String,
  textColor: String
})
</script>
