import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AboutView from '../views/AboutView.vue'
import Contact from '../views/Contact.vue'
import ItemScreen from '../views/ItemScreen.vue'

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
    path: '/ItemScreen',
    name: "ItemScreen",
    component: ItemScreen
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
