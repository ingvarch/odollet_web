import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './components/Home.vue'
import PrivacyPolicy from './components/PrivacyPolicy.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/index.html', component: Home },
  { path: '/privacy-policy', component: PrivacyPolicy },
  { path: '/:pathMatch(.*)*', component: Home }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 96
      }
    }
    return { top: 0 }
  }
})

createApp(App).use(router).mount('#app')
