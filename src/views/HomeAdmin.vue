<template>

<div class="container">
    <div class="date-marker">
      <p>{{ new Date().toLocaleDateString() }}</p>
    </div>
    <div class="box-container">
      <div class="box scheduledLoans">
        <h2>Scheduled loans</h2>
        <ScheduledLoan v-for="(scheduledloan, index) in scheduledLoans" :key="index" :scheduled-loan="scheduledloan"></ScheduledLoan>
      </div>

      <div class="box scheduledReturns">
        <h2>Scheduled returns</h2>
        <ScheduledReturn v-for="(scheduledreturn, index) in scheduledReturns" :key="index" :scheduled-return="scheduledreturn"></ScheduledReturn>
      </div>
    
  
  <div class="box spontaneousLoans">
      <h2>Spontaneous Loans</h2>
      <SpontaneousLoans></SpontaneousLoans>
  </div>

  <div class="box earlyReturns">
      <h2>Early Returns</h2>
      <label>User: </label> <input type="text" name="" id=""><br>
      <label for="ItemorKITname">Item or KIT name: </label><input type="text" name="" id="">
      <br>
      <label for="borrowedItems">Borrowed items: </label> borrowed Items<br>
      <button>Selection returned</button>
      <button>Selection returned + check</button>
      <button>Everything returned</button>
      <button>Everything returned + check</button>
  </div> 

</div>
</div>

</template>



<script setup>
import { useStore } from "@/Pinia/Store.js";
import Reservation from "@/components/Reservation.vue";
import { ref, onMounted, onUnmounted,computed,watchEffect } from 'vue';
import { onSnapshot, doc, db,query,where,collection} from '../Firebase/Index.js';
import ScheduledReturn from "@/components/ScheduledReturn.vue";
import ScheduledLoan from "@/components/ScheduledLoan.vue";
import SpontaneousLoans from "@/components/SpontaneousLoans.vue";

let currentDate = ref(new Date());
let unssub = false;
const showSpontaneous = ref(false);
const reservationslist = ref([]);
let amountLeftToPrepare = ref(0);

const scheduledLoans = computed(() => {
  return reservationslist.value.filter(reservation => 
    reservation.StartDate <= currentDate.value.getDate() && 
    (reservation.StartMonth - 1)  <= currentDate.value.getMonth()&&
    reservation.CurrentlyWithUser == false
  );
});
const scheduledReturns = computed(() => {
    
  return reservationslist.value.filter(reservation => 
    reservation.EndDate <= currentDate.value.getDate() && 
    (reservation.EndMonth - 1)  <= currentDate.value.getMonth()
  );
});


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

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 25%;
  height: 36.25px;
  background-color: #ff6666;
  transform: translate(-50%, 0); 
  z-index: 0; 
}
    
.box-container::after {
  content: "";
  position: absolute;
  top: 38px; 
  left: 50%;
  width: 2px; 
  height: calc(100% - 38px); 
  background-color: #333; 
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
  background-color: #ffffff;
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

input[type="text"],    
input[type="time"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}
    
</style>
