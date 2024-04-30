<template>
<SearchBar id="SearchBar"></SearchBar>

    <h1>Modify item </h1>
    <div class="modifyItems"></div>

    <div class="buttons">
        <button class="buttonsClass"><router-link class="link" to="/addKitScreen"> Add to selected kit</router-link></button>
    </div>


</template>

<script setup>
import SearchBar from '../components/Searchbar.vue'

</script>

<style>
    #SearchBar{
        
        margin-top: 20px;
        margin-bottom: 40px;
        justify-content: center;
    }
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

</style>