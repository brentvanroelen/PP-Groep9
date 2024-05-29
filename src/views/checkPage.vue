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
  <Popup v-if="popupVisible" :message="popupMessage" @close="popupVisible = false" />
  <AvailabilityHandler :isKit="false" :page="page"></AvailabilityHandler>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db, doc, getDoc, updateDoc, where , collection , getDocs , query } from "../Firebase/Index.js";
import Popup from '@/components/Popup.vue';
import AvailabilityHandler from '@/components/AvailabilityHandler.vue';
import { useStore , useDates , useTrigger , useChoiceOfItems } from '@/Pinia/Store.js';

const page = "checkPage";   
const availableInstances = useChoiceOfItems();
const trigger = useTrigger();
const dates = useDates();
const store = useStore();
const popupVisible = ref(false);
const popupMessage = ref('');

const showPopup = (message) => {
  popupMessage.value = message;
  popupVisible.value = true;
};

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
    // user: 'current_user_id'  
  };

  reportIssueToDatabase(issueData, item.value.Serial)
    .then(() => {
      
      
      checkAvailability(item.value.Serial);
    })
    .catch(error => {
      console.error('Error reporting issue:', error);
    });}

const onFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    image.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const capitalizeWords = (str) => {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const reportIssueToDatabase = async (issueData, Serial) => {
  try {
    if (!item.value) {
      console.error('No item data available.');
      return;
    }

    const itemName = item.value.Name ? capitalizeWords(item.value.Name) : '';
    //console.log('Item name:', itemName);
    const itemBundleName = `${itemName} items`;
    //console.log('Item bundle name:', itemBundleName);
    const itemDocRef = doc(db, `Items/${itemName}/${itemBundleName}/${Serial}`);
    
    // Haal het huidige itemdocument op
    const itemDocSnapshot = await getDoc(itemDocRef);
    const itemData = itemDocSnapshot.data();

    console.log('Current item data:', itemData);

    // Bepaal het volgende issue nummer
    const currentIssues = itemData.Issues || {};
    const issueKeys = Object.keys(currentIssues);
    const nextIssueNumber = issueKeys.length + 1;
    const issueKey = `issue${nextIssueNumber}`;

    // Voeg het nieuwe issue toe aan de Issues map
    const updatedIssues = {
      ...currentIssues,
      [issueKey]: issueData
    };

    // Update het document met de nieuwe Issues map en zet beschikbaarheid op false indien nodig
    const updateData = {
      Issues: updatedIssues,
      HasIssues: true
    };

    if (issueData.type === 'Item malfunction' || issueData.type === 'Damaged') {
      updateData.Available = false;
    }

    await updateDoc(itemDocRef, updateData);

    console.log('Issue reported successfully and item availability updated.');
    showPopup('Issue reported successfully!');
  } catch (error) {
    console.error('Error reporting issue:', error);
  }
};


const checkAvailability = async (Serial) => {

  try {
    const futureReservationArray = [];
    const reservationsRef = collection(db, 'Utility', 'Reservations', 'All Reservations');
    console.log(Serial)
    const q = query(reservationsRef, where('allItemSerials' ,'array-contains', Serial));

    
    // Log de query voor debugging
    console.log('Query:', q);
    
    const querySnapshot = await getDocs(q);

    // Log de querySnapshot voor debugging
    console.log('Query Snapshot:', querySnapshot);

    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    console.log(`Today's date: ${today}`);

    let hasFutureReservation = false;

    querySnapshot.forEach(doc => {
      const reservationData = doc.data();
      console.log('Reservation Data:', reservationData);
      const reservationDate = new Date();
      reservationDate.setDate(reservationData.StartDate);
      reservationDate.setMonth(reservationData.StartMonth);
      console.log(`Reservation date: ${reservationDate}`);
      console.log(`Today's date: ${today}`);

      
      if (reservationDate > today){
        futureReservationArray.push(doc.data());
        console.log(futureReservationArray)
        hasFutureReservation = true;
      }
      
      
  });

    if (hasFutureReservation) {
      console.log('Dit item heeft een toekomstige reservering.');
      await issueResolver(futureReservationArray, item.value.Serial);
    } else {
      console.log('Dit item heeft geen toekomstige reservering.');
    }
  } catch (error) {
    console.error('Error checking availability:', error);
  }
};

const issueResolver = async (futureReservationArray, Serial) => {
   

    availableInstances.resetAllItems();
    availableInstances.createCollection(item.value.Name);
    store.updateResults([]);
    store.updateResults([item.value]);
    for(const reservation of futureReservationArray){
        dates.updateGeneralDates([reservation.StartDate, reservation.StartMonth, reservation.EndDate, reservation.EndMonth]);
        for(let i = 1 ; i <= reservation.allItemSerials.length ; i++){
          if( reservation[ `Item${i}`].Serial == Serial ){
            console.log(item.value)
            trigger.fireTrigger();

        
          }
        }
    }

}


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
