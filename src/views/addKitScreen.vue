<template>
    <div class="addKitScreen">
      <div class="inputKits">
        <label for="kitName" class="labels">Kit name: </label><input type="text" name="" id="kitNameInput">
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
          <h2>{{ item.Name }}</h2>
          <img :src="item.Image" alt="Selected Item Image">
          <p>{{ item.Description }}</p>
          <button @click="removeItem(index)">Remove</button>
        </div>
      </div>
      
      <button class="buttonsClass largerButton">Add Kit</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { collection, getFirestore, query, getDocs } from 'firebase/firestore';

  
  
  const db = getFirestore();
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
  
  const router = useRouter();
  const selectedItems = ref([]);
  
  
  const removeItem = (index) => {
    selectedItems.value.splice(index, 1);
  };
  
 
  const route = router.currentRoute.value;
  if (route.query.items) {
    selectedItems.value = route.query.items;
  }
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