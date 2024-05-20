<template>
  <div class="earlyReturnBox">
    <h2>Early Returns</h2>
    <label for="ItemorKITname">Item Serial Number: </label>
    <SearchBarAdmin :page="'HomeAdmin'"></SearchBarAdmin>
    <br>
    <div v-if="EarlyReservations.Reservations.length != 0" v-for="reservation in EarlyReservations.Reservations" :key="reservation.id" class="studentContainer">
        <div class="studentInfo">
          <p>Student: {{ reservation.UserFirstName }}  {{ reservation.UserLastName }}</p>
          <p>Scheduled Return Date: {{ reservation.EndDate }}/{{ reservation.EndMonth }}/2024</p>
        </div>   
        <button @click="toggleOrders(reservation)">&#9776;</button>
        <div v-if="reservation.showItems" class="itemInfoBox">
          <ul class="ordersList">
            <li v-for="item in reservation.Items" :key="item.id" class="item">
              <div class="itemContent">
                <input type="checkbox" class="itemCheckbox" :value=item v-model="selectedItems" @click="log">
                <div class="itemDetails">
                  <p>Name: {{ item.ItemName }}</p>
                  <p>Serial: {{ item.Serial }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
    </div>
    <br>
    <div v-if="chosenReservation != null" class="buttons">
      <button @click="selectionReturned(false)">Selection returned</button>
      <button @click="selectionReturned(true)">Selection returned + check</button>
      <button @click="everythingReturned(false)">Everything returned</button>
      <button @click="everythingReturned(true)">Everything returned + check</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import SearchBarAdmin from './SearchBarAdmin.vue';
import { useEarlyReturnsReservations} from '@/Pinia/Store.js';
import { reservationReturnedOrCanceled } from '@/js/functions';
import { collection, db,deleteField,doc,getDoc, getDocs, updateDoc,query,increment,where } from '../Firebase/Index.js';

const EarlyReservations = useEarlyReturnsReservations();
console.log(EarlyReservations.Reservations)
const stashedReservations = ref([])
let chosenReservation = ref(null)
let selectedItems = ref([])


const log = () => {
  setTimeout(() => {
    console.log(selectedItems.value)
  }, 100)
}
const toggleOrders = (reservation) => {
  reservation.showItems = !reservation.showItems;
  if(reservation.showItems){
    stashedReservations.value = EarlyReservations.Reservations
    EarlyReservations.Reservations = [reservation]
    chosenReservation.value = reservation
  }else{
    EarlyReservations.Reservations = stashedReservations.value
    stashedReservations.value = []
    chosenReservation.value = null
  }
}


const everythingReturned = async(check) => {
  if(check){
    /* Work in progress*/ 
  }else{
    await reservationReturnedOrCanceled(chosenReservation.value, false)
  }
}
const selectionReturned = async(check) => {
  if(check){
    /* Work in progress*/ 
  }else{
    await selectionReturnedHandler()
  }
}



const selectionReturnedHandler = async() => {
  const cRef = collection(db, "Utility/Rerservations/All Reservations")
  const docRefSelectedResAdmin = doc(db, `Utility/Reservations/All Reservations/${chosenReservation.value.id}`)
  const docRefSelectedResUser = doc(db, `Users/${chosenReservation.value.User}/Reservations/${chosenReservation.value.id}`)
  const docRefSelectedResGeneral = doc(db, `Reservations/${chosenReservation.value.id}`)
  for(let item of selectedItems.value){
    let itemName = item.ItemName.charAt(0).toUpperCase() 
    + item.ItemName.slice(1)         
    const q = query(cRef, where("allItemSerials", "array-contains-any", [item.Serial]))
    const querySnapshot = await getDocs(q)
    if(querySnapshot.size == 1){
      const doc = doc(db, `Items/${itemName}/${itemName} items/${item.Serial}`)
      await updateDoc(doc, {
        Reserved: false
      })
      await updateDoc(doc(db, `Items/${itemName}`), {
        AvailableAmount: increment(1)
      })
    }
    for(let i = 1; i <= chosenReservation.value.allItemSerials.length; i++){
      if(chosenReservation.value.allItemSerials.length == 1){
        reservationReturnedOrCanceled(chosenReservation.value, false)
      }else{
        if(chosenReservation.value.allItemSerials[i-1] == item.Serial){
          const serialPrefix = item.Serial.split('-')[0];
          const matchingItems = chosenReservation.value.allItemSerials.filter(serial => serial.split('-')[0] === serialPrefix);
          if(matchingItems.length === 1){
            await updateDoc(docRefSelectedResAdmin, {
              [`Item${i}`]: deleteField(),
              allItemNames: chosenReservation.value.allItemNames.filter((name) => name != item.ItemName),
              allItemSerials: chosenReservation.value.allItemSerials.filter((serial) => serial != item.Serial),
              ItemSerials: chosenReservation.value.ItemSerials.filter((serialseries) => serialseries != serialPrefix)
            })
            await updateDoc(docRefSelectedResUser, {
              [`Item${i}`]: deleteField(),
              allItemNames: chosenReservation.value.allItemNames.filter((name) => name != item.ItemName),
              allItemSerials: chosenReservation.value.allItemSerials.filter((serial) => serial != item.Serial),
              ItemSerials: chosenReservation.value.ItemSerials.filter((serialseries) => serialseries != serialPrefix)
            })
            await updateDoc(docRefSelectedResGeneral, {
              [`Item${i}`]: deleteField(),
              allItemNames: chosenReservation.value.allItemNames.filter((name) => name != item.ItemName),
              allItemSerials: chosenReservation.value.allItemSerials.filter((serial) => serial != item.Serial),
              ItemSerials: chosenReservation.value.ItemSerials.filter((serialseries) => serialseries != serialPrefix)
            })
          }else{
            let index = chosenReservation.value.allItemNames.findIndex(name => name === item.ItemName);
            await updateDoc(docRefSelectedResAdmin, {
              [`Item${i}`]: deleteField(),
              allItemNames: chosenReservation.value.allItemNames.splice(index, 1),
              allItemSerials: chosenReservation.value.allItemSerials.filter((serial) => serial != item.Serial),
            })
            await updateDoc(docRefSelectedResUser, {
              [`Item${i}`]: deleteField(),
              allItemNames: chosenReservation.value.allItemNames.splice(index, 1),
              allItemSerials: chosenReservation.value.allItemSerials.filter((serial) => serial != item.Serial),
            })
            await updateDoc(docRefSelectedResGeneral, {
              [`Item${i}`]: deleteField(),
              allItemNames: chosenReservation.value.allItemNames.splice(index, 1),
              allItemSerials: chosenReservation.value.allItemSerials.filter((serial) => serial != item.Serial),
            })
          }  
        }
      }
    }
  }
  await refactorReservation()
}

const refactorReservation =  async() => {
  const docRefSelectedResAdmin = doc(db, `Utility/Reservations/All Reservations/${chosenReservation.value.id}`)
  const docRefSelectedResUser = doc(db, `Users/${chosenReservation.value.User}/Reservations/${chosenReservation.value.id}`)
  const docRefSelectedResGeneral = doc(db, `Reservations/${chosenReservation.value.id}`)
  let refactoredItems = {}
  let items = {}
  const reservation = (await getDoc(docRefSelectedResAdmin)).data()
  const ItemsInReservation = reservation.allItemSerials.length
  let itemsFound = 0
  let itemnumber = 1
  let newItemNumber = 1

  while(itemsFound != ItemsInReservation){
    if(reservation[`Item${itemnumber}`] != undefined){
      items[`Item${itemnumber}`] = reservation[`Item${itemnumber}`]
      await updateDoc(docRefSelectedResAdmin, {
        [`Item${itemnumber}`]: deleteField()
      })
      await updateDoc(docRefSelectedResUser, {
        [`Item${itemnumber}`]: deleteField()
      })
      await updateDoc(docRefSelectedResGeneral, {
        [`Item${itemnumber}`]: deleteField()
      })
      itemsFound++
    }
    itemnumber++
  }
  for (const key in items) {
    if (items.hasOwnProperty(key) && key.startsWith('Item')) {
      refactoredItems['Item' + newItemNumber] = items[key];
      newItemNumber++;
    }
  }
  await updateDoc(docRefSelectedResAdmin,{
    ...refactoredItems
  })
  await updateDoc(docRefSelectedResUser,{
    ...refactoredItems
  })
  await updateDoc(docRefSelectedResGeneral,{
    ...refactoredItems
  })
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
.itemInfoBox{
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;

}
.earlyReturnBox{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
  background: #e0e0e0;
}
.itemInfoBox {
  padding: 10px;
}

.ordersList {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
  justify-content: center;
}

.itemContent {
  display: flex;
  align-items: center;
  justify-content: center;
}

.itemCheckbox {
  margin-right: 10px;
}

.itemDetails {
  display: flex;
  flex-direction: column;
}
.studentContainer{
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
}
.buttons{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
}
</style>