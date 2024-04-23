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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fafafa;
}
body{
  margin: 0;
  padding: 0;
  background: #2c3e50 ;
}
*{
  margin: 0;
  padding: 0;
}
</style>