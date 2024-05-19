<template>
    <h2>Early Returns</h2>
    <label for="ItemorKITname">Item or KIT name: </label>
    <SearchBarAdmin :page="'HomeAdmin'"></SearchBarAdmin>
    <br>
    <div v-if="EarlyReservations.Reservations.length != 0" v-for="reservation in EarlyReservations.Reservations" :key="reservation.id" class="studentContainer">
        <div class="studentInfo">
          <p>Student: {{ reservation.UserFirstName }}  {{ reservation.UserLastName }}</p>
          <p>Scheduled Return Date: {{ reservation.EndDate }}/{{ reservation.EndMonth }}/2024</p>
        </div>   
        <button @click="toggleOrders(reservation)">&#9776;</button>
        <ul v-if="reservation.showItems" class="ordersList">
          <li v-for="item in reservation.Items" :key="item.id" class="items">
            <p>Name: {{ item.ItemName }}</p>
            <p>Serial: {{ item.Serial }}</p>
          </li>
        </ul>
    </div>
    <br>
    <button>Selection returned</button>
    <button>Selection returned + check</button>
    <button>Everything returned</button>
    <button>Everything returned + check</button>
</template>
<script setup>
import SearchBarAdmin from './SearchBarAdmin.vue';
import { useEarlyReturnsReservations} from '@/Pinia/Store.js';

const EarlyReservations = useEarlyReturnsReservations();
console.log(EarlyReservations.Reservations)


const toggleOrders = (reservation) => {
  reservation.showItems = !reservation.showItems;
}
</script>
<style scoped>
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
</style>