<template>
    <div class="search-bar">
    <input type="text" v-model="querystring" @keyup.enter="search" placeholder="Search">
    <button @click="search">Search</button>
  </div>
  </template>
  
  <script setup>
    import { getDocs, getFirestore } from 'firebase/firestore';
    import {ref} from '../main.js'
    import {Firestore,collection,orderBy,where,db,query,startAt,endAt} from '../Firebase/Index.js'
    import router from '@/router';
    import { useStore } from '../main.js';
    import ItemScreen from '@/views/ItemScreen.vue';

    const querystring = ref('');
    const store = useStore();

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
      store.updateResults(results);
      router.push({name: "productscreen"})

      
      
    };
  </script>
  

  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    margin-top: 0%;
    
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
  
  </style>
  