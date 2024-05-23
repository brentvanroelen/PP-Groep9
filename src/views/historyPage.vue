<template>
  <h1>Item history</h1>

  <div v-if="hasIssues">
    <!-- <h2>Item History:</h2> -->
    <ul>
      <li v-for="(issue, index) in issueHistory" :key="index">
        <p>Description: {{ issue.description }}</p>
        <p>Type: {{ issue.type }}</p>
        <img v-if="issue.image" :src="issue.image" alt="Issue image">
      </li>
    </ul>
  </div>
  <div v-else>
    <p>No item history</p>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db, doc, getDoc } from "../Firebase/Index.js"; // Gebruik de juiste Firebase-functies

const item = ref(null);
const route = useRoute();
const issueHistory = ref([]);
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
    //const itemType = item.value.Category?.toLowerCase();
    const itemBundleName = `${itemName} items`;
    const docRef = doc(db, `Items/${itemName}/${itemBundleName}/${Serial}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const itemData = docSnap.data();
      console.log('Document data:', itemData);

      if (itemData.Issues) {
        issueHistory.value.push(itemData.Issues);
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

