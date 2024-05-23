<template>
  <div>
    <h1>Change Item Information</h1>
    <textarea v-model="description" placeholder="Description"></textarea>
    <button @click="updateItem">Update Item</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { db, updateDoc, doc } from "../Firebase/Index.js";

const route = useRoute();
const item = ref(null);
const description = ref('');

const updateItem = async () => {
  if (!item.value) {
    console.error('No item to update.');
    return;
  }

  try {
    const itemData = item.value;

    if (!itemData.hasOwnProperty('Description')) {
      console.error('Description property is missing in the item data.');
      return;
    }

    const descriptionToUpdate = itemData.Description;

    if (descriptionToUpdate === description.value) {
      console.log('Description is unchanged. No update needed.');
      return;
    }

    const { Name } = itemData;

    if (!Name) {
      console.error('Invalid item name.');
      return;
    }

    const itemNameWithCapitalizedFirstLetter = Name.charAt(0).toUpperCase() + Name.slice(1);
    const itemDocRef = doc(db, `Items/${itemNameWithCapitalizedFirstLetter}`);
    
    
    
    await updateDoc(itemDocRef, {
      Description: description.value
    });

    console.log('Item updated successfully.');
  } catch (error) {
    console.error('Error updating item:', error);
  }
};

const fetchItemData = () => {
  const itemData = route.query.item ? JSON.parse(route.query.item) : null;
  if (itemData) {
    item.value = itemData;
    description.value = itemData.Description || '';

    console.log('Item received:', item.value);
    console.log('Name:', itemData.Name);
  } else {
    console.error('No item data received.');
  }
};
fetchItemData();
</script>
