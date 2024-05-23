import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import {ref,onMounted,watch,computed} from 'vue'
import App from './App.vue'
import router from './router'
import { useRoute } from 'vue-router'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const pinia = createPinia()

pinia.use(({ store }) => {
    store.router = markRaw(router)
})

const app = createApp(App)


app.component('VueDatePicker', VueDatePicker)
app.use(pinia)
app.use(router)

app.mount('#app')

export {ref,onMounted,useRoute ,watch,computed}
