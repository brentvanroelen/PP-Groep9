<template>
      <div class="card">
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
              <button class="btn">Picked Up</button>
              <button class="btn">Discard</button>
            </div>
          </div>
        </div>
      </div>

  </template>


<script setup>
import {computed, onMounted, ref,watchEffect} from 'vue';

const props = defineProps({
    scheduledLoan: Object
});
let scheduledloan = computed(() => {
    console.log(props.scheduledLoan)
    return props.scheduledLoan;
});

let isScheduledLoanDefined = computed(() => {
    if(scheduledloan.value === undefined){
        return "loading...";
    }else{
        return scheduledloan.value[0];
    }	
});

onMounted(() => {
    console.log(scheduledloan.value[0])
})

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