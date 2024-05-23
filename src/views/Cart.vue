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
        <span class="calendar" @click="togglePopup(true)">
            <img src="../assets/calendar.png" alt="">
        </span>
        <p><b>End date:</b> {{ endDate }}</p>
        <span id="calendar" @click="togglePopup(true)">
            <img src="../assets/calendar.png" alt="" >
        </span>
        <div class="item-trash" @click="removeItem()">
            <img src="../assets/trash.png" alt="">
        </div>
      </div>
      <Popup v-if="showPopup" @close="togglePopup(false)">
            <h3>{{ item.Name }}</h3>
            <Calendar></Calendar>
            <br>
            <button>Edit date</button>
    </Popup>
        
    </div>
    

        <section class="selected-items-container">
            <div class="selected-items">
                <strong>Selected items:</strong>
                <span id="item-count">{{ itemCount }}</span>
            </div>
            <ReservationHandler :check-user-cart="true" :button-text="'Plaats Reservatie'"></ReservationHandler>
        </section>
    </main>


</template>

<script setup>
    import Navigation from "../components/Navigation.vue"
    import { useCart } from '@/Pinia/Store';
    import { onMounted, ref } from 'vue';
    import ReservationHandler from "@/components/ReservationHandler.vue";
    import Popup from "@/components/Popup.vue";
    import Calendar from "@/components/Calendar.vue";

    let showPopup = ref(false);
    const cart = useCart();
    const items = cart.items;
    const startDate = cart.startDate;
    const endDate = cart.endDate;
    const itemCount = ref(0);

    for (let i = 0; i < items.length; i++) {
        itemCount.value += 1;
    }

    const togglePopup = (value) => {
        showPopup.value = !showPopup.value;
    }

    const removeItem = (index) => {
        cart.removeItem(index);
        itemCount.value -= 1;
    }

    const test = () => {
        console.log(cart.items)
        // console.log(items);
        // console.log(startDate);
        // console.log(endDate);
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
            height: 200px;
        }
        .item-box img {
            width: 40px;
        }
        #itemInfo-box {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 300px;
            height: 150px;
        }
        button{
            padding: 10px 20px;
            background-color: #d50000;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            outline: none;
            margin: 1em;
        }
</style>
