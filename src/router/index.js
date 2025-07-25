import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Habits from '../pages/Habits.vue'
import Stats from '../pages/Stats.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/habits', component: Habits },
  { path: '/stats', component: Stats }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
