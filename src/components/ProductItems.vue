<template>
    <div class="items">
    <h1>Product Screen</h1>
    <section class="itemslisting" v-if="filteredResults != 'nothing'">
        <router-link @click="updateStore(item)" class="routerlink" :to="'/ItemScreen/' + item.Name"  v-for="item in filteredResults" :key="item.id">
           <Items :item="item" ></Items>
    </router-link>
    </section>
  </div>

</template>

<script setup>

import { useStore } from "@/Pinia/Store.js";
import { computed } from "../main.js";
import Items from "@/components/Items.vue";

const props = defineProps({
    category: String
});

const store = useStore();
const results = computed(() => store.results);

console.log("Results: ", results.value); 
console.log("Category: ", props.category); 

if (results.value.length > 0) {
    console.log("Category of first item: ", results.value[0].category); // Add this line
}

const filteredResults = computed(() => {
    if (props.category){
        const filtered = results.value.filter(item => item.Category === props.category);
        console.log("Filtered results: ", filtered);
        return filtered;
    }
    return results.value;
})

const updateStore = (item) => {
    store.updateResults([item]);
}


</script>

<style scoped>
.itemslisting {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1%; /* Add gap between items */
    justify-content: space-around; /* Distribute space around items */
    max-width: 100%;
   
}

.item {
    border-radius: 1em;
    margin: 6px;
    padding: 10px;
    background: crimson;
    text-align: center;
    width: calc(50% - 16px); /* Ensure two items per row with space */
    box-sizing: border-box; /* Include padding and border in the width */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 300px; /* Set a fixed height for the items */
    overflow: hidden; /* Hide overflow content */
}

.item img {
    width: 150px;
    align-self: center; /* Center image horizontally */
}

.item p {
    flex: 1;
    margin: 10px 0;
    overflow: hidden; /* Hide overflow text */
    text-overflow: ellipsis; /* Add ellipsis for overflow text */
    white-space: nowrap; /* Prevent text from wrapping */
}

.item a {
    width: 25px;
    border: #333 solid 2px;
    margin-top: 4px;
    background: #333;
    align-self: center; /* Center link horizontally */
}

.item a:hover {
    cursor: pointer;
}

.available {
    background: rgb(82, 129, 12);
}


</style>