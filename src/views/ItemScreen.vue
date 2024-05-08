<template v-if="Item">
    <div id="box">
    <div  id="calendarBox">
      <Calendar></Calendar>
    </div>
    <div id="itemBox">
      <Items :item="Item"></Items>
      <div id="extraInfo">
  <div id="quantity">
    <p><b>Quantity:</b></p>
    <select @change="setQuantity" v-model="selectedOption">
      <option v-for="value in options" :key="value"> {{ options[value-1] }}</option>
    </select>
  </div>

  <div id="checkbox">
    <label for="checkbox1"><b>For project:</b></label>
    <input type="checkbox" id="checkbox1" v-model="checked">
    <a href="">&#9432;</a>
  </div>
</div>
    </div>
  </div>
  
  <div id="buttons">
      <button @click="addItemToCart()">Add to cart</button>
      <ReservationHandler></ReservationHandler>
  </div>

        <Footer></Footer>
  </template>
  
  
  <script setup>
  import Footer from "../components/Footer.vue"
  import ReservationHandler from "@/components/ReservationHandler.vue";
  import { computed } from "../main.js";
  import { useRouter } from 'vue-router';
  import Items from "@/components/Items.vue";
  import Calendar from "@/components/Calendar.vue";
  import {ref, reactive} from 'vue';
  import { useStore,useCart,useQuantity,useChoiceOfItems,useDates } from '@/Pinia/Store';

  const props = defineProps({
    Name: String
  });
  const selectedOption = ref(1);
  const test = ref([]);
  const cart = useCart();
  const availableInstances = useChoiceOfItems();
  const checked = ref(false);
  const router = useRouter();
  const params = router.currentRoute.value.params;
  const store = useStore();
  const results = computed(() => store.results);
  const Item = results.value.find(item => item.Name === params.Name);
  const quantity = useQuantity();
  const dates = useDates();

  
  let options = computed(() => {
    let amountAvailable = [];  
    for (let i = 1; i <= availableInstances.getInstance(1).length ; i++) {
      amountAvailable.push(i);
    }
    return amountAvailable;
  });

  for (let i = 1; i <= Item.AvailableAmount; i++) {
    test.value.push(i);
  }
  const setQuantity = () => {
    quantity.setQuantity(selectedOption.value);
  }

  const addItemToCart = () => {
    console.log(Item);
    cart.addItem(Item);
    console.log(cart.items);
    cart.addEndDate(dates.endDate + "/" + dates.endMonth);
    cart.addStartDate(dates.startDate + "/" + dates.startMonth);
    cart.addStartDate
    console.log(cart.startDate);
    console.log(cart.endDate);
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
    width: 600px;
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
  #buttons{
    width: 500px;
    display: flex;
    justify-content: center;
    margin: auto;
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