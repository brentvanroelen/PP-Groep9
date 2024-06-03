<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-if="!loading">
    <div class="ItemsToPrepare" v-if="!showLateReservations">
      <div v-if="students.length == 0">
        <p>No Scheduled Loans for {{ displayDate }}</p>
      </div>
        <!-- Loept door de students -->
      <div v-for="student in students" :key="student.id" class="studentContainer">
        <div class="studentInfo">
          <p>Student: {{ student.name }}</p>
          <p>Pick-up date: {{ student.pickUpDate }}</p>
          <p>Pick-up time: {{ student.pickUpTime }}</p>
          <p v-if="student.reservationPrepared">The reservation is prepared</p>
          <p v-else>Status: {{ student.itemsToPrepare }} item{{ student.itemsToPrepare > 1 ? 's' : '' }} left to prepare</p>
        </div>
        <div id="buttons">
        <button @click="markAsPickedUp(student)" class="readyButton">Loan picked up</button>
        <button @click="discardReservation(student,false,false)" class="deleteButton">Discard</button>
        </div>
        <br>        
        <button @click="toggleOrders(student)" id="toggleMenu">&#129171;</button>
        <!-- lijst met reservaties van de studenten-->
        <ul v-if="student.showOrders" class="ordersList">
          <button @click="markAllItemsAsPrepared(student)" class="readyButton">Everything is ready</button>
        <button class="adjustButton">Adjustments</button>
          <!-- Loept door de reservaties -->
          <li v-for="item in student.orders" :key="item.id" class="items">
            <p>Name: {{ item.ItemName }}</p>
            <p>Serial: {{ item.Serial }}</p>
            <p> Status: {{ item.itemStatus }}</p>
            <button @click="markItemAsPrepared(student, item)" class= readyButton> item prepared</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="ItemsToPrepare" v-if="showLateReservations">
      <div v-if="lateReservationArray.length == 0">
        <p>No late loans</p>
      </div>
        <!-- Loept door de students -->
      <div v-for="student in lateReservationArray" :key="student.id" class="studentContainer">
        <div class="studentInfo">
          <p>Student: {{ student.name }}</p>
          <p>Pick-up date: {{ student.pickUpDate }}</p>
          <p>Pick-up time: {{ student.pickUpTime }}</p>
          <p v-if="student.reservationPrepared">The reservation is prepared</p>
          <p v-else>Status: {{ student.itemsToPrepare }} item{{ student.itemsToPrepare > 1 ? 's' : '' }} left to prepare</p>
        </div>
        <button @click="markAsPickedUp(student)" class="readyButton">Loan picked up</button>
        <button @click="discardReservation(student,false,false)" class="deleteButton">Discard</button>
        <button @click="discardReservation(student,true,false)" class="deleteButton">Discard + warning</button>
        <br>        
        <button @click="toggleOrders(student)">&#9776;</button>
        <!-- lijst met reservaties van de studenten-->
        <ul v-if="student.showOrders" class="ordersList">
          <button @click="markAllItemsAsPrepared(student)" class="readyButton">Everything is ready</button>
        <button class="adjustButton">Adjustments</button>
          <!-- Loept door de reservaties -->
          <li v-for="item in student.orders" :key="item.id" class="items">
            <p>Name: {{ item.ItemName }}</p>
            <p>Serial: {{ item.Serial }}</p>
            <p> Status: {{ item.itemStatus }}</p>
            <button @click="markItemAsPrepared(student, item)" class= readyButton> item prepared</button>
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
let loading = ref(true);
const allReservations = ref([]);
const lateReservationArray = ref([]);
const deletedReservation = ref([]);
const runAlignFunction = ref(true);
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
  const q = query(reservations, where("StartDate", "==", props.todayDate.getDate()), where("StartMonth", "==", props.todayDate.getMonth() + 1),where ("CurrentlyWithUser", "==", false));
  const querySnapshot = await getDocs(q);
  if(querySnapshot.empty){
    loading.value = false;
  }
  querySnapshot.forEach(async(doc) => {
    let itemsToPrepare = 0;
    let items = [];
    for (let i = 1; i <= doc.data().allItemSerials.length; i++) {
      items.push(doc.data()[`Item${i}`]);
      if(doc.data()[`Item${i}`].ItemPrepared == false){
          itemsToPrepare++;
      }
      console.log(await isItemWithSomeoneElse(items[i-1]))
      if(await isItemWithSomeoneElse(items[i-1]) == false){
        items[i-1].itemStatus = "Item is in the medialab";
      }else{
        await isItemWithSomeoneElse(items[i-1]).then((data) => {
          let currentDate = new Date();
          currentDate.setHours(0,0,0,0);
          let date = new Date();
          date.setDate(data.EndDate);
          date.setMonth(data.EndMonth - 1);
          if(date < currentDate){
            const amountOfDaysLate = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
            items[i-1].itemStatus = `Item is with ${data.UserFirstName} ${data.UserLastName} and they are ${amountOfDaysLate} day${amountOfDaysLate > 1 ? 's' : ''} late in returning the item`;
          }else{
            items[i-1].itemStatus = `Item is with ${data.UserFirstName} ${data.UserLastName} until ${data.EndDate}/${data.EndMonth}`;
          }
        });
      }
    }
    let date = new Date();
    date.setDate(doc.data().StartDate);
    date.setMonth(doc.data().StartMonth);
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
      reservationPrepared: doc.data().ReservationPrepared,
      itemsToPrepare: itemsToPrepare
    });
    if(loading){
      loading.value = false;
    }
  });

}


