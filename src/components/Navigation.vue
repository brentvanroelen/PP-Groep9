<template>
  <nav class="Main_nav">
    <ul class="Main_nav_links">
      <li><router-link  to="/"><img src="../assets/EhB-logo-transparant.png" alt="" ></router-link></li>
      <li><router-link class="link" to="/">Home</router-link></li>
      <li><router-link class="link" to="/">My products</router-link></li>
      <li><router-link class="link" to="/contact">Contact</router-link></li>
      <li><router-link class="link" to="/ItemScreen">Cart</router-link></li>
    </ul>
  </nav>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'HomeView',
  components: {

  }
}
</script>

<style>
.Main_nav{
  background: #3c94e6;
}
.Main_nav_links li img{
  max-width: 75px;
  height: 78px;
}
.Main_nav_links{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width:100%;
  height:75px;
  background: #2c3e50;
  list-style: none;
}
.link{
  color: white;
  text-decoration: none;
}
.img{
  width: 20px;
  height: 20px;
}
</style>
