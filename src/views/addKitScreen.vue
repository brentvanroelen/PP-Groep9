<template>
    <div class="addKitScreen">
      <div class="inputKits">
        <SearchBarAdmin :page="'AddKit'"></SearchBarAdmin>
        <label for="number" class="labels">Number (optional): </label> <input type="number" name="" id="numberInput">
        <label for="kitDescription" class="labels">Kit description: </label><input type="text" name="" id="descriptionInput">
      </div>
      
      <div class="buttons">   
        <button class="buttonsClass">Add more items</button>
        <div class="fileInputWrapper">
          <input type="file" name="file" id="file">
          <button class="buttonsClass">Upload IMG</button>
        </div>
      </div>
      
      <div class="items highlighted">
        <div v-for="(item, index) in selectedItems" :key="index" class="item">
          <div class="itemPanel"><h2>{{ item.Name }}</h2>
          <img :src="item.Image" alt="Selected Item Image">
          <p>{{ item.Description }}</p>
          <button @click="removeItem(index)">Remove</button></div>
        </div>
      </div>
      
      <button class="buttonsClass largerButton" @click="addKit">Add Kit</button>
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, query, getDocs,db, where } from '../Firebase/Index.js';
import { useKitItems } from '@/Pinia/Store';
import SearchBarAdmin from '@/components/SearchBarAdmin.vue';
import { imageGetter } from '@/js/functions.js';

const kitItems = useKitItems();
const router = useRouter();
const selectedItems = ref(kitItems.selectedItems);
let kitName = ref('');
  
  
const removeItem = (index) => {
  selectedItems.value.splice(index, 1);
};
  
 
const route = router.currentRoute.value;
if (route.query.items) {
  selectedItems.value = route.query.items;
}
const addKit = async () => {
  const kitsCollection = collection(db, 'Kits');
  const query = query(collection(db, 'Kits'),where('Name', '==', kitName));
  const querySnapshot = await getDocs(query);
  if(querySnapshot.size > 0){
    
  }
  const kitDescription = document.getElementById('descriptionInput').value;
  const number = document.getElementById('numberInput').value;
  const items = selectedItems.value;
  const kit = {
    Name: kitName,
    Description: kitDescription,
    Number: number,
    Items: items,
  };
  await kitsCollection.add(kit);
  router.push('/kits');
};
onMounted(() => {
  for (let item of selectedItems.value){
    imageGetter(`ItemImages/${item.Image}`).then((res) => {
      item.Image = res;
    })
  }
});

</script>
  

  


<style scoped>


.addKitScreen {
    width: 100%;
    height: 100%;
    background-attachment: fixed;
    background-size: cover;
    margin: 0; 
    padding: 0; 
}

.buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    margin-bottom: 20px;
}

.buttonsClass {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    display: flex;
    justify-content: space-around;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
}

.inputKits {
    margin-left: 40px;
    margin-top: 20px;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: left;
    margin-top: 20px;
    margin-bottom: 20px;
}

.labels {
    margin: 10px;
}

.items {
    
    width: auto; 
    height: 200px; 
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}

.item{
    width: 200px;
    height: 200px;
    margin: 10px;
    background-color: grey;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}

.fileInputWrapper {
    display: flex;
    align-items: center;
}

.fileInputWrapper input[type="file"] {
    margin-right: 10px;
    
}

.largerButton {
    padding: 15px 25px; 
}


</style>