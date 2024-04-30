<template>
    
    <SearchBar id="searchBar"></SearchBar>

        
        <h1>Manage Items</h1>
        
        
        <div class="items">

            Data uit database
           
        </div>
<div class="buttons">
        <button class="buttonsClass"><router-link class="link" to="/modifyItemScreen"> Add new kit</router-link></button>
        <button  class="buttonsClass"  >Add item </button></div>
        
</template>

<script setup>


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
#searchBar {
    margin-top: 20px;
    margin-bottom: 20px;
    justify-content: center;
}
.items{
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>