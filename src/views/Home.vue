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
 .searchcontainer{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
 }
 .overlay {
  position: absolute;
  top: 75;
  left: 0;
  width: 100%; 
  height: 300px;
  background-color: rgba(0, 0, 0, 0.5); 
  pointer-events: none; 
  z-index: -1;
}
.searchcontainer img{
    width: 100%;
    height: 300px;
    z-index: -2;
}
.searchbar{
    align-content: center;
    position: absolute;
    top: 205px;
    left: 40%;
    width: 250px;
    height: 30px;
    
    font-size: 18px;
    
}
.most_leased_items{
    background: #2c3e50 ;
}

.item{
    border-radius: 1em;
    margin: 6px;
    padding: 10px;
    background: crimson;
    text-align: center;
    width: 200px;
}
.item img{
    width: 150px;
}
.item a{
    width: 25px;
    border: #333 solid 2px;
    margin-top: 4px;
    background: #333;
}
.item a:hover{
    cursor: pointer;
}
.available{
    background: rgb(82, 129, 12);
}
</style>