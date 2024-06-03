<template>
    <div id="Search">
        <searchbar></searchbar>
    </div>
    <ProductItems :category="category"></ProductItems>
</template>

<script setup>
import Searchbar from "@/components/Searchbar.vue";
import ProductItems from "@/components/ProductItems.vue";
import { useStore } from "@/Pinia/Store.js";
import {onMounted, useRoute} from "../main.js";
import {ref,watch} from "../main.js";
import { collection, db, getDocs, query, where } from '../Firebase/Index.js';

const props = defineProps({
    category: String
});

const route = useRoute();
const category = ref(route.params.category || props.category);

const store = useStore();
const loadCatalog = async() => {
    let items = [];
    const cref = collection(db, 'Items');
    const docs = await getDocs(cref);
    docs.forEach((doc) => {
        items.push(doc.data());
    })
    
    store.updateResults(items);
}

onMounted(() => {
    loadCatalog();
})


</script>

<style>
    #Search{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    }
</style>