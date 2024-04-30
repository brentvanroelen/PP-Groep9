<template>

<NavigationAdmin v-if="adminButton == true"></NavigationAdmin>
<Navigation v-else></Navigation >
<button @click="adminButton = !adminButton">Admin </button>
  <router-view/>
<Footer></Footer>


  
</template>

<script setup>
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
import NavigationAdmin from '../src/components/navigationAdmin.vue'
import { ref } from 'vue'

const adminButton = ref(false)




 


 




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

</style>