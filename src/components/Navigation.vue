<template>
  <nav class="Main_nav">
    <ul class="Main_nav_links">
      <li id='img'><router-link  to="/"><img src="../assets/EhB-logo-transparant.png" alt="" ></router-link></li>
    <div id="links">
      <li><router-link class="link" to="/">Home</router-link></li>
      <li><router-link class="link" to="/Myproducts">My products</router-link></li>
      <li><router-link class="link" to="/cart">Cart</router-link></li>
      <li><router-link class="link" to="/Additem">Additem</router-link></li>
      <li><router-link class="link" to ="/ReportIssue">Report Issue</router-link></li>
      <li><button class="loginPageBtn" @click="logOut"> log out</button></li>
    </div>
    </ul>
  </nav>
</template>

<script setup>
import { useUserIdentification } from '@/Pinia/Store';


const userIdentification = useUserIdentification();

const logOut = () => {
    userIdentification.logOut();
}
</script>

<style scoped>
.Main_nav{
  background-color: #D9D9D9;
}
.Main_nav_links li img{
  max-width: 80px !important;
  height: auto !important;
  margin-left: 0.5em  !important;
}
.Main_nav_links{
  display: flex   !important;
  flex-direction: row  !important;
  align-items: center !important;
  width:100% !important;
  height:75px !important;
  list-style: none !important;
  justify-content: space-between !important;
}
.link{
  text-decoration: none !important;
  padding: 0 1em 0 1em !important;
}
#links{
  display: flex !important;
  flex-direction: row !important;
  justify-content: end   !important;
  align-items: center !important;
  width: 80% !important;
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
