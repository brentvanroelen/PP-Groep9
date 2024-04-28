<template>
  <Navigation></Navigation>
  <router-view/>
<Footer></Footer>
  
</template>

<script>
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'


export default {
  name: "Home",
  components: {
    Navigation,
    Footer
  }
  
}
</script>



<style>

</style>