<template>
    <h1>Manage Items</h1>
        <SearchBarAdmin ></SearchBarAdmin>
    <!--<SearchBar id="searchBar"></SearchBar>-->

        
        
        
        
        <div class="items">

            <!-- Data uit database -->
           
        </div>
<div class="buttons">
        <button class="buttonsClass"><router-link class="link" to="/modifyItemScreen"> Add new kit</router-link></button>
        <button  class="buttonsClass"><router-link class="link" to="/addItemsScreen"> Add item </router-link></button></div>
        
</template>

<script setup>
import SearchBarAdmin from '../components/SearchBarAdmin.vue'

import SearchBar from '../components/Searchbar.vue'

</script>

<style>
.buttonsClass{
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
}
.buttons{
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
    
}

   

.items{
    margin-top: 20px;
    margin-bottom: 20px;
}


</style>