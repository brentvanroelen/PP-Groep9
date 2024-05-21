<template>

    <div v-if="aantalWaarschuwingen">
      <div class="searchcontainer">
        <img src="../assets/Campus-Kaai.jpg" alt="" id="img">
        <div class="searchbar-overlay"></div>
        <div class="searchbar">
          <SearchBar :page="home"/>
        </div>
      </div>
      <button @click="goProductScreen">See catalog</button>
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
import { useStore } from "@/Pinia/Store"

const user = useUserIdentification()
const store = useStore()
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
const goProductScreen = () => {
  store.updateResults(['nothing'])
  router.push({name: "productscreen"})
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
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.searchcontainer:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

  #img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 15px;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }

  #img:hover {
  opacity: 1;
  }

  .searchbar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    opacity: 0; /* eerst niet zichtbaar */
    transition: opacity 0.3s ease;
  }

  .searchcontainer:hover .searchbar-overlay {
  opacity: 1; /* overlay op hover */
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
    background: rgba(255, 255, 255, 0.9); 
    padding: 10px 20px;
    border-radius: 50px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    opacity: 0; /* eerst niet zichtbaar */
    transition: opacity 0.3s ease; 
  }

  .searchcontainer:hover .searchbar {
  opacity: 1; /* searchbar op hover tonen */
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
