<template>
  <nav class="Main_nav">
    <ul class="Main_nav_links">
      <li><router-link  to="/"><img src="../assets/EhB-logo-transparant.png" alt="" ></router-link></li>
    <div id="links">
      <li><router-link class="link" to="/">Home</router-link></li>
      <li><router-link class="link" to="/">My products</router-link></li>
      <li><router-link class="link" to="/contact">Contact</router-link></li>
      <li><router-link class="link" to="/calendar">Cart</router-link></li>
    
      <li><router-link class="link" to="/ItemScreen">Cart</router-link></li>
      <li><router-link class="link" to="/Additem">Additem</router-link></li>
    </div>
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
  height: 75px;
}
.Main_nav_links{
  display: flex;
  flex-direction: row;
  align-items: center;
  width:100%;
  height:75px;
  background: #2c3e50;
  list-style: none;
  justify-content: space-between;
}
.link{
  color: white;
  text-decoration: none;
  padding: 0 1em 0 1em;
}
#links{
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  width: 80%;
}
.img{
  width: 20px;
  height: 20px;
}
.img{
  width: 20px;
  height: 20px;
}
</style>
