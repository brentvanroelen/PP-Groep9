<template>

    <header>
        <h1 class="cart-title">CART</h1>
    </header>
    
    <main>
        <section class="cart-items">
            <!-- Item containers -->
            
            <!-- Item 1 -->
            <article class="item-container">
                <!-- Item details -->
                <img src="googleglasses.jpg" alt="Google glasses">
                <div class="item-info">
                    <h2 class="item-title">Google glasses - <span style="font-size: 12px;">GO-12</span></h2>
                    <p class="item-description">Blabla</p>
                </div>
                <div class="item-date">
                    <span>Start date: 01/05/24</span> 
                    <span class="calendar-icon">📅</span>
                </div>
                <div class="item-date">
                    <span>End date: 10/05/24</span>
                    <span class="calendar-icon">📅</span>
                </div>
                <div class="item-trash">
                    <img src="trashcan-icon.png" alt="Delete">
                </div>
            </article>

            <!-- Item 2 -->
            <article class="item-container">
                <!-- Item details -->
                <img src="item2.jpg" alt="Item 2">
                <div class="item-info">
                    <h2 class="item-title">Item 2 - <span style="font-size: 12px;">seriecode</span></h2>
                    <p class="item-description">Short description of item 2</p>
                </div>
                <div class="item-date">
                    <span>Start date: 15/05/24</span> 
                    <span class="calendar-icon">📅</span>
                </div>
                <div class="item-date">
                    <span>End date: 20/05/24</span>
                    <span class="calendar-icon">📅</span>
                </div>
                <div class="item-trash">
                    <img src="trashcan-icon.png" alt="Delete">
                </div>
            </article>

            <!-- Item 3 -->
            <article class="item-container">
                <!-- Item details -->
                <img src="item3.jpg" alt="Item 3">
                <div class="item-info">
                    <h2 class="item-title">Item 3 - <span style="font-size: 12px;">seriecode</span></h2>
                    <p class="item-description">Short description of item 3</p>
                </div>
                <div class="item-date">
                    <span>Start date: 15/05/24</span> 
                    <span class="calendar-icon">📅</span>
                </div>
                <div class="item-date">
                    <span>End date: 20/05/24</span>
                    <span class="calendar-icon">📅</span>
                </div>
                <div class="item-trash">
                    <img src="trashcan-icon.png" alt="Delete">
                </div>
            </article>

            <!-- Item 4 -->
            <article class="item-container">
                <!-- Item details -->
                <img src="item4.jpg" alt="Item 4">
                <div class="item-info">
                    <h2 class="item-title">Item 4 - <span style="font-size: 12px;">seriecode</span></h2>
                    <p class="item-description">Short description of item 4</p>
                </div>
                <div class="item-date">
                    <span>Start date: 15/05/24</span> 
                    <span class="calendar-icon">📅</span>
                </div>
                <div class="item-date">
                    <span>End date: 20/05/24</span>
                    <span class="calendar-icon">📅</span>
                </div>
                <div class="item-trash">
                    <img src="trashcan-icon.png" alt="Delete">
                </div>
            </article>
        </section>

        <hr>

        <!-- Selected items en confirm order button container -->
        <section class="selected-items-container">
            <div class="selected-items">
                <strong>Selected items:</strong>
                <span id="item-count">0</span>
            </div>
            <button class="confirm-button">Confirm order</button>
        </section>
    </main>

</template>

<script setup>
    import Navigation from "../components/Navigation.vue"


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

        .cart-items {
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

        .item-trash {
            margin-left: auto;
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
</style>
