<template>

<div>
    <h2>Reservations</h2>
    <div v-for="(reservations, date) in reservationData" :key="date">
      <h3>{{date}}</h3>
      <ul>
        <li v-for="reservation in reservations" :key="reservation.serial">
          <img :src="reservation.itemImage" alt="Item Image">
          <p>{{ reservation.itemName }}</p>
          <p>Startdate: {{ reservation.startDate }}/{{ reservation.startMonth }}</p>
          <p>Einddate: {{ reservation.endDate }}/{{ reservation.endMonth }}</p>
          
        </li>
      </ul>
    </div>
  </div>

<div class="scheduledReturns">

    data uit datebase

    <button>Return + check</button>
    <button>Returned</button>

</div>

<!-- <div class="spontaneousLoans">
    <h2>Spontaneous Loans</h2>

    <label>User: </label> <input type="text" name="" id=""><br>
    <label for="ItemorKITname">Item or KIT name: </label><input type="text" name="" id="">
    <label for="calender">Return date: </label> calender<br>
    <label for="returnTime">Return time: </label><input type="time">
    <button>Complete loan</button>
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
  </div> -->

</template>



<script setup>
 import { getDocs, getFirestore } from 'firebase/firestore';
  import {ref} from '../main.js'
  import {collection,where,db,query} from '../Firebase/Index.js'

  
  const created = () => {
    this.fetchReservations(); 
  };
  
    const fetchReservations =() => {
      const db = firebase.firestore(); 
      db.collection('reservations').get() // Verkrijg de collectie met reservaties
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const reservation = doc.data(); // Verkrijg de data van elke reservatie
            const dateKey = `${reservation.startDate}/${reservation.startMonth}`; // Combineer startdatum en startmaand als sleutel
            if (!this.reservationData[dateKey]) {
              this.reservationData[dateKey] = []; // Initialiseer een lege array als er nog geen reservaties zijn voor deze datum
            }
            this.reservationData[dateKey].push(reservation); // Voeg de reservatie toe aan de juiste datum
          });
        })
        .catch(error => {
          console.error('Error getting reservations:', error);
        });
    }
   


</script>



<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr; /* One column */
  grid-template-rows: auto 1fr; /* Two rows: auto height for date marker, 1fr for boxes */
  position: relative; /* Relative positioning for the semi-circle */
  background-color: rgb(221, 207, 207);
}

.date-marker {
  text-align: center;
  font-size: 1.5em;
  grid-column: 1; /* Position in first column */
  grid-row: 1; /* Position in first row */
  z-index: 1; /* Ensure the date marker is above the semi-circle */
  position: relative; /* Relative positioning for the z-index */
}

.box-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns for boxes */
  gap: 2px; /* Gap between columns */
  padding: 1px;
  border: 4px solid #726767;
  border-radius: 10px;
  grid-column: 1; /* Position in first column */
  grid-row: 2; /* Position in second row */
  margin: 0 20px; /* Margin on the left and right */
  
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 25%;
  height: 36.25px; /* Adjust this to control the height of the semi-circle */
  background-color: #1667e0;
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
  background-color: #000; /* Color of the divider */
}
  .box {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #f9f9f9;
    overflow-y: auto; /* Enable scrolling for overflow content */
    max-height: 400px; /* Set a maximum height for the scrolling area */
  }

  /* Styling for the buttons */
  button {
    margin-right: 10px;
    background-color: #FF0000;
    border: none;
    padding: 10px;
    cursor: pointer;
    margin: 1em;
    color: white;
    border-radius: 1em;
    width: 300px;
    height: 50px;
  
  }



</style>