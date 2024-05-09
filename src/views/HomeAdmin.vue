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
  grid-template-columns: 1fr; /* One column */
  grid-template-rows: auto 1fr; /* Two rows: auto height for date marker, 1fr for boxes */
  position: relative; /* Relative positioning for the semi-circle */
  background-color: #f0f0f0;
}

.date-marker {
  text-align: center;
  font-size: 1.5em;
  grid-column: 1; /* Position in first column */
  grid-row: 1; /* Position in first row */
  z-index: 1; /* Ensure the date marker is above the semi-circle */
  position: relative; /* Relative positioning for the z-index */
    color: #333;
}

.box-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns for boxes */
  gap: 20px; /* Gap between columns */
  padding: 20px;
  border: 4px solid #666;
  border-radius: 10px;
  grid-column: 1; /* Position in first column */
  grid-row: 2 / 4; /* Position in second row */
  margin: 0 20px; /* Margin on the left and right */
  
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 25%;
  height: 36.25px; /* Adjust this to control the height of the semi-circle */
  background-color: #ff6666;
  transform: translate(-50%, 0); /* Adjust this to control the vertical position of the semi-circle */
  z-index: 0; /* Ensure the semi-circle is below the date marker */
}
    
.box-container::after {
  content: "";
  position: absolute;
  top: 38px; /* Start from the bottom of the padding */
  left: 50%;
  width: 2px; /* Width of the divider */
  height: calc(100% - 38px); /* Height of the divider minus twice the padding */
  background-color: #333; /* Color of the divider */
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
}

input[type="text"],    /* deze selector om specifiek stijlen te kunnen toepassen op de invoervelden */
input[type="time"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}
    
</style>
