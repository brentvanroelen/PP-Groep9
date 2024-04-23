<template>
    <div id="Search">
        <searchbar></searchbar>
    </div>
    <ProductItems></ProductItems>
</template>

<script setup>

import { onMounted, ref } from "vue";
import {collection, getDocs} from  'firebase/firestore'
import {db} from "../Firebase/Index.js"
import Footer from "../components/Footer.vue"
import Navigation from "../components/Navigation.vue"
import Searchbar from "@/components/Searchbar.vue";
import ProductItems from "@/components/ProductItems.vue";

</script>

<style>
    #Search{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    }
</style>