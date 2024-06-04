<template>
  <div class="item" v-if="item && !item.isKit" :class="{available: dates.general.length != 0 && loan==true && availableInstances.items[item.Name]!= undefined && availableInstances.items[item.Name].length !== 0,unavailable: dates.general.length != 0 &&loan==true && availableInstances.items[item.Name]!= undefined && availableInstances.items[item.Name].length == 0}">
    <router-link @click="updateStore(item)" class="routerlink" :to="'/ItemScreen/' + item.Name">
      <div id="itemMain">
        <h3>{{item.Name}}</h3>
        <br>
        <img :src="image" alt="" id="img">
      </div>
      <div id="itemInfo">
        <p><b>Brand: </b>{{ item.Brand }}</p>
        <p><b>Item description: </b>{{item.Description}}</p>
        <p><b>Categorie:</b> {{item.Category}}</p>
        <p v-if="item.Available"><b>Availability: </b>Available 
        </p>
        <p v-else><b>Availability:</b> Item niet beschikbaar</p>
      </div>
    </router-link>
      <div v-if="loan == true && dates.general.length != 0" id="quantity">
        <Quantity :item="item" />
        <ReservationHandler v-if='availableInstances.items[item.Name] != undefined && availableInstances.items[item.Name].length != 0' :button-text="'Place Reservation'" :item="item" :check-user-cart="false" :page="'UserHome'" />
        <button id="cartbutton" @click="addItemToCart">Add to cart</button>
     </div>
  </div>
  <router-link @click="updateStore(item)" class="routerlink" :to="'/ItemScreen/' + item.Name">
    <div class="item" v-if="item && item.isKit" :class="{available: item.Available === true}">
      <div id="itemMain">
        <h3>{{item.Name}}</h3>
        <br>
        <img :src="image" alt="" id="img">
      </div>
      <div id="itemInfo">
        <p><b>Item description: </b>{{item.Description}}</p>
        <p><b>Kit contains: </b></p>
        <ul>
          <li v-for="kitItem in item.Items">{{kitItem}}</li>
        </ul>
      </div>
      <div v-if="loan == true" id="quantity">
        <Quantity :item="item" />  
     </div>
    </div>
  </router-link>
  <Teleport to="body" v-if="popupVisible">
     <Popup :message="popupMessage" @close="popupVisible = false"  class="Popup" />
  </Teleport>
</template>

<script setup>
import {onMounted, ref as vueRef} from 'vue';
import Quantity from './Quantity.vue';
import ReservationHandler from './ReservationHandler.vue';
import { useChoiceOfItems,useDates,useStore,useQuantity,useCart } from '@/Pinia/Store';
import { imageGetter } from '@/js/functions';
import Popup from '@/components/Popup.vue';


const store = useStore();
const image = vueRef('');
const dates = useDates();
const availableInstances = useChoiceOfItems();
const {item,loan,arraynumber} = defineProps({
    item: Object,
    loan: Boolean,
})
const cart = useCart();
const quantity = useQuantity();
const Item = item;
const page = "UserHome";
const available = vueRef(quantity.available[Item.Name]);
const popupVisible = vueRef(false);
const popupMessage = vueRef('');


const updateStore = (item) => {
    store.updateResults([item]);
}



onMounted(() => {
  if(item.isKit){
    imageGetter(`KitImages/${item.KitImage}`).then((res) => {
      image.value = res;
    })
  }else{
    imageGetter(`ItemImages/${item.Image}`).then((res) => {
    image.value = res;
    })
  }
})
const showPopup = (message) => {
  popupMessage.value = message;
  popupVisible.value = true;

  setTimeout(() => {
    popupVisible.value = false;
  }, 1000);
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
    cart.addItem(Item);
    showPopup('This item is added to your cart!');
  }

}

</script>
 
<style scoped>
.item {
    min-width: 400px;
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: transform 0.3s ease;
}

.item:hover {
    transform: translateY(-5px);
}

.routerlink {
    text-decoration: none;
    color: inherit;
}

#itemMain {
    text-align: center;
}

#itemMain h3 {
    margin-bottom: 10px;
    font-size: 24px;
    color: #333;
}

#img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 20px;
}

#itemInfo p {
    margin: 5px 0;
    color: #555;
    font-size: 16px;
}

#itemInfo b {
    color: #333;
}

#quantity {
    margin-top: 20px;
}

.available {
    border-color: #28a745;
}

.available #itemInfo p {
    color: #28a745;
}
.unavailable{
    border-color: #dc3545;
}
.unavailable #itemInfo p{
    color: #dc3545; 
}

#cartbutton{
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
#cartbutton:hover{
  background-color: #c82333;
}
#img{
  width: 200px;
  height: 200px;
}
.Popup{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  
}

</style>