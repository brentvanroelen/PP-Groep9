<template>
      <div class="card" v-if="!discarded">
        <div v-if="isScheduledLoanDefined" class="card-body">
          <div v-if="isScheduledLoanDefined" class="card-content">
            <div v-if="isScheduledLoanDefined">
              <h5 class="card-title">{{ isScheduledLoanDefined.User }}</h5>
              <p class="card-text">Place for timeslot</p>
              <details>
                <summary>See Items</summary>
                <ul>
                  <li v-for="(item, index) in isScheduledLoanDefined.allItemNames" :key="index">
                    {{ item }}: {{ isScheduledLoanDefined.allItemSerials[index] }}
                  </li>
                </ul>
              </details>
              <p v-if="isScheduledLoanDefined.ReservationPrepared" class="card-text">Status: Ready</p>
              <p v-else-if="isScheduledLoanDefined.amountLeftToPrepare !== undefined">Status: {{ isScheduledLoanDefined.amountLeftToPrepare }} item{{ isScheduledLoanDefined.amountLeftToPrepare !== 1 ? 's' : '' }} to prepare</p>
              <p v-else>Status: Loading...</p>
            </div>
            <div class="card-actions">
              <button @click="markAsPickedUp(isScheduledLoanDefined)" class="btn">Picked Up</button>
              <button @click="discardReservation(isScheduledLoanDefined)" class="btn">Discard</button>
            </div>
          </div>
        </div>
      </div>

  </template>


<script setup>
import {computed, onMounted, ref,watchEffect} from 'vue';
import {reservationReturnedOrCanceled} from "../js/functions.js"
import { updateDoc,doc,db } from '../Firebase/Index.js';

const props = defineProps({
    scheduledLoan: Object
});

let discarded = ref(false);

let scheduledloan = computed(() => {
    console.log(props.scheduledLoan)
    return props.scheduledLoan;
});

let isScheduledLoanDefined = computed(() => {
    if(scheduledloan.value === undefined){
        return "loading...";
    }else if(scheduledloan.value.CurrentlyWithUser === true){
        discarded.value = true;
        return "Item is currently with user";
    }
    else{
        return scheduledloan.value;
    }	
});

onMounted(() => {
    console.log(scheduledloan.value)
})

const discardReservation = async (reservation) => {
    await reservationReturnedOrCanceled(reservation);
    discarded.value = true;
};
const markAsPickedUp = async (reservation) => {
    await updateDoc(doc(db, `Reservations/Tester ${reservation.StartDate} ${reservation.EndDate}`), {
        CurrentlyWithUser: true
    });
    discarded.value = true;
};

</script>



<style scoped>

.box {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #f9f9f9;
    overflow-y: auto; /* Enable scrolling for overflow content */
    max-height: 400px; /* Set a maximum height for the scrolling area */
  }

  /* Styling for the buttons */
  .card {
    background-color: lightblue;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
}

.card-body {
    display: flex;
    justify-content: space-between;
}

.card-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.card-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 40%;
}
.btn{
    background-color: #FF0000;
    border: none;
    padding: 10px;
    cursor: pointer;
    color: white;
    border-radius: 1em;
    width: 100%;
    height: 3.8em;
  
}

</style>