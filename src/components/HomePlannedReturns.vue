<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-if="!loading">
    <div class="ItemsToPrepare" v-if="!showLateReservations">
      <div v-if="students.length == 0">
        <p>No returns for {{ displayDate }}</p>
      </div>
        <!-- Loept door de students -->
      <div v-if="students.length != 0" v-for="student in students" :key="student.id" class="studentContainer">
        <div class="studentInfo">
          <p>Student: {{ student.name }}</p>
          <p>Return date: {{ student.pickUpDate }}</p>
          <p>Return time: {{ student.pickUpTime }}</p>
        </div>
        <button @click="returned(student,false)" class="readyButton">Items returned</button>
        <br>        
        <button @click="toggleOrders(student)">&#9776;</button>
        <!-- lijst met reservaties van de studenten-->
        <ul v-if="student.showOrders" class="ordersList">
          <!-- Loept door de reservaties -->
          <li v-for="item in student.orders" :key="item.id" class="items">
            <p>Name: {{ item.ItemName }}</p>
            <p>Serial: {{ item.Serial }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="ItemsToPrepare" v-else>
      <div v-if="lateReservationArray.length == 0">
        <p>No late returns</p>
      </div>
        <!-- Loept door de students -->
      <div v-for="student in lateReservationArray" :key="student.id" class="studentContainer">
        <div class="studentInfo">
          <p>Student: {{ student.name }}</p>
          <p>Return date: {{ student.pickUpDate }}</p>
          <p>Return time: {{ student.pickUpTime }}</p>
        </div>
        <button @click="returned(student,false)" class="readyButton">Returned</button>
        <button @click="returnedWarning(student,true)" class="deleteButton">Returned + Warning</button>
        <br>        
        <button @click="toggleOrders(student)">&#9776;</button>
        <!-- lijst met reservaties van de studenten-->
        <ul v-if="student.showOrders" class="ordersList">
          <!-- Loept door de reservaties -->
          <li v-for="item in student.orders" :key="item.id" class="items">
            <p>Name: {{ item.ItemName }}</p>
            <p>Serial: {{ item.Serial }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <Popup v-if="popupVisible" :message="popupMessage" @close="popupVisible = false" />
</template>
  
    
    
<script setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { getDocs,getDoc, collection, onSnapshot,db,where,query, updateDoc, doc, setDoc } from '../Firebase/Index.js';
import { reservationReturnedOrCanceled } from '@/js/functions.js';
import Popup from '@/components/Popup.vue';

let unsub = false;
const students = ref([]) 
const allReservations = ref([]);
const lateReservationArray = ref([]);
let loading = ref(true);

const popupVisible = ref(false);
const popupMessage = ref('');




const showPopup = (message) => {
popupMessage.value = message;
popupVisible.value = true;
};


const toggleOrders = (student) => {
  student.showOrders = !student.showOrders;
}

const props = defineProps({
  todayDate: Date,
  showLateReservations: Boolean
})  
let displayDate = ref(("0" + props.todayDate.getDate()).slice(-2) + "/" + ("0" + (props.todayDate.getMonth() +1)).slice(-2) + "/" + props.todayDate.getFullYear())

const getItems = async() =>{
  const reservations = collection(db, 'Utility/Reservations/All Reservations');
  const q = query(reservations, where("EndDate", "==", props.todayDate.getDate()), where("EndMonth", "==", props.todayDate.getMonth() + 1),where ("CurrentlyWithUser", "==", true));
  const querySnapshot = await getDocs(q);
  if(querySnapshot.empty){
    loading.value = false;
  }
  querySnapshot.forEach(async(doc) => {
    let items = [];
    for (let i = 1; i <= doc.data().allItemSerials.length; i++) {
      items.push(doc.data()[`Item${i}`]);
    }
    let date = new Date();
    date.setDate(doc.data().EndDate);
    date.setMonth(doc.data().EndMonth);
    let formattedDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth())).slice(-2) + "/" + date.getFullYear();
    students.value.push({
      id: doc.data().id,
      userid: doc.data().User,
      name: doc.data().UserFirstName + " " + doc.data().UserLastName,
      pickUpDate: formattedDate,
      ItemSerials: doc.data().ItemSerials,
      allItemSerials: doc.data().allItemSerials,
      allItemNames: doc.data().allItemNames,
      pickUpTime: 12,
      showOrders: false,
      orders: items,
    });
    if(loading){
      loading.value = false;
    }
  });
}

watchEffect(() => {
  console.log(props.todayDate)
  const reservations = collection(db, 'Utility/Reservations/All Reservations');
  const unsubscribe = onSnapshot(reservations, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      allReservations.value.push(doc.data());
    });
    alignWithStudents();
    console.log(lateReservationArray.value)
    if(unsub){
      unsubscribe();
    }
  })
})

