<template>
  <button @click="log"> test</button>
  <template v-for="(cancellableReservation, Index) in displayReservations[0]" :key= Index>
      <div class="product1" v-if="!cancelledReservations.includes(cancellableReservation)">
          <div class="kolom1">
              <p>Serial: {{ cancellableReservation.id }}</p>
              <details>
                  <summary>See Items</summary>
                  <ul>
                  <li v-for="(item, index) in getItems(cancellableReservation)" :key="index">
                      Name: {{ item.ItemName}}
                      Serialnumber: {{ item.Serial}}
                      <img :src="item.ItemImage" alt="picture">
                  </li>
                  </ul>
              </details>
          </div>
          <div class="kolom1">
          <button @click="reservationReturnedOrCanceled(cancellableReservation) ;cancelRes(cancellableReservation) ;showPopup('Reservation has been cancelled'); ">
              Cancel Reservation
          </button>  
          </div>
          <div class="kolom4">
              <p>{{ cancellableReservation.StartDate }}/{{ cancellableReservation.StartMonth }}/{{ year }} </p>   
              <p>{{ cancellableReservation.EndDate }}/{{ cancellableReservation.EndMonth }}/{{ year }}</p>
          </div>    
      </div>
  </template>
  <div v-for="(reservation, Index) in displayReservations[1]" :key="Index" class="product1">
      <div class="kolom1">
          <p>Serial: {{ reservation.id }}</p>
          <details>
              <summary>See Items</summary>
              <ul>
                <li v-for="(item, index) in getItems(reservation)" :key="index">
                  Name: {{ item.ItemName}}
                  Serialnumber: {{ item.Serial}}
                  <img :src="item.ItemImage" alt="picture">
                  <button><router-link class="link" to="/ExtensionPage">Request singular extension</router-link></button>
                </li>
              </ul>
          </details>
      </div>
      <div class="kolom1">
          <button>
              <router-link class="link" to="/ExtensionPage">Request extension</router-link>
          </button>  
      </div>
       <button>
          <router-link class="link" to="/ReportIssue"> Report Issue </router-link>
      </button>
      <div class="kolom4">
          <p>{{ reservation.StartDate }}/{{ reservation.StartMonth }}/{{ year }} </p>   
          <p>{{ reservation.EndDate }}/{{ reservation.EndMonth }}/{{ year }}</p>
      </div>  
      <Popup v-if="popupVisible" :message="popupMessage" @close="popupVisible = false" />  
  </div>

</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { db,collection,query,where,getDocs,doc } from "../Firebase/Index.js";
import {reservationReturnedOrCanceled} from "../js/functions.js"
import { useUserIdentification } from "@/Pinia/Store.js";
import Popup from "@/components/Popup.vue";

let cancelledReservations = ref([]);
let reservations = ref([]);
let cancellableReservations = ref([]);
const year = ref(new Date().getFullYear());
let startDate = ref(new Date());
const user = useUserIdentification();
const popupVisible = ref(false);
const popupMessage = ref('');




  const showPopup = (message) => {
  popupMessage.value = message;
  popupVisible.value = true;
};

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
  let array = [];
  if(reservation != undefined){
      for (let i = 1; i <= 10; i++){
          if (reservation[`Item${i}`] != undefined){
              array.push(reservation[`Item${i}`]);
          }else{
              break;
          }
      }
      return array;
  }else {console.log("loading...")};
};
const cancelRes = (reservation) => {
  cancelledReservations.value.push(reservation);
    
  
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
          adjustedStartDate.setDate(adjustedStartDate.getDate() - 2)
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

;


onMounted( async() => {
  await getReservations();
});

</script>

<style scoped>
  div{
      display: flex;
      margin: 20px;
      background-color: #c1c1c1;
      padding: 20px;
  }

  p{
      margin: auto;
  }

  .kolom1{
      margin: auto;
      display: flex;
      flex-direction: column;
  }
  .kolom4{
      margin: auto;
      display: flex;
      flex-direction: column;
  }
  button{
      margin: auto;
      border-radius: 50px;
      padding: 15px 10px 15px 10px;
      background-color: red;
      color: white;
      border: 0cap;
  }
  .available{
      background-color: lightgreen;
  }
</style>