const filterAllReservationsOnLateness = () =>{
  const generalReservations = allReservations.value.filter(reservation => {
    let reservationDate = new Date(props.todayDate.getFullYear(), reservation.StartMonth - 1, reservation.StartDate);
    return reservationDate == props.todayDate
  })
  const lateReservations = allReservations.value.filter(reservation => {
    let reservationDate = new Date(props.todayDate.getFullYear(), reservation.StartMonth - 1, reservation.StartDate);
    return reservationDate.setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
  });
  return [generalReservations, lateReservations]
}

const alignWithStudents = async() =>{
  const [generalReservations, lateReservations] = filterAllReservationsOnLateness();
  for (let reservation of generalReservations) {
    if(students.value.find(s => s.id === reservation.id)){
      generalReservations.splice(generalReservations.indexOf(reservation), 1);
    }else{
      let itemsToPrepare = 0;
      let items = [];
      for (let i = 1; i <= reservation.allItemSerials.length; i++) {
        items.push(reservation[`Item${i}`]);
        if(reservation[`Item${i}`].ItemPrepared == false){
          itemsToPrepare++;
        }
        if(await isItemWithSomeoneElse(items[i-1]) == false){
          items[i-1].itemStatus = "Item is in the medialab";
        }else{
          await isItemWithSomeoneElse(items[i-1]).then((data) => {
            let currentDate = new Date();
            currentDate.setHours(0,0,0,0);
            let date = new Date();
            date.setDate(data.EndDate);
            date.setMonth(data.EndMonth - 1);
            if(date < currentDate){
              const amountOfDaysLate = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
              items[i-1].itemStatus = `Item is with ${data.UserFirstName} ${data.UserLastName} and they are ${amountOfDaysLate} day${amountOfDaysLate > 1 ? 's' : ''} late in returning the item`;
            }else{
              items[i-1].itemStatus = `Item is with ${data.UserFirstName} ${data.UserLastName} until ${data.EndDate}/${data.EndMonth}`;
            }
          });
        }
      }
      let date = new Date();
      date.setDate(doc.data().StartDate);
      date.setMonth(doc.data().StartMonth);
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
        reservationPrepared: reservation.ReservationPrepared,
        itemsToPrepare: itemsToPrepare
      })
    }
  };	    
  for(let reservation of lateReservations){
    let itemsToPrepare = 0;
    let items = [];
    for (let i = 1; i <= reservation.allItemSerials.length; i++) {
      items.push(reservation[`Item${i}`]);
      if(reservation[`Item${i}`].ItemPrepared == false){
          itemsToPrepare++;
        }
        if(await isItemWithSomeoneElse(items[i-1]) == false){
          items[i-1].itemStatus = "Item is in the medialab";
        }else{
          await isItemWithSomeoneElse(items[i-1]).then((data) => {
            let currentDate = new Date();
            currentDate.setHours(0,0,0,0);
            let date = new Date();
            date.setDate(data.StartDate);
            date.setMonth(data.StartMonth - 1);
            if(date < currentDate){
              const amountOfDaysLate = Math.floor((props.todayDate - date) / (1000 * 60 * 60 * 24));
              items[i-1].itemStatus = `Item is with ${data.UserFirstName} ${data.UserLastName} and they are ${amountOfDaysLate} day${amountOfDaysLate > 1 ? 's' : ''} late in returning the item`;
            }else{
              items[i-1].itemStatus = `Item is with ${data.UserFirstName} ${data.UserLastName} until ${data.EndDate}/${data.EndMonth}`;
            }
          });
        }
    }
    let date = new Date();
    date.setDate(reservation.StartDate);
    date.setMonth(reservation.StartMonth);
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
      reservationPrepared: reservation.ReservationPrepared,
      itemsToPrepare: itemsToPrepare
    });
  };
}


