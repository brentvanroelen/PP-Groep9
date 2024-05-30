<template>
  <button @click="log">Test</button>
  <template v-for="(cancellableReservation, index) in displayReservations[0]" :key="index+10000">
    <div class="product1" v-if="!cancelledReservations.includes(cancellableReservation)">
      <div class="kolom1">
        <p>Serial: {{ cancellableReservation.id }}</p>
        <div class="actions">
          <!-- Dit moet nog aangepast worden, dit gaat misschien weg -->
          <!-- <button @click="reservationReturnedOrCanceled(cancellableReservation); cancelRes(cancellableReservation)">
            Cancel Reservation
          </button> -->
          <button @click="toggleReservationDetails(index+10000)">See Items</button>
        </div>
        <div v-if="isReservationVisible(index+10000)" class="reservation-details">
          <ul>
            <li v-for="(item, index) in getItems(cancellableReservation)" :key="index" class="reservation-item">
              <img :src="item.ItemImage" alt="picture">
              Name: {{ item.ItemName }}
              <br>
              Serial number: {{ item.Serial }}
              <div class="actions">
                <button>
                  <router-link v-if="cancellableReservation.id != undefined" class="link" :to="{ name: 'ExtensionPage', query: { reservationId: cancellableReservation.id }}">Request extension</router-link>
                </button>
                <button @click="getReportedItems">
                  <router-link class="link" to="/ReportIssue">Report Issue</router-link>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="kolom4">
        <p>{{ cancellableReservation.StartDate }}/{{ cancellableReservation.StartMonth }}/{{ year }}</p>
        <p>{{ cancellableReservation.EndDate }}/{{ cancellableReservation.EndMonth }}/{{ year }}</p>
      </div>
    </div>
  </template>
  <div v-for="(reservation, index) in displayReservations[1]" :key="index" class="product1">
    <div class="kolom1">
      <p>Serial: {{ reservation.id }}</p>
      <div class="actions">
        <button @click="toggleReservationDetails(index)">See Items</button>
      </div>
      <div v-if="isReservationVisible(index)" class="reservation-details">
        <ul>
          <li v-for="(item, index) in getItems(reservation)" :key="index" class="reservation-item">
            <img :src="item.ItemImage" alt="picture">
            Name: {{ item.ItemName }}
            <br>
            Serial number: {{ item.Serial }}
            <div class="actions">
              <button>
                <router-link class="link" to="/ExtensionPage">Request singular extension</router-link>
              </button>
              <button @click="getReportedItems(item)">
                <router-link class="link" to="/ReportIssue">Report Issue</router-link>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="kolom4">
      <p>{{ reservation.StartDate }}/{{ reservation.StartMonth }}/{{ year }}</p>
      <p>{{ reservation.EndDate }}/{{ reservation.EndMonth }}/{{ year }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { db, collection,query, getDocs,where,doc } from "../Firebase/Index.js";
import { reservationReturnedOrCanceled } from "../js/functions.js";
import { useUserIdentification, useReportedItems } from "@/Pinia/Store.js";
import axios from 'axios';

const report = useReportedItems();



let cancelledReservations = ref([]);
let reservations = ref([]);
let cancellableReservations = ref([]);
const year = ref(new Date().getFullYear());
const user = useUserIdentification();
let startDate = ref(new Date());
const visibleReservations = ref({});


const displayReservations = computed(() => {
  let test = cancellableReservationsCalc();
  let array = [test[0], test[1]];
  return array;
});
const arrayifier = computed(() => {
  let array = [];
  for (let reservation of reservations.value){
      console.log(reservations.value)
      for (let i = 1; i <= 10; i++){
          if (reservation[`Item${i}`] != undefined){
              array.push(reservation[`Item${i}`]);
          }else{
              break;
          }
      }
  }
  return array;
});




const getItems = (reservation) => {
  const items = [];
  if (reservation) {
    for (let i = 1; i <= 10; i++) {
      if (reservation[`Item${i}`]) {
        items.push(reservation[`Item${i}`]);
      } else {
        break;
      }
    }
  }
  return items;
};

const cancelRes = (reservation) => {
  cancelledReservations.value.push(reservation);
};

const getReportedItems =(item) => {
  report.addImage(item.ItemImage);
  console.log(report.itemImage);
  report.addName(item.ItemName);
  console.log(report.itemName);
  report.addSerial(item.Serial);
  console.log(report.itemSerial);
};

const dataToSend = {
  Message: 'Hello World!',
  Email: 'jessygencel@hotmail.com',
  Subject: 'Testing'
};

const log = () => {
  axios.post('http://localhost:3000/mail', dataToSend)
  .then(response => {
    message.value = response.data.message
  })
  .catch(error => {
    console.log(error)
  })
};

const getReservations = async () => {
  if(user.user.id){
      const collectionRef = collection(db, `Users/${user.user.id}/Reservations`);
      const querySnapshot = await getDocs(collectionRef);
      if (querySnapshot.empty) {
          console.log('No Reservations found!');
          return;
      }else{
          querySnapshot.forEach((doc) => {
          reservations.value.push(doc.data());
          });
      }
      
  }
}

const cancellableReservationsCalc = () => {
  if (reservations.value == undefined){
      console.log("loading...")
  } else {
      let cancellableReservations = [];
      let remainingReservations = [];

      for (let reservation of reservations.value){
          console.log(reservations.value)
          startDate.value.setDate(reservation.StartDate);
          startDate.value.setMonth(reservation.StartMonth);
          let adjustedStartDate = new Date(startDate.value);
          adjustedStartDate.setDate(adjustedStartDate.getDate() - 2);
          adjustedStartDate.setMonth(adjustedStartDate.getMonth() - 1);
          adjustedStartDate.setHours(0,0,0,0);
          console.log(adjustedStartDate)
          
          if (!reservation.CurrentlyWithUser && new Date().setHours(0,0,0,0) <= adjustedStartDate){
              cancellableReservations.push(reservation);
          } else {
              remainingReservations.push(reservation);
          }
      }

      return [cancellableReservations, remainingReservations];
  }
};

const toggleReservationDetails = (index) => {
  visibleReservations.value[index] = !visibleReservations.value[index];
};

const isReservationVisible = (index) => visibleReservations.value[index] || false;

onMounted(getReservations);
</script>

<style scoped>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  button {
    padding: 10px 20px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-decoration: none; 
  }
  
  button:hover {
    background-color: #c82333;
  }
  
  .product1 {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 20px auto;
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    width: 90%;
    max-width: 1500px;
  }
  
  .product1:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .product1 .kolom1 p {
    text-align: left;
    margin-bottom: 5px;
  }

  .product1 .kolom1 .actions button {
    margin-left: 10px;
  }

  .kolom1 {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.kolom4 {
  flex: 1;
  text-align: right;
  position: absolute;
  top: 20px; 
  right: 20px; 
  display: flex;
  flex-direction: column;
}
  .actions {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-left: 10px;
  }
  
  .actions button {
    background-color: #dc3545;
    color: white;
    text-decoration: noneS;
  }
  
  .actions button:hover {
    background-color: #c82333;
  }
  
  .link {
    color: white;
    text-decoration: none; 
  }

  .serial-and-actions {
    display: flex;
    align-items: center;
    gap: 10px; 
  }
  

  .reservation-details {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 10px;
    background-color: #f9f9f9;
    width: auto;
  }
  
  .reservation-item {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #ffffff;
  }
  
  .reservation-item img {
    max-width: 50px;
    max-height: 50px;
    margin-left: 20px;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  p {
    margin: 0;
    padding: 0;
    color: #333;
  }
  
  .kolom4 p {
    margin-top: 5px;
  }
  </style>
