import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AboutView from '../views/AboutView.vue'
import Contact from '../views/Contact.vue'
import ProductScreen from '../views/ProductScreen.vue'
import Calendar from '../components/Calendar.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact
  },
  {
    path: '/productscreen',
    name: 'productscreen',
    component: ProductScreen
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: Calendar
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
