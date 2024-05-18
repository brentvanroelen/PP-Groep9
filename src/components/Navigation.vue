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

<style>
.Main_nav{
  background-color: #D9D9D9;
}
.Main_nav_links li img{
  max-width: 80px;
  height: auto;
  margin-left: 0.5em;
}
.Main_nav_links{
  display: flex;
  flex-direction: row;
  align-items: center;
  width:100%;
  height:75px;
  list-style: none;
  justify-content: space-between;
}
.link{
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
