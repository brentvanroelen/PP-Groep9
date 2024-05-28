import './assets/main.css'
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import {ref,onMounted,watch,computed} from 'vue'
import App from './App.vue'
import router from './router'
import { useRoute } from 'vue-router'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2';
import { useUserIdentification } from './Pinia/Store'
const pinia = createPinia()

const persistedStatePlugin = createPersistedStatePlugin();
pinia.use(persistedStatePlugin);

pinia.use(({ store }) => {
    store.router = markRaw(router)
});

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker)
app.use(pinia)
app.use(router)

const userIdentificationStore = useUserIdentification();
userIdentificationStore.initialize();

app.mount('#app')

export {ref,onMounted,useRoute ,watch,computed}
