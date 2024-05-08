<template>

    <header>
        <h1 class="cart-title">CART</h1>
    </header>
    
    <main>
        <div v-for="(item, index) in items" :key="index">
    <div class="item-box">
        <img :src="item.Image" alt="" id="itemImg">
        <div id="itemInfo-box">
        <h2>{{ item.Name }}</h2>
        <p><b>Description: </b> {{ item.Description }}</p>
        <p><b>Serial Series: </b> {{  item.SerialSeries }}</p>
    </div>
        <p><b>Start date: </b> {{ startDate  }}</p>
        <div class="calendar">
            <img src="../assets/calendar.png" alt="">
        </div>
        <p><b>End date:</b> {{ endDate }}</p>
        <span id="calendar">
            <img src="../assets/calendar.png" alt="">
        </span>
        
        <div class="item-trash">
            <img src="../assets/trash.png" alt="">
        </div>
        <!-- Add more item properties as needed -->
      </div>
    </div>
        

        <!-- Selected items en confirm order button container -->
        <section class="selected-items-container">
            <div class="selected-items">
                <strong>Selected items:</strong>
                <span id="item-count">0</span>
            </div>
            <button class="confirm-button" @click="test()">Confirm order</button>
        </section>
    </main>

</template>

<script setup>
import Navigation from "../components/Navigation.vue"
    import { useCart } from '@/Pinia/Store';

   

    const cart = useCart();
    const items = cart.items;
    const startDate = cart.startDate;
    const endDate = cart.endDate;

    const test = () => {
        console.log(items);
        console.log(startDate);
        console.log(endDate);
    }

</script>

<style scoped>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        main {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .cart-title {
            font-size: 24px;
            margin-top: 20px;
            text-align: center;
        }

        /* .cart-items {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
            width: 80%;
        }

        .item-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #ddd;
            margin-bottom: 20px;
            padding: 10px;
            width: 100%;
        }

        .item-container > * {
            flex: 1; 
            margin: 0 10px; 
        }

        .item img {
            height: auto;
            margin-right: 10px;
            max-width: 100%;
        }

        .item-info {
            width: 70%;
        }

        .item-title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .item-description {
            margin-bottom: 5px;
        }

        .item-date {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }

        .calendar-icon {
            margin-left: 5px; 
            color: blue;
            cursor: pointer;
        }

        .trash-button {
        background: none;
        border: none;
        cursor: pointer;
        } */

        /* .trash-button::before {
            content: '🗑️';  of je kan ook URL voor icon gebruiken 
            font-size: 20px; 
        }*/
        hr {
            margin: 20px 0;
            width: 80%;
            border: 0;
            border-top: 1px solid #ccc;
        }

        .selected-items-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80%;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        #item-count {
            margin-left: 10px;
            font-weight: bold;
        }

        .confirm-button {
            background-color: red;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 16px;
        }

        .confirm-button:hover {
            background-color: darkred;
        }
        .item-box {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            background-color: #D9D9D9;
            border-radius: 2em;
            margin: 1em 0 1em 0;
            width: 1500px;
            padding: 1em 0em 1em 0em;
        }
        #itemImg {
            width: 200px;
            border: 2px white solid;
            border-radius: 1em;
        }
        .item-box img {
            width: 40px;
        }
        .calendar{
            background-color: aqua;
        }
        #itemInfo-box {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 300px;
            height: 150px;
        }
</style>
