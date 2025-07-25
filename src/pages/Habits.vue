<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-pink-100 font-sans flex flex-col">
    <!-- Header con Menubar y navegación -->
    <Menubar :model="items" class="bg-white shadow-md px-4">
      <template #start>
        <div class="text-orange-600 font-bold text-xl tracking-wide cursor-pointer" @click="goHome">
          FeelingPartner
        </div>
      </template>
    </Menubar>

    <!-- Contenido principal -->
    <div class="flex-grow p-4 md:p-8">
      <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 md:gap-0">
        <h1 class="text-3xl font-extrabold text-orange-600">Hábitos</h1>
        <div class="flex items-center space-x-3">
          <label for="viewToggle" class="text-gray-700 font-semibold select-none">Modo Calendario</label>
          <ToggleButton id="viewToggle" v-model="calendarView" />
        </div>
        <Button label="Nuevo hábito" icon="pi pi-plus" class="p-button-primary ml-0 md:ml-4" @click="openNewHabit" />
      </div>

      <template v-if="!calendarView">
        <div>
          <HabitCard
            v-for="habit in habits"
            :key="habit.id"
            :habit="habit"
            @edit="editHabit"
            @delete="confirmDeleteHabit"
          />
        </div>
      </template>

      <template v-else>
        <div class="flex justify-center mb-4">
          <Calendar
            :inline="true"
            :showWeek="false"
            :dateStyle="dateStyle"
            class="calendar-scaled rounded-lg shadow-md border border-orange-300"
            @select="onDateSelected"
            v-model="selectedDate"
          />
        </div>

        <div class="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
          <table class="w-full text-sm text-left text-gray-700 calendar-table">
            <thead class="bg-orange-100 text-orange-700 font-semibold uppercase tracking-wide text-xs">
              <tr>
                <th class="px-4 py-3 rounded-tl-lg">Fecha</th>
                <th class="px-4 py-3">Título</th>
                <th class="px-4 py-3 rounded-tr-lg">Estado Emocional</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="habit in filteredHabitsByDate"
                :key="habit.id"
                class="border-b border-orange-200 hover:bg-orange-50 cursor-pointer transition-colors"
                @click="editHabit(habit)"
              >
                <td class="px-4 py-3 whitespace-nowrap font-mono text-xs text-orange-600">
                  {{ formatDate(habit.notification) }}
                </td>
                <td class="px-4 py-3 truncate max-w-xs font-semibold text-orange-700">
                  {{ habit.title_habit }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-3 py-1 rounded-md font-semibold border"
                    :class="emotionTableClass(habit.emotional_state)"
                  >
                    {{ habit.emotional_state }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredHabitsByDate.length === 0">
                <td colspan="3" class="px-4 py-6 text-center text-gray-500 italic">
                  No hay hábitos para esta fecha
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Modal para crear o editar hábito -->
      <HabitModal
        :visible="modalVisible"
        :habit="selectedHabit"
        :isEditing="isEditing"
        @update:visible="modalVisible = $event"
        @save="saveHabit"
        class="modal-scaled"
      />

      <!-- Modal de confirmación para eliminar -->
      <Dialog
        :visible="deleteConfirmVisible"
        header="Confirmar eliminación"
        modal
        :closable="false"
        :style="{ width: '400px' }"
        @hide="deleteConfirmVisible = false"
      >
        <p>¿Seguro que quieres eliminar el hábito <strong>{{ habitToDelete?.title_habit }}</strong>?</p>
        <div class="flex justify-end gap-3 mt-6">
          <Button label="Cancelar" class="p-button-text" @click="deleteConfirmVisible = false" />
          <Button label="Eliminar" class="p-button-danger" @click="deleteHabit" />
        </div>
      </Dialog>
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'
import HabitCard from '../components/HabitCard.vue'
import HabitModal from '../components/HabitModal.vue'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import ToggleButton from 'primevue/togglebutton'
import Menubar from 'primevue/menubar'
import Dialog from 'primevue/dialog'
import { format, isSameDay } from 'date-fns'

const router = useRouter()

const habits = ref([])
const modalVisible = ref(false)
const selectedHabit = ref(null)
const isEditing = ref(false)
const calendarView = ref(false)
const selectedDate = ref(new Date())

// Estados para delete confirm
const deleteConfirmVisible = ref(false)
const habitToDelete = ref(null)

const items = [
  { label: 'Inicio', icon: 'pi pi-home', command: () => router.push('/') },
  { label: 'Hábitos', icon: 'pi pi-check-square', command: () => router.push('/habits') },
  { label: 'Estadísticas', icon: 'pi pi-chart-bar', command: () => router.push('/stats') }
]

async function fetchHabits() {
  const { data, error } = await supabase.from('habitos').select('*').order('notification', { ascending: true })
  if (error) {
    console.error('Error cargando hábitos:', error.message)
  } else {
    habits.value = data
  }
}

fetchHabits()

function openNewHabit() {
  selectedHabit.value = null
  isEditing.value = false
  modalVisible.value = true
}

function editHabit(habit) {
  selectedHabit.value = { ...habit }
  isEditing.value = true
  modalVisible.value = true
}

function saveHabit(habitData) {
  if (isEditing.value) {
    updateHabit(habitData)
  } else {
    createHabit(habitData)
  }
}

// Crear hábito
async function createHabit(habitData) {
  const { data, error } = await supabase.from('habitos').insert([habitData])
  if (error) {
    console.error('Error creando hábito:', error.message)
  } else {
    habits.value.push(data[0])
  }
}

// Actualizar hábito
async function updateHabit(habitData) {
  const { data, error } = await supabase
    .from('habitos')
    .update(habitData)
    .eq('id', selectedHabit.value.id)
  if (error) {
    console.error('Error actualizando hábito:', error.message)
  } else {
    const index = habits.value.findIndex(h => h.id === selectedHabit.value.id)
    if (index !== -1) {
      habits.value[index] = { ...habits.value[index], ...habitData }
    }
  }
}

// Confirmación de eliminación
function confirmDeleteHabit(habit) {
  habitToDelete.value = habit
  deleteConfirmVisible.value = true
}

// Eliminar hábito
async function deleteHabit() {
  if (!habitToDelete.value) return

  const { error } = await supabase.from('habitos').delete().eq('id', habitToDelete.value.id)
  if (error) {
    console.error('Error eliminando hábito:', error.message)
  } else {
    habits.value = habits.value.filter(h => h.id !== habitToDelete.value.id)
  }
  habitToDelete.value = null
  deleteConfirmVisible.value = false
}

const filteredHabitsByDate = computed(() => {
  return habits.value.filter(habit => {
    if (!habit.notification) return false
    return isSameDay(new Date(habit.notification), selectedDate.value)
  })
})

function dateStyle({ date }) {
  const hasHabit = habits.value.some(h => {
    if (!h.notification) return false
    return isSameDay(new Date(h.notification), date)
  })
  return hasHabit ? { className: 'habit-day' } : null
}

function onDateSelected(date) {
  selectedDate.value = date
}

function formatDate(date) {
  try {
    return format(new Date(date), "dd/MM/yyyy HH:mm")
  } catch {
    return ''
  }
}

function emotionTableClass(emotion) {
  switch (emotion) {
    case 'Alegría':
      return 'text-yellow-600 border-yellow-400 bg-yellow-100'
    case 'Tristeza':
      return 'text-blue-600 border-blue-400 bg-blue-100'
    case 'Enojo':
      return 'text-red-600 border-red-400 bg-red-100'
    default:
      return 'text-gray-600 border-gray-400 bg-gray-100'
  }
}

watch(calendarView, (val) => {
  if (!val) selectedDate.value = new Date()
})

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.calendar-scaled {
  transform: scale(0.85);
  transform-origin: center;
}

.modal-scaled .p-dialog {
  transform: scale(0.75) !important;
  top: 50% !important;
  left: 50% !important;
  transform-origin: center center !important;
  margin-top: calc(-0.75 * 50%);
  margin-left: calc(-0.75 * 50%);
}

/* Días con hábito en calendario en gris pastel */
.habit-day .p-datepicker-calendar-day {
  background-color: #e6e6e6 !important;
  border-radius: 50% !important;
  color: #666 !important;
  font-weight: 600;
}

/* Tabla diseño cálido */
.calendar-table thead {
  background-color: #fef3c7;
  color: #b45309;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.calendar-table tbody tr {
  border-bottom: 1px solid #fed7aa;
  transition: background-color 0.3s ease;
}

.calendar-table tbody tr:hover {
  background-color: #fff7e6;
  cursor: pointer;
}

.calendar-table td {
  padding: 0.75rem 1rem;
  vertical-align: middle;
}

/* Responsive para móvil */
@media (max-width: 640px) {
  .calendar-table thead {
    display: none;
  }
  .calendar-table tbody tr {
    display: block;
    margin-bottom: 1.25rem;
    border-bottom: none;
    background-color: #fff7e6;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
  }
  .calendar-table tbody tr:hover {
    background-color: #fef3c7;
  }
  .calendar-table tbody td {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0;
    border-bottom: 1px solid #fed7aa;
  }
  .calendar-table tbody td:last-child {
    border-bottom: none;
  }
  .calendar-table tbody td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #b45309;
  }
  .calendar-table tbody td:nth-child(1)::before {
    content: 'Fecha';
  }
  .calendar-table tbody td:nth-child(2)::before {
    content: 'Título';
  }
  .calendar-table tbody td:nth-child(3)::before {
    content: 'Estado Emocional';
  }
}
</style>
