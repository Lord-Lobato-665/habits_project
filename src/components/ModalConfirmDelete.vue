<template>
  <Dialog
    :visible="visible"
    modal
    header="Confirmar Eliminación"
    :closable="false"
    :dismissableMask="false"
    :style="{ width: '400px' }"
    @hide="cancel"
  >
    <div class="p-4 text-center">
      <i class="pi pi-exclamation-triangle text-red-500 text-4xl mb-4"></i>
      <p>¿Seguro que quieres eliminar el hábito <strong>{{ habitTitle }}</strong>?</p>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <Button label="Cancelar" class="p-button-text" @click="cancel" />
      <Button label="Eliminar" class="p-button-danger" @click="accept" />
    </div>
  </Dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  visible: Boolean,
  habitTitle: String
})

const emit = defineEmits(['update:visible', 'confirm'])

function cancel() {
  emit('update:visible', false)
}

function accept() {
  emit('confirm')
  emit('update:visible', false)
}
</script>
