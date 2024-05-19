<template>
    <h2>Early Returns</h2>
    <label for="ItemorKITname">Item or KIT name: </label>
    <SearchBarAdmin :page="'HomeAdmin'"></SearchBarAdmin>
    <br>
    <label for="borrowedItems">Borrowed items: </label> borrowed Items<br>
    <button>Selection returned</button>
    <button>Selection returned + check</button>
    <button>Everything returned</button>
    <button>Everything returned + check</button>
</template>
<script setup>
import SearchBarAdmin from './SearchBarAdmin.vue';


</script>
<style scoped>
button {
  background-color: #ff3333;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin: 0.5em;
}
</style>