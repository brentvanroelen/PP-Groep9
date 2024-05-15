<template>
    <label>User: </label> <input type="text" name="" id=""><br>
      <label for="ItemorKITname">Item or KIT name: </label>
      <p >Return date: </p> <Calendar :page="page"></Calendar><br>
      <div v-if="cart.items != undefined">
            <p>Items in loan: </p> 
            <div class="item" v-for="(item, Index) in cart.items" :key="Index">
                <Items :item="item" :loan="true"></Items>
            </div>
            <br>
      </div>
      <label for="returnTime">Return time: </label><input type="time">
      <div>
        <ReservationHandler :check-user-cart="true"></ReservationHandler>
      </div>
</template>
<script setup>
import {useStore,useCart} from "../Pinia/Store.js"
import Calendar from "./Calendar.vue";
import Items from "./Items.vue";
import ReservationHandler from "./ReservationHandler.vue";

const store = useStore()
const cart = useCart()


let page = "HomeAdmin"

const log = () => {
    console.log(store.results)
}

</script>
<style scoped>

template{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 5%;
}
.homeAdminSearch{
    margin-top: 5%;
    margin-bottom: 5%;
    width: 50%;
    height: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 25%;
    margin-right: 25%;

}
.item{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    background-color: lightblue;
}
</style>