const markItemAsPrepared = async(student, item) => {
  student.itemsToPrepare--;
  item.itemPrepared = true;
  const docRef = doc(db, `Utility/Reservations/All Reservations/${student.id}`);
  const itemid = `Item${item.id}`
  if(student.itemsToPrepare == 0){
      student.reservationPrepared = true;
      await updateDoc(docRef, {
        [`${itemid}.ItemPrepared`]: true,
        ReservationPrepared : true
      });
  }else{
      await updateDoc(docRef, {
        [`${itemid}.ItemPrepared`]: true,
      }
      );
  }
  showPopup('Item prepared');
}

const markAllItemsAsPrepared = async(student) => {
  student.orders.forEach(item => {
    item.itemPrepared = true;
  });
  student.itemsToPrepare = 0;
  student.reservationPrepared = true;
  const docRef = doc(db, `Utility/Reservations/All Reservations/${student.id}`);
  const itemid = `Item${item.id}`
  for(let i = 1; i <= student.orders.length; i++){
    await setDoc(docRef, {
      [`${itemid}.ItemPrepared`]: true,
      ReservationPrepared : true,
    });;
  }
  showPopup('All items prepared');
}

const isItemWithSomeoneElse = async(item) => {
  const q = query(collection(db, 'Utility/Reservations/All Reservations'), where("allItemSerials", "array-contains-any", [item.Serial]));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size == 1) {
    return false;
  } else {
    for (let doc of querySnapshot.docs) {
      if (doc.data().CurrentlyWithUser) {
        console.log("Currently with user")
        return doc.data();
      } else {
        console.log("Not with user")
      }
    }
    return false;
  }
};
const markAsPickedUp = async (reservation) => {
  await updateDoc(doc(db, `Users/${reservation.userid}/Reservations/${reservation.id}`), {
    CurrentlyWithUser: true
  })
  await updateDoc(doc(db, `Utility/Reservations/All Reservations/${reservation.id}`), {
    CurrentlyWithUser: true
  })
  const index = students.value.findIndex(s => s.id === reservation.id);
  if (index !== -1) {
    students.value.splice(index, 1);
  };
  
  showPopup('Item(s) picked up');
 
};

const discardReservation = async (reservation,warning,sendEmail) => {
  await reservationReturnedOrCanceled(reservation,warning,sendEmail);
  deletedReservation.value.push(reservation);
  const index = students.value.findIndex(s => s.id === reservation.id);
  const indexLate = lateReservationArray.value.findIndex(s => s.id === reservation.id);
  if (index !== -1) {
    students.value.splice(index, 1);
  }else if(indexLate !== -1){
    lateReservationArray.value = [];
    allReservations.value = [];
  }
  showPopup('Reservation discarded');
};


onMounted(() => {
  getItems();
})
onUnmounted(() => {
  unsub = true;
})

const reservations = collection(db, 'Utility/Reservations/All Reservations');
const unsubscribe = onSnapshot(reservations, async(querySnapshot) => {
  allReservations.value = [];
  lateReservationArray.value = [];
  querySnapshot.forEach((doc) => {
    if(deletedReservation.value.length != 0){
      if(doc.data().id === deletedReservation.value[0].id){
        return
      }
    }
    allReservations.value.push(doc.data());
  });
  if(unsub){
    unsubscribe();
  }
  await alignWithStudents();

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
  .studentInfo{
    margin-bottom: 20px;
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
    background-color: #dc3545; 
    color: #fff; 
    transition: background-color 0.3s;
    margin-bottom: 10px
  }
  
  .deleteButton:hover {
    background-color: #c82333;
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
  #toggleMenu{
      border: none;
      background-color: white;
      cursor: pointer;
      font-size: 36px;

  }

  </style>
  