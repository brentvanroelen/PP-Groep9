<template>

<!--Navigation  => is gemaakt binnen components enkel nog op de pagina's zetten en linken-->
<NavigationAdmin></NavigationAdmin>

<div class="scheduledLoans">

    data uit datebase

    <button>Picked up</button>
    <button>Discard</button>
    <br>

    <button><router-link class="link" to="/ItemPreparationScreen">Item Prep Screen</router-link></button>
   

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



<script>
import router from '@/router';
import NavigationAdmin from '../components/navigationAdmin.vue';
        




</script>



<style>



</style>