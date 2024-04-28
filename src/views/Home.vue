<template>
  <div class="searchcontainer">
    <img src="../assets/Flavor.jpg" alt="">
    <div class="searchbar-overlay"></div>
    <div class="searchbar">
      <SearchBar/>

      
    </div>
  </div>
  <Kits />
  <br>
  <br>
  <button><router-link class="link" to="/HomeAdmin"></router-link>Admin</button>
  <!-- Categories -->
  <Categories></Categories>
  <Footer></Footer>
  </template>

<script setup>
import Footer from "../components/Footer.vue"
import Categories from "../components/Categories.vue"
import SearchBar from "../components/Searchbar.vue"



</script>

<style>



</style>