<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="isEditing ? 'Editar Hábito' : 'Nuevo Hábito'"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="submitForm" class="p-fluid">
      <div class="field">
        <label for="title">Título</label>
        <InputText id="title" v-model="localHabit.title_habit" required />
      </div>

      <div class="field">
        <label for="description">Descripción</label>
        <textarea
          id="description"
          v-model="localHabit.description_habit"
          rows="3"
          required
          class="w-full p-2 border rounded resize-none"
        ></textarea>
      </div>

      <div class="field">
        <label for="emotional_state">Estado Emocional</label>
        <Dropdown
          id="emotional_state"
          :options="emotionalStates"
          optionLabel="label"
          optionValue="value"
          v-model="localHabit.emotional_state"
          placeholder="Selecciona un estado"
          required
        />
      </div>

      <div class="field">
        <label for="notification">Fecha y hora de notificación</label>
        <Calendar
          ref="calendarRef"
          id="notification"
          v-model="localHabit.notification"
          showTime
          hourFormat="24"
          dateFormat="yy-mm-dd"
          @input="closeCalendar"
          required
        />
      </div>

      <div class="flex justify-content-end gap-3 mt-4">
        <Button label="Cancelar" class="p-button-text" @click="cancel" />
        <Button label="Guardar" type="submit" class="p-button-primary" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
// import InputTextarea from 'primevue/inputtextarea'  // Usamos textarea nativo
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'

const props = defineProps({
  visible: Boolean,
  habit: Object,
  isEditing: Boolean,
})

const emit = defineEmits(['update:visible', 'save'])

const emotionalStates = [
  { label: 'Alegría', value: 'Alegría' },
  { label: 'Tristeza', value: 'Tristeza' },
  { label: 'Enojo', value: 'Enojo' }
]

const calendarRef = ref(null)

const defaultHabit = {
  title_habit: '',
  description_habit: '',
  emotional_state: null,
  notification: null
}

// Reactive habit local state, limpio si no hay prop habit
const localHabit = reactive({ ...defaultHabit })

// Sync prop habit only if editing or prop changes
watch(() => props.habit, (newVal) => {
  if (newVal) {
    localHabit.title_habit = newVal.title_habit
    localHabit.description_habit = newVal.description_habit
    localHabit.emotional_state = newVal.emotional_state
    localHabit.notification = newVal.notification ? new Date(newVal.notification) : null
  } else {
    Object.assign(localHabit, defaultHabit)
  }
}, { immediate: true })

// Si abres el modal y no estás editando, limpia el formulario
watch(() => props.visible, (val) => {
  if (val && !props.isEditing) {
    Object.assign(localHabit, defaultHabit)
  }
})

function cancel() {
  emit('update:visible', false)
}

function submitForm() {
  emit('save', { ...localHabit })
  emit('update:visible', false)
}

function closeCalendar() {
  if (calendarRef.value) {
    if (typeof calendarRef.value.hide === 'function') {
      calendarRef.value.hide()
    } else {
      calendarRef.value.overlayVisible = false
    }
  }
}
</script>
