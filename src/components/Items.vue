<template>
    <div class="item" v-if="item">
         
         <h3>{{item.Name}}</h3>
         <img :src="item.Image" alt="">
         <p>{{ item.Brand }}</p>
         <p>{{item.Description}}</p>
         <br>
         <p>Categorie: {{item.Category}}</p>
         <p v-if="item.beschikbaar">Beschikbaarheid: Morgen afhaalbaar
             <br>
             <br>
             <a v-if="item.beschikbaar">add to Cart</a>
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

</style>