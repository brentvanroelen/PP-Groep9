import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {ref,onMounted,watch,computed} from 'vue'
import App from './App.vue'
import router from './router'
import { useRoute } from 'vue-router'




const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

export {ref,onMounted,useRoute ,watch,computed}
