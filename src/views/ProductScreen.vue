<template>
    <div id="Search">
        <searchbar></searchbar>
    </div>
    <ProductItems></ProductItems>
</template>

<script setup>
import Searchbar from "@/components/Searchbar.vue";
import ProductItems from "@/components/ProductItems.vue";
import {useRoute} from "../main.js";
import {ref,watch} from "../main.js"; 


</script>

<style>
    #Search{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    }

</style>