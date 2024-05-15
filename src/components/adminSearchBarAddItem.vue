<template>
  <div class="search-container">
    <div class="search-bar">
      <input type="text" v-model="querystring" @keyup.enter="search" placeholder="Search">
      <button @click="search">Search</button>
    </div>
    <div class="searchResults">
      <div v-for="(item, index) in results" :key="index" class="item">
        <h2>{{ item.Name }}</h2>
        <img :src="item.Image" alt="Item Image">
        <p>{{ item.Description }}</p>
        <input type="checkbox" v-model="selectedItems" :value="item"  @change="addToSelectedKit" class="item-checkbox" >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { collection, where, db, query, getDocs } from '../Firebase/Index.js';
import { useStore } from '@/Pinia/Store.js';
import { useKitItems } from '@/Pinia/Store.js';

const querystring = ref('');
const results = ref([]);
const selectedItems = ref([]);
const kitItems = useKitItems();

const store = useStore();
const addToSelectedKit = (item) => {
  console.log(selectedItems.value);
    kitItems.addItem(selectedItems.value);
  console.log(kitItems);


};


const search = async () => {
  results.value = [];
  const itemquery = query(
    collection(db, "Items"), 
    where('SubStrings', 'array-contains', querystring.value.toLowerCase())
  );

    
      
  const querySnapshot = await getDocs(itemquery);
  const itemsData = [];
  querySnapshot.forEach((snap) => {
    itemsData.push(snap.data());
  });
  results.value = itemsData;
};




</script>

    
  
    <style scoped>
    .search-container {
    width: 100%; /* Adjust this value to suit your needs */
    position: relative; /* This makes the .search-results position relative to this container */
    }
    .search-bar {
      display: flex;
      align-items: center;
      margin-top: 0%;
      justify-content: center;
    }
    
    .search-bar input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-right: 5px;
    }
    
    .search-bar button {
       padding: 8px 12px; 
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      
    }
    .search-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 200px;
    overflow-y: auto;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 20px;
    z-index: 1;
  }
  .iteminfo{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    overflow: visible;
  }
  img{
    max-width: 35%;
    margin-top: 2px;
    align-self: start;
  }
  button {
    background-color: #ff3333;
    color: #fff;
    border: none;
    padding: 5px 5px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  
    
    </style>
    