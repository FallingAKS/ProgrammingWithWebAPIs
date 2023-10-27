import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/MashUp.vue'
import InfoPage from './components/Info.vue'

const routes = [
  { 
    path: '/', 
    component: HomePage 
  },
  { 
    path: '/info', 
    component: InfoPage 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
