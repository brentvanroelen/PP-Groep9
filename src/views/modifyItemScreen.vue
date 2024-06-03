<template>
    <h1>Modify item</h1>
    <adminSearchBarAddItem/>
    <div class="buttons">
        <button class="buttonsClass" @click="addToSelectedKit">
            Add to selected kit
        </button>
    </div>
    <div class="modifyItems">
        <div v-for="(item, index) in items" :key="index" class="item">
            <h2>{{ item.Name }}</h2>
            <img :src="item.loadedImage" alt="Item Image">
            <p>{{ item.Description }}</p>
            <input v-if="item.Image != undefined" type="checkbox" v-model="selectedItems" :value="item" class="item-checkbox">

        </div>
    </div>

  </template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import adminSearchBarAddItem from '../components/adminSearchBarAddItem.vue';
import { collection, getFirestore, query, getDocs } from 'firebase/firestore';
import { useKitItems } from '@/Pinia/Store';
import { useStore } from '@/Pinia/Store';
import { imageGetter } from '@/js/functions';
  
const router = useRouter();
const db = getFirestore();
const items = ref([]);
const selectedItems = ref([]);
const kitItems = useKitItems();
const store = useStore();
  
onMounted(async () => {
    kitItems.selectedItems = [];
    await fetchItems();
    for (let item of items.value){
        imageGetter(`ItemImages/${item.Image}`).then((res) => {
            item.loadedImage = res;
        })
    }console.log(items.value)
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
  
const addToSelectedKit = () => {
    for(let item of selectedItems.value){
        console.log(item)
    }
    kitItems.addItem(selectedItems.value);
    console.log(kitItems.selectedItems);
    router.push({ path: '/addKitScreen'});
};

const isSelected = (item) => {
  return selectedItems.value.includes(item);
};

</script>

<style>
  #SearchBar {
      margin-top: 20px;
      margin-bottom: 40px;
      justify-content: center;
  }
  .item {
    width: calc(33.33% - 10px);
    margin-bottom: 20px;
    background-color: white; /* Voeg deze regel toe */
    /* Overige stijlen */
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
