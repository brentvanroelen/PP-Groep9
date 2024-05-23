<template>
    <div class="studentContainer">
        <div class="studentInfo">
          <p v-if="user.user != 0"> {{ user.user.name }} <button @click="resetUser">switch user</button></p>
          <p v-if="user.user == 1"> User niet gevonden <br>
            Student: <UserSearchbar></UserSearchbar></p>
          <p v-if="user.user == 0">Student: <UserSearchbar></UserSearchbar></p>
          <p>Scheduled Return Date: test</p>
          <VueDatePicker  auto-apply v-model="selectedDate" @update:model-value="handleDate"  :range="{fixedStart: true }" :min-date= "fullDate" :clearable="false"  ></VueDatePicker>
        </div>   
        <button>&#9776;</button>
        <div class="itemInfoBox">
          <ul class="ordersList">
            <li class="item">
              <div class="itemContent">
                <input type="checkbox" class="itemCheckbox">
                <div class="itemDetails">
                  <p>Name: test</p>
                  <p>Serial: test</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
    </div>
</template>
<script setup>
import {useStore,useCart, useSelectedUser} from "../Pinia/Store.js"
import Calendar from "./Calendar.vue";
import Items from "./Items.vue";
import ReservationHandler from "./ReservationHandler.vue";
import UserSearchbar from "./UserSearchbar.vue";
import Searchbar from "./Searchbar.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, onMounted, onUnmounted, defineEmits } from 'vue';


const store = useStore()
const cart = useCart()
const user = useSelectedUser()
const fullDate = new Date()
let selectedDate = ref([new Date()])


let page = "HomeAdmin"

const log = () => {
    console.log(store.results)
}

const resetUser = () => {
    user.selectUser(0)
}
const handleDate = () => {
  console.log(selectedDate.value)
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
