<template>
    <div v-if="!returned" class="card">
      <div v-if="isScheduledReturnDefined" class="card-body">
        <div v-if="isScheduledReturnDefined" class="card-content">
          <div v-if="isScheduledReturnDefined">
            <h5 class="card-title">{{ isScheduledReturnDefined.User }}</h5>
            <p class="card-text">Place for timeslot</p>
            <details>
              <summary>See Items</summary>
              <ul>
                <li v-for="(item, index) in isScheduledReturnDefined.allItemNames" :key="index">
                  {{ item }}: {{ isScheduledReturnDefined.allItemSerials[index] }}
                </li>
              </ul>
            </details>
          </div>
          <div class="card-actions">
            <button class="btn">Returned + Check</button>
            <button @click="itemReturned(isScheduledReturnDefined)" class="btn">Returned</button>
          </div>
        </div>
      </div>
    </div>

</template>


<script setup>
import {computed, onMounted, ref,watchEffect} from 'vue';
import {reservationReturnedOrCanceled} from "../js/functions.js"

let returned = ref(false);

const props = defineProps({
  scheduledReturn: Object
});
let scheduledreturn = computed(() => {
  console.log(props.scheduledReturn)
  return props.scheduledReturn;
});

let isScheduledReturnDefined = computed(() => {
  if(scheduledreturn.value === undefined){
      return "loading...";
  }else{
      return scheduledreturn.value;
  }	
});
const itemReturned = async (reservation) => {
  await reservationReturnedOrCanceled(reservation);
  returned.value = true;
}

onMounted(() => {
  console.log(scheduledreturn.value)
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