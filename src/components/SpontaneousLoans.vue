<template>
    <div class="studentContainer">
        <div class="studentInfo">
          <p v-if="user.user != 0"> {{ user.user.name }} <button @click="resetUser">switch user</button></p>
          <p v-if="user.user == 1"> User niet gevonden <br>
            Student: <UserSearchbar></UserSearchbar></p>
          <p v-if="user.user == 0">Student: <UserSearchbar></UserSearchbar></p>
          <p>Set date for all</p>
          <VueDatePicker  auto-apply v-model="selectedDate" @update:model-value="handleDateGlobal"  :range="{fixedStart: true }" :min-date= "fullDate" :clearable="false"  >
            <template #trigger>
              <img src="../assets/calendar.png" alt="">
            </template>
          </VueDatePicker>
          <hr>
          <Searchbar :page="page"></Searchbar>
        </div>   
        <div class="itemInfoBox" v-if="cart.items.length != 0">
          <ul class="ordersList">
            <li class="item" v-for="item in cart.items">
              <div class="itemContent">
                <div class="itemDetails">
                  <p>{{ item.Name }}</p>
                  <p v-if="dates.dates[item.Name]">{{dates.dates[item.Name][2]}}/{{dates.dates[item.Name][3]}}/{{ new Date().getFullYear() }}</p>
                  <p v-else> Please select a date</p>
                  <VueDatePicker id="calender" auto-apply v-model="selectedDate" @update:model-value="handleDateSpecific(item)"  :range="{fixedStart: true }" :min-date= "fullDate" :clearable="false"  >
                    <template #trigger>
                      <img id="datePicker" src="../assets/calendar.png" alt="">
                    </template>
                  </VueDatePicker>
                  <Quantity v-if="dates.dates[item.Name]" :item="item"></Quantity>
                </div>
              </div>
            </li>
          </ul>
          <ReservationHandler v-if="allowLoan" :check-user-cart="true" :button-text="'Place loan'" :page="'HomeAdmin'"></ReservationHandler>
        </div>
    </div>
    <AvailabilityHandler :page="'HomeAdmin'"></AvailabilityHandler>
    <Teleport to="body">
      <Popup v-if="itemsToGet.items.length != 0">
        <ul>
          <h1>Items to get:</h1>
          <li v-for="item in itemsToGet.items">{{ item.Serial }}</li>
        </ul>
      </Popup>
    </Teleport>
</template>
<script setup>
import {useStore,useCart,useTrigger, useSelectedUser,useDates,useItemsToGet} from "../Pinia/Store.js"
import Calendar from "./Calendar.vue";
import Items from "./Items.vue";
import ReservationHandler from "./ReservationHandler.vue";
import UserSearchbar from "./UserSearchbar.vue";
import Searchbar from "./Searchbar.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, onMounted, onUnmounted, defineEmits, watchEffect, watch,Teleport } from 'vue';
import Quantity from "./Quantity.vue";
import AvailabilityHandler from "./AvailabilityHandler.vue";
import Popup from "./Popup.vue";



const store = useStore()
const cart = useCart()
const user = useSelectedUser()
const dates = useDates()
const fullDate = new Date()
let selectedDate = ref([new Date()])
const trigger = useTrigger()
const allowLoan = ref(false)
const itemsToGet = useItemsToGet()




let page = "HomeAdmin"

const log = () => {
    console.log(store.results)
}
watchEffect(() => {
    if(dates.allDatesSetToGeneral){
      for(let item of cart.items){
        if(dates.dates[item.Name] == undefined){
          dates.updateDate(item.Name, dates.general)
        }
      }
    }
    for(let item of cart.items){
    if(dates.dates[item.Name] == undefined){
      allowLoan.value = false
      return
    }else{
      allowLoan.value = true
    }
  }
    dates.allDatesSetToGeneral = false
})
const resetUser = () => {
    user.selectUser(0)
}
const handleDateGlobal = () => {
  dates.updateGeneralDates([selectedDate.value[0].getDate(), 
  selectedDate.value[0].getMonth() + 1,
  selectedDate.value[1].getDate(), 
  selectedDate.value[1].getMonth() + 1])
  dates.updateAllDatesToGeneral()
  trigger.fireTrigger()
}
const handleDateSpecific = (item) => {
  dates.updateDate(item.Name, 
  [selectedDate.value[0].getDate(), 
  selectedDate.value[0].getMonth() + 1,
  selectedDate.value[1].getDate(), 
  selectedDate.value[1].getMonth() + 1])
  console.log(dates.dates[item.Name])
  console.log(dates.dates)
  trigger.fireTrigger()
}

</script>
<style scoped>
button {
  background-color: #dc3545;
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
#searchbar{
  display: relative;
  width: 100%;
}
#calender{
  max-width: 100px;
  margin-top: 10px;
}
.ordersList {
  list-style-type: none;
  padding: 0;
  width: 100%;
}
#datePicker{
  width: 50px;
  height: 50px;
}

.item {
  display: relative;
  align-items: center;
  margin-bottom: 10px;
  width: 90%;
  justify-content: center;
  margin-left: 0;
}

.itemContent {
  display: flex;
  align-items: center;
}

.itemCheckbox {
  margin-right: 10px;
}

.itemDetails {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

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
div.search-container.HomeAdmin {
 background-color: red; }
</style>
