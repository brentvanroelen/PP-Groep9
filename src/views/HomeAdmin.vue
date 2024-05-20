<template>

<div class="container">

    <div class="head">
      <button @click="decrementDate" class="readyButton">&larr;</button><h1>Date: {{ displayDate }}</h1><button @click="incrementDate" class="readyButton">&rarr;</button>
    </div>

    <div class="box-container">
      <div class="box scheduledLoans">
        <h2>Scheduled loans</h2>
        <div v-if="todayDate != undefined">
          <HomePlannedLoans v-if="dateChanged" :today-date="todayDate"></HomePlannedLoans>
        </div>
      </div>

      <div class="box scheduledReturns">
        <h2 v-if="!showLateReservations">Scheduled returns</h2>
        <h2 v-else>Late reservations</h2>
        <HomePlannedReturns v-if="dateChanged" :today-date="todayDate" :show-late-reservations="showLateReservations"></HomePlannedReturns>
        <button v-if="!showLateReservations" @click="showLateReservations = !showLateReservations">See late reservations</button>
        <button v-else @click="showLateReservations = !showLateReservations">See Today's Reservation</button>
      </div>
    
  
  <div class="box spontaneousLoans">
      <h2>Spontaneous Loans</h2>
      <SpontaneousLoans></SpontaneousLoans>
  </div>

  <div class="box earlyReturns">
      <EarlyReturns></EarlyReturns>
  </div> 

</div>
</div>

</template>



<script setup>
import { useStore,useUserIdentification } from "@/Pinia/Store.js";
import Reservation from "@/components/Reservation.vue";
import { ref, onMounted, onUnmounted,computed,watchEffect } from 'vue';
import { onSnapshot, doc, db,query,where,collection} from '../Firebase/Index.js';
import SpontaneousLoans from "@/components/SpontaneousLoans.vue";
import{ useRouter } from 'vue-router';
import HomePlannedLoans from "@/components/HomePlannedLoans.vue";
import HomePlannedReturns from "@/components/HomePlannedReturns.vue";
import EarlyReturns from "@/components/EarlyReturns.vue";

let unssub = false;
const showLateReservations = ref(false);
const reservationslist = ref([]);
let amountLeftToPrepare = ref(0);
let todayDate = new Date();
let displayDate = ref(("0" + todayDate.getDate()).slice(-2) + "/" + ("0" + (todayDate.getMonth() +1)).slice(-2) + "/" + todayDate.getFullYear())
let dateChanged = ref(true);

const user = useUserIdentification()
const router = useRouter()
const testing = true
const emits = defineEmits(["incrementDate", "decrementDate"]);
if(testing == false){
  if (user.user.id == "" || user.user.id == undefined){
    console.log("User not logged in")
    user.logOut()
  }else if(user.user.type !== "admin"){
    router.push({name: "Home"})
  }else{
    console.log("Welcome")
  }
}
const decrementDate = () => {
  dateChanged.value = false
  setTimeout(() => {
    todayDate.setDate(todayDate.getDate() - 1);
    displayDate.value = ("0" + todayDate.getDate()).slice(-2) + "/" + ("0" + (todayDate.getMonth() + 1)).slice(-2) + "/" + todayDate.getFullYear()
    dateChanged.value = true  
  }, 1);
}
const incrementDate = () => {
  dateChanged.value = false
  setTimeout(() => {
    todayDate.setDate(todayDate.getDate() + 1);
    displayDate.value = ("0" + todayDate.getDate()).slice(-2) + "/" + ("0" + (todayDate.getMonth() + 1)).slice(-2) + "/" + todayDate.getFullYear()
    dateChanged.value = true
  }, 1);
}




watchEffect(() => {
  amountLeftToPrepare.value = 0
  const q = collection(db, "Reservations");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const reservations = [];
    querySnapshot.forEach((doc) => {
        const reservation = doc.data();
        reservation.amountLeftToPrepare = 0;
        reservation.allItemSerials = [];
        reservation.allItemNames = [];
        for(let i = 1; i <= 10; i++){
            if(doc.data()[`Item${i}`] != undefined){
                reservation.allItemSerials.push(doc.data()[`Item${i}`].Serial);
                reservation.allItemNames.push(doc.data()[`Item${i}`].ItemName);
                if(doc.data()[`Item${i}`].ItemPrepared == false){
                    reservation.amountLeftToPrepare += 1;
                };
            }else{
                break;
            }
        }
        reservations.push(reservation);
    });
    reservationslist.value = reservations;
    if (unssub) {
      unsubscribe();
    }
  });
});

onUnmounted(() => {
    unssub = true;
});


</script>



<style scoped>
.scheduledReturnsHeader{
  display: flex;
  align-items: center;
}
.scheduledReturnsHeader button{
  margin-left: 20px;
}
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  position: relative;
  background-color: #f0f0f0;
  margin: 0em 5em 5em 5em;
}

.date-marker {
  text-align: center;
  font-size: 1.5em;
  grid-column: 1;
  grid-row: 1;
  z-index: 1;
  position: relative;
    color: #333;
}

.box-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px; 
  padding: 20px;
  border: 4px solid #666;
  border-radius: 10px;
  grid-column: 1;
  grid-row: 2 / 4;
  margin: 0 20px;
  
}


    

.box {
  padding: 20px;
  border-radius: 5px;
}

.scheduledLoans,
.scheduledReturns {
  background-color: #d0d0d0;
}

.spontaneousLoans,
.earlyReturns {
  background-color: #d0d0d0;
  max-width: 400px;
}

.box h2 {
  color: #333;
}

label {
  color: #666;
}

button {
  background-color: #ff3333;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin: 0.5em;
}
.head{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  
  }

input[type="text"],    
input[type="time"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}
    
</style>
