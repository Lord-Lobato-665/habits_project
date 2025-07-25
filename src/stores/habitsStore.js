import { defineStore } from 'pinia'
import { supabase } from '../supabase/client'

export const useHabitsStore = defineStore('habits', {
  state: () => ({
    habits: []
  }),

  actions: {
    async fetchHabits() {
      const { data, error } = await supabase.from('habits').select('*').order('created_at_date', { ascending: false })
      if (!error) this.habits = data
    },

    async deleteHabit(id) {
      const { error } = await supabase.from('habits').delete().eq('id', id)
      if (!error) {
        this.habits = this.habits.filter(h => h.id !== id)
      } else {
        throw new Error('Error al eliminar hábito')
      }
    }
  }
})
