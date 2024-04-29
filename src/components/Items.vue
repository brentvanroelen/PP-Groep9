<template>
    <div class="item" v-if="item" :class="{available: item.Available === true}">
        <h3>{{item.Name}}</h3>
        <br>
        <img :src="item.Image" alt="" id="img">
        <p>{{ item.Brand }}</p>
        <p>{{item.Description}}</p>
        <p>Categorie: {{item.Category}}</p>
        <p v-if="item.Available">Beschikbaarheid: Available
        </p>
        <p v-else>Beschikbaarheid: Item niet beschikbaar</p>
     </div>
</template>

<script setup>
import { defineProps } from 'vue'

const {item} = defineProps({
    item: Object
    
})

</script>
 
<style scoped>
h3{
    font-size: 2em;
   
}
.item{
    background-color: white;
    width: 100%;
    height: auto;
    padding: 2em;
    

  }
  #img{
    max-width: 200px;
    max-height: 200px;
  }
  
</style>