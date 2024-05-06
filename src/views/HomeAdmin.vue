<template>




<div class="scheduledLoans">

    <div>
      <ProductItems></ProductItems>
    </div>
    
    
    <button>Picked up</button>
    <button>Discard</button>
    <br>

   

</div>

<div class="scheduledReturns">

    data uit datebase

   <!--  <button>Return + check</button>
    <button>Returned</button> -->

</div>

<div class="spontaneousLoans">
    <h2>Spontaneous Loans</h2>

    <label>User: </label> <input type="text" name="" id=""><br>
    <label for="ItemorKITname">Item or KIT name: </label><input type="text" name="" id="">
    <label for="calender">Return date: </label> <!--calender--><br>
    <label for="returnTime">Return time: </label><input type="time">
    <button>Complete loan</button>
</div>

<div class="earlyReturns">
    <h2>Early Returns</h2>
    <label>User: </label> <input type="text" name="" id=""><br>
    <label for="ItemorKITname">Item or KIT name: </label><input type="text" name="" id="">
    <label for="borrowedItems">Borrowed items: </label> <!--borrowed Items--><br>
    <button>Selection returned</button>
    <button>Selection returned + check</button>
    <button>Everything returned</button>
    <button>Everything returned + check</button>
</div>




</template>



<script setup>
/* import Searchbar from "../components/Searchbar.vue"
import Admin from "../components/navigationAdmin.vue"
import { getDocs, getFirestore } from 'firebase/firestore';
import {ref} from '../main.js'
import {collection,where,db,query} from '../Firebase/Index.js'
import router from '@/router';
import { useStore } from '@/Pinia/Store.js'; */
import ProductItems from "@/components/ProductItems.vue";




        




</script>



<style>



</style>