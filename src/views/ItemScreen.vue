<template v-if="Item">
    <div id="box">
    <div  id="calendarBox">
      <Calendar :isKit="Item.isKit" :item="Item.Name" :page="page"></Calendar>
    </div>
    <div id="itemBox">
      <Items :item="Item"></Items>
      <div id="extraInfo">
      <Quantity v-if="!Item.isKit" :item="Item"></Quantity>
      <section v-if="dates.general.length != 0">
        <p v-if="Item.isKit && available"> Kit is Available</p>
        <p v-if="available == undefined"></p>
        <p v-if="Item.isKit && !available"> Kit is Unavailable</p>
      </section>
</div>
  </div>
  </div>
  
  <div id="buttons">
      <button @click="addItemToCart()">Add to cart</button>
      <ReservationHandler :check-user-cart="false" :button-text="'Reserve item'"></ReservationHandler>
  </div>
  <Popup v-if="popupVisible" :message="popupMessage" @close="popupVisible = false" />
</template>
  
  
<script setup>
  import Footer from "../components/Footer.vue"
  import ReservationHandler from "@/components/ReservationHandler.vue";
  import { computed } from "../main.js";
  import { useRouter } from 'vue-router';
  import Items from "@/components/Items.vue";
  import Calendar from "@/components/Calendar.vue";
  import Quantity from "@/components/Quantity.vue";
  import {ref, reactive} from 'vue';
  import { useStore,useCart,useQuantity,useChoiceOfItems,useDates } from '@/Pinia/Store';
  import Popup from "@/components/Popup.vue";

const props = defineProps({
  Name: String,
});
const cart = useCart();
const quantity = useQuantity();
const router = useRouter();
const store = useStore();
const dates = useDates();
const checked = ref(false);
const params = router.currentRoute.value.params;
const results = computed(() => store.results);
const Item = results.value.find(item => item.Name === params.Name);
const page = "UserHome";
const available = ref(quantity.available[Item.Name]);
const popupVisible = ref(false);
const popupMessage = ref('');




  const showPopup = (message) => {
  popupMessage.value = message;
  popupVisible.value = true;
};

const addItemToCart = () => {
  if(dates.general == []){
    console.log("Please select a date range and a quantity")
  }else if(Item.isKit){
    if(available){
      dates.updateDate(Item.Name, dates.general)
      cart.addItem(Item);
    }else{
      console.log("Kit is not available")
    }
  }else{
    if(quantity.getQuantity(Item.Name) == 0){
      quantity.setQuantity(Item.Name, 1)
    }
    dates.updateDate(Item.Name, dates.general)
    console.log(Item);
    cart.addItem(Item);
    console.log(cart.items);
    showPopup('This item is added to your cart!');        
  }
}

</script>

  <style scoped>
    #box {
    display: flex;
    flex-direction: row;
    justify-content: center; 
    flex-wrap: wrap;
  }
  #itemBox{
    width: 675px;
    margin: 2em;
    background-color: #D9D9D9;
    padding: 1em;
    border-radius: .5em;
  }
  #calendarBox{
    width: 500px;
    margin: 2em;
  }
  button{
    background-color: #dc3545;
    border: none;
    padding: 10px;
    cursor: pointer;
    margin: 1em;
    color: white;
    border-radius: 20px;
    width: 300px;
    height: 50px;
  }
  button:hover{
    background-color: #c82333;
  }
  #quantity{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 120px;
  }
  #checkbox{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 140px;
  }
  .item{
    width: 500px;
    background-color: white;
  }
 #extraInfo{
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 300px;
 }
  #photo {
    max-width: 200px;
    max-height: 200px;
  } 
  
   #pfotoDiv {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .searchcontainer {
    position: relative;
    margin-bottom: 20px;
  }
  
  .searchbar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black overlay */
  }
  
  .searchbar {
    z-index: 1; /* Ensure searchbar stays on top of overlay */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  h1 {
    text-align: center;
    font-size: 30px;
    margin-top: 20px;
  }
  
  .itemDescription {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .forProject {
    margin-top: 10px;
  }
  
  /* Adjustments for mobile devices */
  @media (max-width: 768px) {
    #pfotoDiv {
      margin-left: 10%;
      margin-right: 10%;
    }
  }
  </style>