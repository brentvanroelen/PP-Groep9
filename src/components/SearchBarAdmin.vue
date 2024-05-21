<template>
  <div class="search-bar">
    <input type="text" v-model="querystring" @keyup.enter="search" placeholder="Search">
    <button @click="search">Search</button>
  </div>

  <div v-if="results.length > 0" class="items-grid">
    <div v-for="(item, index) in results" :key="index" class="item">
      <div class="icons">
        <router-link :to="{ path: '/checkPage', query: { serialNumber: item.Serial, item: JSON.stringify(item) } }" class="link">
          <img src="/src/assets/552871.png" alt="" class="icon">
        </router-link>
        <img src="/src/assets/edit-icon-2048x2048-6svwfwto.png" alt="" class="icon">
        <img src="/src/assets/trash.png" alt="" class="icon" @click="deleteItem(index)">
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
import { getDocs, query, where, collection, deleteDoc, doc } from 'firebase/firestore';
import { ref } from 'vue';
import { useStore } from '@/Pinia/Store.js';
import { db } from '../Firebase/Index.js';
import { useSearchedItems as useSearchedItemsFunction } from '@/Pinia/Store.js';

const useSearchedItems = useSearchedItemsFunction();

const querystring = ref('');
const store = useStore();
const results = ref([]);
let generalItem;

const search = async () => {
  console.log(querystring.value);
  store.updateResults([]);
  await querySnapshot1().then(() => {
    querySnapshot2();
  });

  store.updateResults(results.value);
  console.log(results.value);
};
const deleteItem = async (index) => {
  const itemToDelete = results.value[index];
  console.log('Item to delete:', itemToDelete);
  try {
    await deleteDoc(doc(db,`Items/${
        generalItem.Name.charAt(0).toUpperCase() + generalItem.Name.slice(1)
      }/${generalItem.Name.charAt(0).toUpperCase() + generalItem.Name.slice(1)} items/`
    ),
    where('Serial', '==', querystring.value)
  ); 
    results.value.splice(index, 1);
    console.log('Item deleted successfully');
  } catch (error) {
    console.error('Error removing document: ', error);
  }
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
      }/${generalItem.Name.charAt(0).toUpperCase() + generalItem.Name.slice(1)} items/`
    ),
    where('Serial', '==', querystring.value)
  );
  const snapshot = await getDocs(itemQuery2);
  snapshot.forEach((doc) => {
    results.value.push({ id: doc.id, ...doc.data() });
  });
  console.log(results.value);
};
</script>

<style scoped>
.icon-img {
  width: 20px;
  height: 20px;
}
.link, .icon {
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  display: inline-block !important;
  margin: 0 !important;
  padding: 0 !important;
}
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

.icons ul img,
.icons .link img {
  width: 20px;
  height: 20px;
}
</style>