<template>

<div class="container">

    <div class="head">
      <button :class="{disabledbutton: disableDecrement()}" @click="decrementDate" class="readyButton">&larr;</button><h1>Date: {{ displayDate }}</h1><button @click="incrementDate" class="readyButton">&rarr;</button>
    </div>

    <div class="box-container">
      <div class="box scheduledLoans">
        <h2 v-if="!showLateReservations">Scheduled loans</h2>
        <h2 v-else>Late reservations</h2>
        <div v-if="todayDate != undefined">
          <HomePlannedLoans v-if="dateChanged" :today-date="todayDate" :show-late-reservations="showLateReservations"></HomePlannedLoans>
          <button v-if="!showLateReservations" @click="showLateReservations = !showLateReservations">See late reservations</button>
          <button v-else @click="showLateReservations = !showLateReservations">See Today's Reservation</button>
        </div>
      </div>

      <div class="box scheduledReturns">
        <h2 v-if="!showLateReturns">Scheduled returns</h2>
        <h2 v-else>Late returns</h2>
        <HomePlannedReturns v-if="dateChanged" :today-date="todayDate" :show-late-reservations="showLateReturns"></HomePlannedReturns>
        <button v-if="!showLateReturns" @click="showLateReturns = !showLateReturns">See late returns</button>
        <button v-else @click="showLateReturns = !showLateReturns">See Today's returns</button>
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
import { useStore,useUserIdentification, useSelectedUser } from "@/Pinia/Store.js";
import Reservation from "@/components/Reservation.vue";
import { ref, onMounted, onUnmounted,computed,watchEffect, warn } from 'vue';
import { onSnapshot, doc, db,query,where,collection, getDoc, getDocs, updateDoc} from '../Firebase/Index.js';
import SpontaneousLoans from "@/components/SpontaneousLoans.vue";
import{ useRouter } from 'vue-router';
import HomePlannedLoans from "@/components/HomePlannedLoans.vue";
import HomePlannedReturns from "@/components/HomePlannedReturns.vue";
import EarlyReturns from "@/components/EarlyReturns.vue";

let unssub = false;
const showLateReturns = ref(false);
const showLateReservations = ref(false);
const reservationslist = ref([]);
let amountLeftToPrepare = ref(0);
let todayDate = ref(new Date());
let displayDate = ref(("0" + todayDate.value.getDate()).slice(-2) + "/" + ("0" + (todayDate.value.getMonth() +1)).slice(-2) + "/" + todayDate.value.getFullYear())
let dateChanged = ref(true);
const disableDecrement = () => {
  if(todayDate.value.getDate() == new Date().getDate() && todayDate.value.getMonth() == new Date().getMonth() && todayDate.value.getFullYear() == new Date().getFullYear()){
    return true
  }else{
    return false
  }
}

const autoWarnings = ref();
const reservations = ref([]);
const warningcount = ref();

const fetchSettings = async () => {
  const settings = doc(db, 'Settings', 'Options');
  const settingDocSnap = await getDoc(settings);
  if (settingDocSnap.exists()) {
    const data = settingDocSnap.data();
    autoWarnings.value = data.autoWarnings;
    console.log(autoWarnings.value)
  }}

const fetchReservations = async () => {
   const reservation = collection(db, 'Utility', 'Reservations', 'All Reservations' );
   const reservationSnapshots = await getDocs(reservation);
   console.log(reservationSnapshots.size)
   reservationSnapshots.forEach(doc => {
    const data = doc.data();
      console.log(data);
      reservations.value.push({
      endDate: data.EndDate,
      endMonth: data.EndMonth,
      returnUser: data.User,
      warned: data.Warned,
      id: data.id
      })
      console.log(reservations.value)
    });
  }




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
  if(todayDate.value.getDate() == new Date().getDate() && todayDate.value.getMonth() == new Date().getMonth() && todayDate.value.getFullYear() == new Date().getFullYear()){
    return
  }
  dateChanged.value = false
  setTimeout(() => {
    todayDate.value.setDate(todayDate.value.getDate() - 1);
    displayDate.value = ("0" + todayDate.value.getDate()).slice(-2) + "/" + ("0" + (todayDate.value.getMonth() + 1)).slice(-2) + "/" + todayDate.value.getFullYear()
    dateChanged.value = true  
  }, 1);
}
const incrementDate = () => {
  dateChanged.value = false
  setTimeout(() => {
    todayDate.value.setDate(todayDate.value.getDate() + 1);
    displayDate.value = ("0" + todayDate.value.getDate()).slice(-2) + "/" + ("0" + (todayDate.value.getMonth() + 1)).slice(-2) + "/" + todayDate.value.getFullYear()
    dateChanged.value = true
  }, 1);
}

const Warn = async () => {
  console.log(autoWarnings.value)
  console.log(warningcount.value)
  if(autoWarnings.value === true){
    console.log("Auto warnings are on")
    reservations.value.forEach(async reservation => {
      console.log(reservation.returnUser + " is the user")
      if(todayDate.value.getMonth() + 1 >= reservation.endMonth){
        console.log("Month is over ")
        if(reservation.endDate < todayDate.value.getDate()){
          console.log("Date is over")
          if(reservation.warned === false){
            console.log("Warning")
            reservation.warned = true;
            const userref = doc(db, 'Users', reservation.returnUser );
            const userSnap = await getDoc(userref);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              const newWarningCount = userData.warningCount + 1;
              await updateDoc(userref, {
                warningCount: newWarningCount,
              });
            }
            const reservationRef = doc(db, 'Utility', 'Reservations', 'All Reservations', reservation.id);
            await updateDoc(reservationRef, {
              Warned: reservation.warned,
            });
          }else{
            console.log("Already warned")
          }
        }else{
          console.log(reservation.endDate + " is the end date")
        }
      }else{
        console.log(reservation.endMonth + " is the end month")
      }
      console.log("___________________________________")
    });
  }else{
    console.log("Auto warnings are off")
  }
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

onMounted(async () => {
  await fetchSettings();
  await fetchReservations();
  Warn();
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
.disabledbutton{
  background-color: #f0f0f0;
  color: #666;
  cursor: not-allowed;
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
  max-width: 1200px;
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
