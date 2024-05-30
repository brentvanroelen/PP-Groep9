<template>
    <div class="item" v-if="item && !item.isKit" :class="{available: item.Available === true}">
      <div id="itemMain">
        <h3>{{item.Name}}</h3>
        <br>
        <img :src="image" alt="" id="img">
      </div>
      <div id="itemInfo">
        <p><b>Brand: </b>{{ item.Brand }}</p>
        <p><b>Item description: </b>{{item.Description}}</p>
        <p><b>Categorie:</b> {{item.Category}}</p>
        <p v-if="item.Available"><b>Beschikbaarheid: </b>Available 
        </p>
        <p v-else><b>Beschikbaarheid:</b> Item niet beschikbaar</p>
      </div>
      <div v-if="loan == true" id="quantity">
        <Quantity :item="item" />  
     </div>
    </div>
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
</template>

<script setup>
import {onMounted, ref as vueRef} from 'vue';
import Quantity from './Quantity.vue';
import { imageGetter } from '@/js/functions';
const image = vueRef('');
const {item,loan,arraynumber} = defineProps({
    item: Object,
    loan: Boolean,
})



onMounted(() => {
  console.log(item.isKit)
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

console.log(item.Name)

</script>
 
<style scoped>
.available{
    margin-left: 5px;
    margin-right: 0px;;
}
.item{
  max-width: 600px; 
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
#itemInfo{
    display: flex;
    flex-direction: column;
    align-items:start;
}
p{
    padding: 0.3em;
}
#img{
  min-width: 200px;
}
#itemMain{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
}
.itemInfo{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
}
h3{
    font-size: 2em;
   
}
.item{
    width: 100%;
    height: auto;
    padding: 2em;

  }
  #img{
    width: 200px;
    height: 200px;
  }
</style>