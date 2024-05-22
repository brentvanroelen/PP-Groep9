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
            <button class="btn btn-return-check">Returned & Check</button>
            <button @click="itemReturned(isScheduledReturnDefined)" class="btn btn-return">Returned</button>
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
})

</script>

<style scoped>
    
.card {
    background-color: #fff;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card-title {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 10px;
}

.card-text {
    color: #666;
    font-size: 1em;
    margin-bottom: 10px;
}

details {
    background-color: #f1f1f1;
    border-radius: 10px;
    padding: 10px;
    transition: background-color 0.3s;
}

details summary {
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 10px;
}

details ul {
    list-style: none;
    padding: 0;
}

details li {
    padding: 5px 0;
    border-bottom: 1px solid #ddd;
}

details li:last-child {
    border-bottom: none;
}

.card-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.card:first-of-type {
    margin-top: 20px; /* zodat de eerste kaart niet tegen de titel zit */
}
.btn {
    border: none;
    padding: 10px;
    cursor: pointer;
    color: white;
    border-radius: 20px; 
    transition: background-color 0.3s, transform 0.3s;
    flex: 1;
}

.btn-return-check {
    background-color: #28a745; 
}

.btn-return-check:hover {
    background-color: #218838; 
    transform: scale(1.05);
}

.btn-return-check:active {
    background-color: #1e7e34;
}

.btn-return {
    background-color: #dc3545; 
}

.btn-return:hover {
    background-color: #c82333; 
    transform: scale(1.05);
}

.btn-return:active {
    background-color: #bd2130;
}
</style>
