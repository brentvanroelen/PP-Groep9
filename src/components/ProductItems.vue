<template>
    <div class="items">
    <h1>Product Screen</h1>
    <section class="itemslisting">
        <router-link class="routerlink" :to="'/ItemScreen/' + item.Name"  v-for="item in results" :key="item.id">
           <Items :item="item" ></Items>
    </router-link>
    </section>
  </div>

</template>

<script setup>

import { useStore } from "@/Pinia/Store.js";
import { computed } from "../main.js";
import Items from "@/components/Items.vue";

const store = useStore();
const results = computed(() => store.results);




</script>

<style scoped>
.itemslisting{
    display: flex;
    flex-direction: row;
    max-width: 100%;
    flex-wrap: wrap;
}
p{
    padding: 0.5em;
}
.item{
    border-radius: 1em;
    margin: 6px;
    padding: 10px;
    background: crimson;
    text-align: center;
    width: 200px;
}
.item img{
    width: 150px;
}
.item a{
    width: 25px;
    border: #333 solid 2px;
    margin-top: 4px;
    background: #333;
}
.item a:hover{
    cursor: pointer;
}
.available{
    background: rgb(82, 129, 12);
}
</style>