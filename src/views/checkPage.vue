<template>
  <div>
    <h1>Report Issue</h1>
    <div class="form">
      <div class="form-group">
        <textarea v-model="description" placeholder="Description:" class="textarea"></textarea>
      </div>
      <hr>
      <div class="form-group">
        <input id="file-input" type="file" @change="onFileChange" accept="image/*" class="file-input">
      </div>
      <div class="form-group">
        <select v-model="selectedIssue" id="issuesdrop" class="select">
          <option disabled selected>Select an option</option>
          <option value="Item malfunction">Item malfunction</option>
          <option value="Item lost">Item lost</option>
          <option value="Damaged">Damaged</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <button class="btn" @click="submitFindings">Submit findings</button>
      </div>
      
    </div>
    <router-link class="link" to="/ManageItems"><button class="btn">Back</button></router-link>
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

.file-input {
  width: calc(100% - 10px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.select {
  width: calc(100% - 10px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  /* appearance: none; */
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
