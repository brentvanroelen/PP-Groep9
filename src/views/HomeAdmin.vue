<template>




<div class="scheduledLoans">

    <div v-if="loading">Bezig met laden...</div>
    <div v-else>
      <!-- Hier worden de gegevens weergegeven -->
      <ul>
        <li v-for="item in items" :key="item.id">{{ item.Name }}</li>
      </ul>
    </div>
    <button>Picked up</button>
    <button>Discard</button>
    <br>

   

</div>

<div class="scheduledReturns">

    data uit datebase

    <button>Return + check</button>
    <button>Returned</button>

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
import Searchbar from "../components/Searchbar.vue"
import Admin from "../components/navigationAdmin.vue"
import { useStore } from "@/Pinia/Store.js";
import { computed } from "../main.js";
import Items from "@/components/Items.vue";


    

    let items = [];
    
  
  const created = ()=> {
    this.loadItems();
  }
 
    let loadItems=() => {
      // Hier zou je de logica plaatsen om gegevens uit de database op te halen op basis van de huidige datum
    
      const today = new Date().toISOString().slice(0, 10); // Huidige datum in het formaat "YYYY-MM-DD"
      
      
    }

        




</script>



<style>



</style>