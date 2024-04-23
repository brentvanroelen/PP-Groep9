<template>
    <div class="items">
    <h1>Product Screen</h1>
    <section class="itemslisting">
        <div class="item" v-for="item in Items" :key="item.id" :class="{available: item.beschikbaar === true}">
            <h3>{{item.Name}}</h3>
            <br>
            <img :src="item.Picture" alt="">
            <p>Categorie: {{item.Category}}</p>
            <p v-if="item.beschikbaar">Beschikbaarheid: Morgen afhaalbaar
                <br>
                <br>
                <a v-if="item.beschikbaar">add to Cart</a>
            </p>
            <p v-else>Beschikbaarheid: Item niet beschikbaar</p>
        </div>   
    </section>
  </div>

</template>

<script setup>

import { onMounted, ref } from "vue";
import {collection, getDocs} from  'firebase/firestore'
import {db} from "../Firebase/Index.js"

const Items = ref([

])

onMounted( async () => {
    const querySnapshot = await getDocs(collection(db, "Items"))
    querySnapshot.forEach((doc) => {
    const  Item = {
        id: doc.id,
        Name: doc.data().Name,
        Picture: doc.data().Picture,
        beschikbaar: doc.data().Available,
        Category: doc.data().Category
    }
    Items.value.push(Item);
    })
    console.log(Items)

})

</script>

<style scoped>
.itemslisting{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0em 10em 0em 10em;
}
p{
    padding: 0.5em;
}




</style>