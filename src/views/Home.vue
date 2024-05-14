<template>
  <!-- <Navigation></Navigation> -->
  <!-- <Admin></Admin> -->
  <div class="searchcontainer">
    <img src="../assets/Campus-Kaai.jpg" alt="" id="img">
    <div class="searchbar-overlay"></div>
    <div class="searchbar">
      <SearchBar :page="home"/>

      
    </div>
  </div>
  <Kits />
  <br>
  <br>
<!--   <button><router-link class="link" to="/HomeAdmin" id="buttonAdmin"></router-link>Admin</button>
 -->  <!-- Categories -->
  <Categories></Categories>
  <Footer></Footer>
  </template>

<script setup>
import Navigation from "../components/Navigation.vue"
import Footer from "../components/Footer.vue"
import Categories from "../components/Categories.vue"
import SearchBar from "../components/Searchbar.vue"
import Admin from "../components/navigationAdmin.vue"
import { useUserIdentification } from "@/Pinia/Store"
import { useRouter } from "vue-router"

const home = "UserHome"
const user = useUserIdentification()
const router = useRouter()
const testing = true
if(testing == false){
  if (user.user.id == "" || user.user.id == undefined){
    console.log("User not logged in")
    user.logOut()
  }else if(user.user.type == "admin"){
    router.push({name: "HomeAdmin"})
  }else{
    console.log("Welcome")
  }
}
</script>

<style>
.searchcontainer {
  position: relative;
  background: url("../assets/Campus-Kaai.jpg") no-repeat center center/cover;
}




</style>