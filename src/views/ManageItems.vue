<template>
    <h1>Manage Items</h1>
    <SearchBarAdmin></SearchBarAdmin>

    <div class="items-grid">
        <div v-for="(item, index) in items" :key="index" class="item">
            <div class="icons">
                <!-- <router-link class="link" to="/checkPage">
                    <img class="icon" src="/src/assets/552871.png" alt="">
                </router-link> -->
                <router-link :to="{ path: '/changeItemInfo', query: { item: JSON.stringify(item) } }" class="link">
                    <img src="/src/assets/edit-icon-2048x2048-6svwfwto.png" alt="" class="icon">
                 </router-link>                
                <!-- <ul><img src="/src/assets/edit-icon-2048x2048-6svwfwto.png" alt=""></ul> -->
                <ul @click="deleteItem(item)">
                    <img src="/src/assets/trash.png" alt="">
                </ul>
            </div>
            <h2>{{ item.Name }}</h2> 
            <img :src="item.Image" alt="Item Image">
            <p>{{ item.Description }}</p>
        </div>
    </div>

    <div class="buttons">
        <button class="buttonsClass">
            <router-link class="link" to="/modifyItemScreen">Add new kit</router-link>
        </button>
        <button class="buttonsClass">
            <router-link class="link" to="/addItemsScreen">Add item</router-link>
        </button>
    </div>
</template>

<script setup>
import SearchBarAdmin from '../components/SearchBarAdmin.vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getFirestore, query, getDocs } from 'firebase/firestore';
import { useKitItems } from '@/Pinia/Store';
import { useStore } from '@/Pinia/Store';
import { doc, deleteDoc } from 'firebase/firestore';


const router = useRouter();
const db = getFirestore();
const items = ref([]);
const selectedItems = ref([]);
const kitItems = useKitItems();
const store = useStore();

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


const deleteItem = async (item) => {
  if (!item || !item.id) {
    console.error('Item or item id is undefined:', item);
    return;
  }}

</script>

<style scoped>
.icon {
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  display: inline-block !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 50px; 
  height: 16px; 
}
.link, .icon {
  background: none !important;
  box-shadow: none !important;
  border: none !important; 
  display: inline-block !important;
  margin: 0 !important; 
  padding: 0 !important; 
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
.link, .icon {
  background: none !important;
  box-shadow: none !important;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    justify-content: center; 
    margin-top: 20px;
    margin-bottom: 20px;
}

.item {
    border: 1px solid #ccc;
    padding: 24px; 
    border-radius: 8px;
    margin-left: 100px;
    text-align: center;
    background-color: #f9f9f9; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    position: relative; /* Needed for absolute positioning of icons */
}

.item h2 {
    font-size: 1.5em; 
}

.item img {
    max-width: 100%; 
    height: auto;
    margin-bottom: 10px;
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
}
</style>
