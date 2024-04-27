<template>
    <div class="items">
    <h1>Product Screen</h1>
    <section class="itemslisting">
        <div class="item" v-for="item in results" :key="item.id" :class="{available: item.beschikbaar === true}">
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
    </section>
  </div>

</template>

<script setup>

import { useStore } from "../main.js";
import { computed } from "../main.js";

const store = useStore();
const results = computed(() => store.results);




</script>

<style>
.itemslisting{
    display: flex;
    flex-direction: row;
    max-width: 100%;
    flex-wrap: wrap;
}
p{
    padding: 0.5em;
}




</style>