const returned = async (reservation, warning) => {
  await reservationReturnedOrCanceled(reservation, warning);
  const index = students.value.findIndex(s => s.id === reservation.id);
  if (index !== -1) {
    students.value.splice(index, 1);
  };
  showPopup("All items returned")
};


const filterAllReservationsOnLateness = () =>{
  const generalReservations = allReservations.value.filter(reservation => {
    let reservationDate = new Date(props.todayDate.getFullYear(), reservation.EndMonth - 1, reservation.EndDate);
    return reservationDate == props.todayDate
  })
  const lateReservations = allReservations.value.filter(reservation => {
    let reservationDate = new Date(props.todayDate.getFullYear(), reservation.EndMonth - 1, reservation.EndDate);
    return reservationDate < new Date()
  });
  return [generalReservations, lateReservations]
}
const alignWithStudents = () =>{
  const [generalReservations, lateReservations] = filterAllReservationsOnLateness();
  generalReservations.forEach(reservation => {
    if(students.value.find(s => s.id === reservation.id)){
      generalReservations.splice(generalReservations.indexOf(reservation), 1);
    }else{
      let items = [];
      for (let i = 1; i <= doc.data().allItemSerials.length; i++) {
        items.push(doc.data()[`Item${i}`]);
      }
      let date = new Date();
      date.setDate(doc.data().EndDate);
      date.setMonth(doc.data().EndMonth);
      let formattedDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth())).slice(-2) + "/" + date.getFullYear();
      students.value.push({
        id: reservation.id,
        userid: reservation.User,
        name: reservation.UserFirstName + " " + reservation.UserLastName,
        pickUpDate: formattedDate,
        ItemSerials: reservation.ItemSerials,
        allItemSerials: reservation.allItemSerials,
        allItemNames: reservation.allItemNames,
        pickUpTime: 12,
        showOrders: false,
        orders: items,
      })
    }
  });	    
  lateReservations.forEach(reservation => {
    let items = [];
    for (let i = 1; i <= reservation.allItemSerials.length; i++) {
      items.push(reservation[`Item${i}`]);
    }
    let date = new Date();
    date.setDate(reservation.EndDate);
    date.setMonth(reservation.EndMonth);
    let formattedDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth())).slice(-2) + "/" + date.getFullYear();
    lateReservationArray.value.push({
      id: reservation.id,
      userid: reservation.User,
      name: reservation.UserFirstName + " " + reservation.UserLastName,
      pickUpDate: formattedDate,
      ItemSerials: reservation.ItemSerials,
      allItemSerials: reservation.allItemSerials,
      allItemNames: reservation.allItemNames,
      pickUpTime: 12,
      showOrders: false,
      orders: items,
    });
  });
    
}



onMounted(() => {
  getItems();
})
onUnmounted(() => {
  unsub = true;
})
</script>
    
   <style scoped>
  .ItemsToPrepare {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    background-color: #e0e0e0;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
  }
  
  .ItemsToPrepare:hover {
    background-color: #ddd;
  }
    
  .studentContainer {
    position: relative;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
    margin-bottom: 20px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
  }
  
  .studentContainer:hover {
      transform: translateY(-5px);
  }
  
  .readyButton {
      padding: 8px 16px;
      margin-right: 10px;
      cursor: pointer;
      border: none;
      border-radius: 20px;
      background-color: #4caf50;
      color: white;
      transition: background-color 0.3s;
      margin-bottom: 10px;
  }
  
  .readyButton:hover {
      background-color: #45a049; 
  }
  
  .adjustButton {
      padding: 8px 16px;
      margin-right: 10px;
      cursor: pointer;
      border: none;
      border-radius: 20px;
      background-color: #ff9800; 
      color: white;
      transition: background-color 0.3s;
      margin-bottom: 10px;
  }
  
  .adjustButton:hover {
      background-color: #f57c00; 
  }
  
  .deleteButton {
    padding: 8px 16px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    border: none;
    border-radius: 20px; 
    background-color: #f44336; 
    color: #fff; 
    transition: background-color 0.3s;
    margin-bottom: 10px
  }
  
  .deleteButton:hover {
    background-color: #d32f2f;
  }
  
  .items {
    border: 1px solid #eee;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .items:hover {
      background-color: #f0f0f0;
  }
  
  .items p {
    margin: 5px 0;
  }
  
  .items p:nth-child(even) {
    color: #777;
  }
  
  .toggleButton {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    border: none;
    background: #ddd;
    border-radius: 50%;
    padding: 10px;
    font-size: 1.5em;
    transition: background-color 0.3s, transform 0.3s;
  }
  
  .toggleButton:focus {
    outline: none;
  }
  
  .toggleButton:hover {
      background-color: #ccc; 
  }
  .head{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  
  }
     
  @media (max-width: 600px) {
    .ItemsToPrepare {
      padding: 10px;
    }
  }
  </style>
  