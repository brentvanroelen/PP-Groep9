<template>
  <div class="report-page">
    <div class="item-info">
      <div class="item-details">

        <h1>{{ report.itemName}}</h1>
        <p>Serial Number: {{ report.itemSerial }}</p>
      </div>
    <!--  <div class="item-image">
      <img v-if="getImage(foto)" :src="foto.loadedImage" alt="Item Image" id="img" />
    </div> -->
    </div>

    <div class="issue-description">
      <label>Please clearly explain what the issue is:</label>
      <br>
      <textarea v-model="description" placeholder="Description:" class="textarea" rows="6"></textarea>
    </div>

    <div class="issue-description">
      <label>Please enter your name:</label>
      <br>
      <textarea v-model="userNames" class="textarea" rows="1" placeholder="Your name:"></textarea>
     

    </div>

    <div class="upload-section">
      <p>Feel free to add an image of the damage if necessary</p>
      <input id="file-input" type="file" @change="onFileChange" accept="image/*" class="file-input">
    </div>

    <div class="issue-type">
      <select v-model="selectedIssue" id="issuesdrop" class="select">
          <option disabled selected>Select an option</option>
          <option value="Item malfunction">Item malfunction</option>
          <option value="Item lost">Item lost</option>
          <option value="Damaged">Damaged</option>
          <option value="Other">Other</option>
        </select>

    </div>

    <div class="submit-button">
      <button class="btn" @click="submitFindings">Submit findings</button>
    </div>
  </div>
  <Popup v-if="popupVisible" :message="popupMessage" @close="popupVisible = false" />

</template>

<script setup>
import { useReportedItems } from '@/Pinia/Store';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db, doc, getDoc, updateDoc, where , collection , getDocs , query } from "../Firebase/Index.js";
import Popup from '@/components/Popup.vue';
import { imageGetter } from "../js/functions.js";
import { useStore , useDates , useTrigger , useChoiceOfItems } from '@/Pinia/Store.js';

const report = useReportedItems();


const item = report.itemName
const foto = report

const serial = report.itemSerial

const store = useStore();
const popupVisible = ref(false);
const popupMessage = ref('');

const showPopup = (message) => {
  popupMessage.value = message;
  popupVisible.value = true;
};



/* onMounted(() => {
  const itemData = route.query.item ? JSON.parse(route.query.item) : null;
  if (itemData) {
    item.value = itemData;
    
  } else {
    console.error('No item data received.');
  }
}); */

const description = ref('');
const selectedIssue = ref('');
const image = ref('');
const userNames = ref('');

const submitFindings = async () => {
  if (!item) {
    console.error('No item to report issue for.');
    return;
  }

  const issueData = {
    description: description.value,
    image: image.value,
    type: selectedIssue.value,
    user: userNames.value  
  };

  reportIssueToDatabase(issueData, serial)
    /* .then(() => {
      
      
      //checkAvailability(serial);
    }) */
    .catch(error => {
      console.error('Error reporting issue:', error);
    });}

  const getImage = async (foto) => {
      console.log(foto);
  
   if ( foto != undefined)  {
    await imageGetter(`ItemImages/${foto.itemImage}`).then((res) => {
      foto.loadedImage = res;
    });

    return true;
  } else {
    return false;
  }
};
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

const reportIssueToDatabase = async (issueData, serial) => {
  console.log('Serial:', serial);
  console.log('Issue Data:', issueData);
  try {
    if (!serial) {
      console.error('No item data available.');
      return;
    }

    //const itemName = item ? capitalizeWords(item) : '';
    const itemDocRef = doc(db, `Utility/History/Item History/${serial}`);

    // Fetch the current item document
    const itemDocSnapshot = await getDoc(itemDocRef);

    // Check if the document exists
    if (!itemDocSnapshot.exists()) {
      console.error(`No document found for serial: ${serial}`);
      return;
    }

    const itemData = itemDocSnapshot.data();

  

    // Determine the next issue number
    const currentIssues = itemData.Issues || {};
    const issueKeys = Object.keys(currentIssues);
    const nextIssueNumber = issueKeys.length + 1;
    const issueKey = `issue${nextIssueNumber}`;

    // Add the new issue to the Issues map
    const updatedIssues = {
      ...currentIssues,
      [issueKey]: issueData
    };

    // Update the document with the new Issues map and set availability to false if necessary
    const updateData = {
      Issues: updatedIssues,
      HasIssues: true
    };

    if (issueData.type === 'Item malfunction' || issueData.type === 'Damaged') {
      updateData.Available = false;
    }

    await updateDoc(itemDocRef, updateData);

    showPopup('Issue reported successfully!');
  } catch (error) {
    console.error('Error reporting issue:', error);
}};


/* const checkAvailability = async (Serial) => {

  try {
    const futureReservationArray = [];
    const reservationsRef = collection(db, 'Utility', 'Reservations', 'All Reservations');
    console.log(Serial)
    const q = query(reservationsRef, where('allItemSerials' ,'array-contains', Serial));

    
    // Log de query voor debugging
    
    
    const querySnapshot = await getDocs(q);

    // Log de querySnapshot voor debugging
   

    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    

    let hasFutureReservation = false;

    querySnapshot.forEach(doc => {
      const reservationData = doc.data();
      console.log('Reservation Data:', reservationData);
      const reservationDate = new Date();
      reservationDate.setDate(reservationData.StartDate);
      reservationDate.setMonth(reservationData.StartMonth);
      

      
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

 */




</script>

<style scoped>

body{
  font-family: 'Arial', sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
}
.report-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.report-page:hover{
  transform: translateY(-5px);
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  margin-bottom: 30px;
}

.item-details {
  flex: 2;
  margin-right: 20px;
  display:flex;
  flex-direction: column;
  justify-content: center;
}

.item-details h1 {
  margin: 0;
  font-size: 26px; 
  color: #333;
}

.item-details p {
  margin: 5px 0;
  color: #333;
}

.item-image{
  flex:1;
  text-align: right;
}
.item-image img {
  max-width: 100%; 
  height: auto;
  border-radius: 10px; 
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.issue-description{
  margin-bottom: 20px;
}

.issue-description label {
  font-weight: bold;
  color: #333;
}

.issue-description textarea {
  width: 100%; 
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: border-color 0.3s ease;
  resize: vertical;
  box-sizing: border-box;
}

.issue-description textarea:hover,
.issue-description textarea:focus {
  border-color: #900; 
}

.upload-section{
  text-align: center;
  margin-bottom: 20px;
}
.upload-section p {
  margin-bottom: 10px;
  color: #333;
}

.upload-section input[type="file"] {
  margin-top: 10px;
  margin-left: 250px;
  margin-right: auto;
  display: block; 
}


.submit-button {
  text-align: center;
  margin-top: 20px;
}

.submit-button button {
  padding: 10px 20px;
  background-color: #cd3545;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

.submit-button button:hover {
  background-color: #c82333; 
}
</style>
