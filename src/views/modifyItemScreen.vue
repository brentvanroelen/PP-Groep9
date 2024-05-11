<template>
  <h1>Modify item</h1>
  <adminSearchBarAddItem/>
  <div class="modifyItems">
      <div v-for="(item, index) in items" :key="index" class="item">
          <h2>{{ item.Name }}</h2>
          <img :src="item.Image" alt="Item Image">
          <p>{{ item.Description }}</p>
      </div>
  </div>

  <div class="buttons">
      <button class="buttonsClass">
          <router-link class="link" to="/addKitScreen"> Add to selected kit</router-link>
      </button>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import adminSearchBarAddItem from '../components/adminSearchBarAddItem.vue';
  import { collection, getFirestore, query, getDocs } from 'firebase/firestore';

  const db = getFirestore();
  const items = ref([]);

  onMounted(async () => {
      await fetchItems();
  });

  const fetchItems = async () => {
      const itemCollection = collection(db, 'Items');
      const itemSnapshot = await getDocs(itemCollection);
      const itemsData = [];
      itemSnapshot.forEach((doc) => {
          itemsData.push(doc.data());
      });
      items.value = itemsData;
  };
</script>

<style>
  #SearchBar {
      margin-top: 20px;
      margin-bottom: 40px;
      justify-content: center;
  }

  .modifyItems {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
  }

  .item {
      width: calc(33.33% - 10px); /* 33.33% minus margin */
      margin-bottom: 20px;
      /* You can add more styling as needed */
  }

  .buttonsClass {
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

  .buttons {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      margin-bottom: 20px;
  }
</style>
