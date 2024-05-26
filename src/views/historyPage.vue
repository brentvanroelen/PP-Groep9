<template>
  <div>
    <h1>Item History</h1>
    <div class="history-container" v-if="hasIssues">
      <ul>
        <li v-for="(issue, key) in issueHistory" :key="key" class="issue-item">
          <h3>Issue {{ key }}</h3>
          <p><strong>Description:</strong> {{ issue.description }}</p>
          <p><strong>Type:</strong> {{ issue.type }}</p>
          <img v-if="issue.image" :src="issue.image" alt="Issue image" class="issue-image">
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No item history</p>
    </div>
    <router-link class="link" to="/ManageItems">
      <button class="btn">Back</button>
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db, doc, getDoc } from "../Firebase/Index.js"; // Use the correct Firebase functions

const item = ref(null);
const route = useRoute();
const issueHistory = ref({});
const hasIssues = ref(false);

onMounted(async () => {
  const itemData = route.query.item ? JSON.parse(route.query.item) : null;
  if (itemData) {
    item.value = itemData;
    console.log('Item received:', item.value);
    await fetchItem(item.value.Serial);
  } else {
    console.error('No item data received.');
  }
});

const fetchItem = async (Serial) => {
  try {
    const itemName = item.value.Name ? item.value.Name.charAt(0).toUpperCase() + item.value.Name.slice(1) : '';
    const itemBundleName = `${itemName} items`;
    const docRef = doc(db, `Items/${itemName}/${itemBundleName}/${Serial}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const itemData = docSnap.data();
      console.log('Document data:', itemData);

      if (itemData.Issues) {
        issueHistory.value = itemData.Issues;
        hasIssues.value = true;
      } else {
        hasIssues.value = false;
      }
    } else {
      console.log('No such document!');
      hasIssues.value = false;
    }
  } catch (error) {
    console.error('Error fetching item:', error);
    hasIssues.value = false;
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

.history-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  margin: 20px auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.issue-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.issue-item:last-child {
  border-bottom: none;
}

.issue-image {
  max-width: 100%;
  margin-top: 10px;
  border-radius: 4px;
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
  margin-top: 20px;
}

.btn:hover {
  background-color: #0056b3;
}

.link {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
