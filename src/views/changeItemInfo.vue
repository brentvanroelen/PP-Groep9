<template>
  <div>
    <h1>Change Item Information</h1>
    <div class="form">
      <!-- <div class="form-group">
        <input v-model="name" type="text" placeholder="Name" class="input-text">
      </div> -->
      <div class="form-group">
        <input v-model="category" type="text" placeholder="Category" class="input-text">
      </div>
      <div class="form-group">
        <input v-model="brand" type="text" placeholder="Brand" class="input-text">
      </div>
      <div class="form-group">
        <textarea v-model="description" placeholder="Description" class="textarea"></textarea>
      </div>
      <div class="form-group">
        <button class="btn" @click="updateItem">Update Item</button>
      </div>
    </div>
    <router-link class="link" to="/ManageItems"><button class="btn">Back</button></router-link>
    <div>Last Updated: {{ lastUpdated }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db, updateDoc, doc } from "../Firebase/Index.js";
import Popup from '@/components/Popup.vue';

const route = useRoute();
const item = ref(null);
const name = ref('');
const category = ref('');
const brand = ref('');
const description = ref('');
const lastUpdated = ref('');
const popupVisible = ref(false);
const popupMessage = ref('');




const showPopup = (message) => {
 
//window.location.reload();
popupMessage.value = message;
popupVisible.value = true;
};

const updateItem = async () => {
  if (!item.value) {
    console.error('No item to update.');
    return;
  }

  try {
    const itemData = item.value;

    const { Name } = itemData;

    if (!Name) {
      console.error('Invalid item name.');
      return;
    }

    const itemNameWithCapitalizedFirstLetter = Name.charAt(0).toUpperCase() + Name.slice(1);
    const itemDocRef = doc(db, `Items/${itemNameWithCapitalizedFirstLetter}`);
    
    await updateDoc(itemDocRef, {
      //Name: name.value,
      Category: category.value,
      Brand: brand.value,
      Description: description.value,
      lastUpdated: new Date().toLocaleString() // Update lastUpdated with local time
    });

    
    showPopup('Item updated successfully.');  
    lastUpdated.value = new Date().toLocaleString(); // Update lastUpdated locally
  } catch (error) {
    console.error('Error updating item:', error);
  
  }

 
};

const fetchItemData = () => {
  const itemData = route.query.item ? JSON.parse(route.query.item) : null;
  if (itemData) {
    item.value = itemData;
    name.value = itemData.Name || '';
    category.value = itemData.Category || '';
    brand.value = itemData.Brand || '';
    description.value = itemData.Description || '';
    lastUpdated.value = itemData.lastUpdated || '';

    
  } else {
    console.error('No item data received.');
  }
};

onMounted(() => {
  fetchItemData();
});
</script>



<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
  margin: 0;
  padding: 0;
}

h1 {
  color: #444;
  text-align: center;
  margin-bottom: 30px;
}

.form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  margin: 20px auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.textarea {
  width: calc(100% - 10px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 100px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 4px;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
