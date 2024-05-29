<template>
  <div>
    <h1>Item History</h1>
        
    <div class="history-container" v-if="hasIssues">
  <h2>Issues</h2>
  <ul>
    <li v-for="key in sortedIssueKeys" :key="key" class="issue-item">
      <h3>{{ key }}</h3>
      <p><strong>Description:</strong> {{ issueHistory[key].description }}</p>
      <p><strong>Type:</strong> {{ issueHistory[key].type }}</p>
      <img v-if="issueHistory[key].image" :src="issueHistory[key].image" alt="Issue image" class="issue-image">
    </li>
  </ul>
</div>

    <div class="history-container" v-if="hasReservations">
      <h2>Reservations</h2>
      <ul>
        <li v-for="(reservation, index) in reservationHistory" :key="index" class="reservation-item">
          <h3>Reservation {{ index + 1 }}</h3>
          <p><strong>User:</strong> {{ reservation.UserFirstName }} {{ reservation.UserLastName }}</p>
          <p><strong>Start Date:</strong> {{ reservation.StartDate }}/{{ reservation.StartMonth }}</p>
          <p><strong>End Date:</strong> {{ reservation.EndDate }}/{{ reservation.EndMonth }}</p>
          <!-- If you want to display item image -->
          <!-- <img v-if="reservation.ItemImage" :src="reservation.ItemImage" alt="Item image" class="reservation-image"> -->
        </li>
      </ul>
    </div>

    <!-- Display DateAdded for instance item -->
    <div class="history-container" v-if="addedItem">
      <h2>Date Added (Instance)</h2>
      <p><strong>Date Added:</strong> {{ addedItem }}</p>
    </div>

    <!-- Display DateAdded for general item -->
    <div class="history-container" v-if="addedItem && !item.Serial">
      <h2>Date Added (Item)</h2>
      <p><strong>Date Added:</strong> {{ addedItem }}</p>
    </div>

    <router-link class="link" to="/ManageItems">
      <button class="btn">Back</button>
    </router-link>
  </div>
</template>




<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { db, doc, getDoc, collection, query, where, getDocs } from "../Firebase/Index.js"; // Use the correct Firebase functions

const item = ref(null);
const route = useRoute();
const issueHistory = ref({});
const hasIssues = ref(false);
const reservationHistory = ref([]);
const hasReservations = ref(false);
const addedItem = ref(null);



onMounted(async () => {
  const itemData = route.query.item ? JSON.parse(route.query.item) : null;
  if (itemData) {
    item.value = itemData;
    console.log('Item received:', item.value);
    if (item.value.Serial) {
      await fetchItem(item.value.Serial);
      await fetchInstanceItemData(item.value.Serial);
    } else {
      await fetchGeneralItem(item.value.Name);
    }
    await fetchReservations(item.value.Serial);
  } else {
    console.error('No item data received.');
  }
});

const formatItemName = (itemName) => {
  // Capitalize the first letter of the itemName
  const capitalizedItemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
  
  // Check if itemName includes a space
  const spaceIndex = itemName.indexOf(' ');
  if (spaceIndex !== -1) {
    // Split the itemName into words
    const words = capitalizedItemName.split(' ');
    // Capitalize each word after the space
    for (let i = 1; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    // Join the words back together with a space
    return words.join(' ');
  } else {
    // If no space, simply return the capitalizedItemName
    return capitalizedItemName;
  }
};


const formatItemBundleName = (itemName) => {
  // Capitalize the first letter of the itemName
  const capitalizedItemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
  
  // Check if itemName includes a space
  const spaceIndex = itemName.indexOf(' ');
  if (spaceIndex !== -1) {
    // Split the itemName into words
    const words = capitalizedItemName.split(' ');
    // Capitalize each word after the space
    for (let i = 1; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    // Join the words back together with a space
    return words.join(' ') + ' items'; // Add ' items' in lowercase
  } else {
    // If no space, simply append ' items' in lowercase
    return capitalizedItemName + ' items';
  }
};

const fetchInstanceItemData = async (Serial) => {
  try {
    const itemName = formatItemName(item.value.Name); // itemName invoeren
    const itemBundleName = formatItemBundleName(itemName);
    console.log(itemBundleName);
    const docRef = doc(db, `Items/${itemName}/${itemBundleName}/${Serial}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const itemData = docSnap.data();
      console.log('Document data:', itemData);

      if (itemData.DateAdded) {
        addedItem.value = itemData.DateAdded;
      }
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error fetching instance item data:', error);
  }
};

const fetchItem = async (Serial) => {
  try {
    const itemName = formatItemName(item.value.Name); // itemName invoeren
    const itemBundleName = formatItemBundleName(itemName);
    console.log(itemBundleName);
    console.log(Serial);
    console.log(itemName);
    const docRef = doc(db, `Items/${itemName}/${itemBundleName}/${Serial}`);
    console.log(docRef);
    
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const itemData = docSnap.data();
      if (itemData.Issues) {
        console.log('Issues:', itemData.Issues);
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


const fetchReservations = async (Serial) => {
  try {
    const q = query(collection(db, 'Utility/Reservations/All Reservations'));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const reservations = querySnapshot.docs.map(doc => doc.data());

      reservationHistory.value = reservations.filter(reservation => {
        return Object.values(reservation).some(item => item.Serial === Serial);
      });

      reservationHistory.value.reverse();

      hasReservations.value = reservationHistory.value.length > 0;
    } else {
      console.log('No reservations found for this item.');
      hasReservations.value = false;
    }
  } catch (error) {
    console.error('Error fetching reservations:', error);
    hasReservations.value = false;
  }
};


const sortedIssueKeys = computed(() => {
  return Object.keys(issueHistory.value).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });
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
