<template>
    <div class="search-container">
      <div class="search-bar">
        <input type="text" v-model="querystring" @keyup.enter="search"placeholder="Search">
        <button @click="search">Search</button>
      </div>
      <div class="searchResults">
      <ul>
        <li v-for="(item, index) in results" :key="index">
          {{ item.Name }} - {{ item.Description }}
          <img :src="item.Image" alt="" id="img">
        </li>
      </ul>
    </div>
    
      </div>
  
  </template>
    
  <script setup>
    import {onMounted, ref, watch} from '../main.js'
    import {collection,where,db,query,getDocs} from '../Firebase/Index.js'
    import router from '@/router';
    import { useStore,useCart } from '@/Pinia/Store.js';
   
      
      
    
    const showResults = ref(false);
    const props = defineProps({
      page: String,
      class: String
    });
    const querystring = ref('');
    const store = useStore();
    const cart = useCart();
  
    const search = async() => {
      let results = [];
      store.updateResults([]);
      const itemquery = query(collection(db, "Items"), 
      where('SubStrings', 'array-contains', querystring.value.toLowerCase())
      );
      
      const querySnapshot = await getDocs(itemquery);
        querySnapshot.forEach((snap) =>{
          console.log(snap.data())
          results.push(snap.data())
      })
      console.log(results)
      store.updateResults(results)
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
    