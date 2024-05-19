<template>
  <div class="search-bar">
    <input type="text" v-model="querystring" @keyup.enter="search" placeholder="Search">
    <button @click="search" @change="addSearchedItem" >Search</button>
  </div>

  <div v-if="results.length > 0" class="items-grid">
    <div v-for="(item, index) in results" :key="index" class="item" >
      <div class="icons">
        <router-link :to="{ path: '/checkPage', query: { serialNumber: item} }" class="link">
    <img src="/src/assets/552871.png" alt="">
    </router-link>
    <ul>
  <img src="/src/assets/edit-icon-2048x2048-6svwfwto.png" alt=""></ul>
        <ul><img src="/src/assets/trash.png" alt=""></ul>
      </div>
      <h2>{{ item.Name }}</h2>
      <h3>{{ item.Serial }}</h3>
      <img :src="item.Image" alt="Item Image" id="img">
      <p>{{ item.Description }}</p>
    </div>
  </div>

  <div v-else>
    No results found.
  </div>
</template>

<script setup>
import { getDocs, query, where, collection, orderBy } from 'firebase/firestore';
import { ref } from 'vue';
import { useStore } from '@/Pinia/Store.js';
import { db } from '../Firebase/Index.js'; // Make sure to update this path if it's different
import { useSearchedItems as useSearchedItemsFunction } from '@/Pinia/Store.js';



const useSearchedItems = useSearchedItemsFunction();

const querystring = ref('');
const store = useStore();
const results = ref([]);
const reservations = ref([]);
let generalItem;

const props = defineProps({
  page: String,
  class: String
});



const search = async () => {
  if(props.page === 'HomeAdmin') {
    searchAdmin();
  } else {
    console.log(querystring.value);
    store.updateResults([]);
    await querySnapshot1().then(() => {
      querySnapshot2();
    });

    store.updateResults(results.value);
    console.log(results.value);
    addSearchedItem();


    const addSearchedItem = () => {
      useSearchedItems.addSearchedItem(results.value);
      const searchedItem = results.value;
      console.log(searchedItem);
    }
	}

} 
const searchAdmin = async () => {
  const cref = collection(db, 'Utility/Reservations/All Reservations');
  const qref = query(cref, where('allItemSerials', 'array-contains-any', [querystring.value]));
  const docs = await getDocs(qref);
  docs.forEach((doc) => {
    reservations.value.push(doc.data());
  });
  console.log(reservations.value);
};




const querySnapshot1 = async () => {
  const itemQuery1 = query(
    collection(db, 'Items'),
    where('SerialSeries', '==', querystring.value.split('-')[0])
  );
  const doc = await getDocs(itemQuery1);
  doc.forEach((doc) => {
    generalItem = doc.data();
  });
  return generalItem;
};

const querySnapshot2 = async () => {
  const itemQuery2 = query(
    collection(
      db,
      `Items/${
        generalItem.Name.charAt(0).toUpperCase() + generalItem.Name.slice(1)
      }/${generalItem.Name.charAt(0).toUpperCase() + generalItem.Name.slice(
        1
      )} items/`
    ),
    where('Serial', '==', querystring.value)
  );
  const doc = await getDocs(itemQuery2);
  doc.forEach((doc) => {
    results.value.push(doc.data());
  });
  console.log(results.value);
};
</script>

<style scoped>
.search-bar {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
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

#img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.items-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  min-height: 200px; 
}

.item {
  border: 1px solid #ccc;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.item h2 {
  font-size: 1.5em;
}

.item p {
  font-size: 1.1em;
}

.icons {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
}

.icons ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.icons ul img {
  width: 20px;
  height: 20px;
  background-color: transparent; 
  box-shadow: none; 
  
}
.icons ul .link img {
  background-color: transparent; 
  box-shadow: none; 
  
}






</style>
