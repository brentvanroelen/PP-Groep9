<template>
  <div>
    <h1>Report issue</h1><br>
    <textarea v-model="description" placeholder="Description:"></textarea><br>
    <hr>
    <input type="file" @change="onFileChange" accept="image/*"><br>
    <select v-model="selectedIssue" id="issuesdrop">
      <option disabled selected>Select an option</option>
      <option value="Item malfunction">Item malfunction</option>
      <option value="Item lost">Item lost</option>
      <option value="Damaged">Damaged</option>
      <option value="Other">Other</option>
    </select><br>
    <button @click="submitFindings">Submit findings</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db, doc, updateDoc } from "../Firebase/Index.js";

const route = useRoute();
const item = ref(null);

onMounted(() => {
  const itemData = route.query.item ? JSON.parse(route.query.item) : null;
  if (itemData) {
    item.value = itemData;
    console.log('Item received:', item.value);
  } else {
    console.error('No item data received.');
  }
});

const description = ref('');
const selectedIssue = ref('');
const image = ref('');

const submitFindings = async () => {
  if (!item.value) {
    console.error('No item to report issue for.');
    return;
  }

  const issueData = {
    description: description.value,
    image: image.value,
    type: selectedIssue.value,
    //user: 'current_user_id'  // Add logic to fetch the current user id
  };

  await reportIssueToDatabase(issueData, item.value.Serial);
  //await fetchIssueHistory(item.value.Serial);
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    image.value = reader.result;
  };
  reader.readAsDataURL(file);
};
const reportIssueToDatabase = async (issueData, Serial) => {
  try {
    if (!item.value) {
      console.error('No item data available.');
      return;
    }

    const itemName = item.value.Name ? item.value.Name.charAt(0).toUpperCase() + item.value.Name.slice(1) : '';
    //const itemType = item.value.Category?.toLowerCase();
    const itemBundleName = `${itemName} items`;
    const itemDocRef = doc(db, `Items/${itemName}/${itemBundleName}/${Serial}`);

    await updateDoc(itemDocRef, {
      Issues: issueData,
      HasIssues: true
    });

    console.log('Issue reported successfully.');
  } catch (error) {
    console.error('Error reporting issue:', error);
  }
};

</script>

<style scoped>
/* Add your styles here */
</style>
