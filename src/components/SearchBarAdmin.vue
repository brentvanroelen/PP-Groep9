<template>
    <div class="search-bar">
      <input type="text" v-model="querystring"  @keyup.enter="search" placeholder="Search">
      <button @click="search">Search</button>
    </div>
  
    <!-- Resultaten -->
    <div v-if="results.length > 0" class="searchResults">
      <ul>
        <li v-for="(item, index) in results" :key="index">
          {{ item.Name }} - {{ item.Serial }} - {{ item.Description }}
          <img :src="item.Image" alt="" id="img">
        </li>
      </ul>
    </div>
    <div v-else>
      No results found.
    </div>
  </template>
  
  <script setup>
  import { getDocs, getFirestore } from 'firebase/firestore';
  import { computed, onMounted, ref } from 'vue';
  import { collection, where, db, query,getDoc } from '../Firebase/Index.js';
  import { useStore } from '@/Pinia/Store.js';
  
  const querystring = ref('');
  const store = useStore();
  let results = ref([]);
  let generalItem;

  const search = async () => {
    console.log(querystring.value);
    store.updateResults([]);
    await querySnapshot1().then(() => {
      querySnapshot2();
    })
  
    store.updateResults(results.value);
    console.log(results.value);
  };
  
    const querySnapshot1 = async() => {
      const itemQuery1 = query(
      collection(db, "Items"),
      where('SerialSeries', '==', querystring.value.split("-")[0]), 
      );
      console.log(itemQuery1);
      const doc = await getDocs(itemQuery1);
      console.log(doc);
      doc.forEach((doc) => {
        generalItem = doc.data();
    })
    return generalItem;
  };
    const querySnapshot2 = async() => {
      const itemQuery2 = query(
      collection(db, `Items/${generalItem.Name.charAt(0).toUpperCase() 
                    + generalItem.Name.slice(1)}/${generalItem.Name.charAt(0).toUpperCase() 
                    + generalItem.Name.slice(1)} items/`),
      where('Serial', '==', querystring.value), 
      );
      console.log(generalItem);
      const doc = await getDocs(itemQuery2);
      console.log(doc);
      doc.forEach((doc) => {
        results.value.push(doc.data());
    })
    console.log(results.value);
  }

  </script>
  

  <style scoped>
  .search-bar {
    margin-top: 20px;
    margin-bottom: 20px;
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

  #img{
    max-width: 150px;
  }

  .searchResults {
    background-color: lightgray;
    border-radius: 10px;
    width: 80%; 
    max-width: 800px; 
    margin: 0 auto; 
    padding: 20px; 
}

  
  </style>
  