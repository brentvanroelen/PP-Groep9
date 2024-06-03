<template>
  <div v-if="isLoading">
    <p>loading...</p>
  </div>
  <div v-else-if="warningCount < requiredWarningsToBlacklist">
    <NavigationAdmin v-if="uid.user.type === 'admin'"></NavigationAdmin>
    <Navigation v-else></Navigation >
    <router-view/>
    <Footer></Footer>
  </div>

  <div class="waarschuwing" v-else>
      <h1>Waarschuwing</h1>
      <p>Je hebt te veel waarschuwingen ontvangen om toegang te krijgen tot deze website.</p>
  </div>





  
</template>

<script setup>
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
import NavigationAdmin from '../src/components/navigationAdmin.vue'
import { onMounted, ref, watchEffect } from 'vue'
import { useCart,useDates,useQuantity, useUserIdentification } from './Pinia/Store'
import { db } from './Firebase/Index.js'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()
const cart = useCart()
const adminButton = ref(false)
let message = ref('')
const warningCount = ref(0);
const uid = useUserIdentification()
const requiredWarningsToBlacklist = ref(3);
const isLoading = ref(true);
const userType = ref(null);

watchEffect(() => {
  if (uid.user.type){
    userType.value = uid.user.type
    console.log(userType.value)
  }
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (userType.value !== 'admin') {
      next({ name: 'home'})
    } else {
      next()
    }
  }else{
    next()
  }

})

const fetchData = async () => {
  const docRef = doc(db, 'Users', uid.user.id)
  const docSnap = await getDoc(docRef)

  if(docSnap.exists()){
    const data = docSnap.data()
    warningCount.value = data.warningCount
    isLoading.value = false;
  }
}

const fetchSettings = async () => {
  const docRef = doc(db, 'Settings', 'Options')
  const docSnap = await getDoc(docRef)

  if(docSnap.exists()){
    const data = docSnap.data()
    requiredWarningsToBlacklist.value = data.requiredWarningsToBlacklist;
    isLoading.value = false;
  }
}


watchEffect(() => {
  if (uid.user.id) {
    fetchData();
    fetchSettings();
  }else{
    isLoading.value = false;
  }
})
/* export default {
  name: "Home",
  components: {
    Navigation,
    Footer,
    NavigationAdmin
  }
  
} */



</script>



<style>
body{
  background-color: has-background-light;
}
.waarschuwing {
  text-align: center;
  padding: 20px;
  background-color: #ffdddd; 
  border-radius: 10px;
  margin: 20px; 
  transform: scale(1); /* eerst normale groote */
  transition: transform 0.3s ease;
  }

  .waarschuwing:hover {
  transform: scale(1.05); /*wordt iets groter op hover*/
  }
  .waarschuwing h1 {
  font-size: 24px;
  color: #ff0000;
  }

  .waarschuwing p {
  font-size: 16px;
  color: #333;
  }
</style>