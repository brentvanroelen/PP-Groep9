<template>
  <!-- <Navigation></Navigation> -->
  <!-- <Admin></Admin> -->

    <div v-if="aantalWaarschuwingen">
      <div class="searchcontainer">
        <img src="../assets/Campus-Kaai.jpg" alt="" id="img">
        <div class="searchbar-overlay"></div>
        <div class="searchbar">
          <SearchBar :page="home"/>
        </div>
      </div>
      <Kits />
      <Categories></Categories>
      <br>
      <br>
      
    </div>

    <div class="waarschuwing" v-else>
      <h1>Waarschuwing</h1>
      <p>Je hebt te veel waarschuwingen ontvangen om toegang te krijgen tot deze website.</p>
    </div>


</template>

<script setup>
import { ref } from 'vue';
import Navigation from "../components/Navigation.vue";
import Footer from "../components/Footer.vue";
import Categories from "../components/Categories.vue";
import SearchBar from "../components/Searchbar.vue";
import Admin from "../components/navigationAdmin.vue";
import { useUserIdentification } from "@/Pinia/Store"
import { useRouter } from "vue-router"

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

const home = "UserHome";

const aantalWaarschuwingen = ref(1); 
const maxWaarschuwingen = ref(3); 
</script>

<style scoped>
.searchcontainer {
  position: relative;
  background: url("../assets/Campus-Kaai.jpg") no-repeat center center/cover;
  overflow: hidden;
}

  #img {
    width: 100%;
    height: auto;
  }

  .searchbar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .searchbar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%); /*centreert searchbar*/
    z-index: 2; /*search boven overlay*/
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
