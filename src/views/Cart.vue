<template>
    <div class="container">
        <div class="cart-title">CART</div>
        <div class="cart-container">
            <div class="cart-items">
                <!-- Item 1 -->
                <div class="item-container">
                    <img src="#googleglasses.jpg" alt="Google glasses">
                    <div class="item-info">
                        <div class="item-title">Google glasses - <span style="font-size: 12px;">GO-12</span></div>
                        <div class="item-description">Blabla</div>
                     </div>
                    <div class="item-date">
                            <span>Start date: 01/05/24</span> 
                            <div class="calendar-icon">📅</div>
                    </div>
                    <div class="item-date">
                            <span>End date: 10/05/24</span>
                            <div class="calendar-icon">📅</div>
                    </div>
                   
                    <div class="item-trash">
                        <img src="#trashcan-icon.png" alt="Delete">
                    </div>
                </div>

                <!-- Item 2 -->
                <div class="item-container">
                    <img src="#item2.jpg" alt="Item 2">
                    <div class="item-info">
                        <div class="item-title">Item 2 - <span style="font-size: 12px;">seriecode</span></div>
                        <div class="item-description">Short description of item 2</div>
                        </div>
                    <div class="item-date">
                            <span>Start date: 15/05/24</span> 
                            <div class="calendar-icon">📅</div>
                    </div>
                    <div class="item-date">
                            <span>End date: 20/05/24</span>
                            <div class="calendar-icon">📅</div>
                    </div>
                    
                    <div class="item-trash">
                        <img src="#trashcan-icon.png" alt="Delete">
                    </div>
                </div>

                <!-- Item 3 -->
                <div class="item-container">
                    <img src="#item3.jpg" alt="Item 3">
                    <div class="item-info">
                        <div class="item-title">Item 3 - <span style="font-size: 12px;">seriecode</span></div>
                        <div class="item-description">Short description of item 3</div>
                        </div>
                    <div class="item-date">
                            <span>Start date: 15/05/24</span> 
                            <div class="calendar-icon">📅</div>
                    </div>
                    <div class="item-date">
                            <span>End date: 20/05/24</span>
                            <div class="calendar-icon">📅</div>
                    </div>
                    
                    <div class="item-trash">
                        <img src="#trashcan-icon.png" alt="Delete">
                    </div>
                </div>

                <!-- Item 4 -->
                <div class="item-container">
                    <img src="#item4.jpg" alt="Item 4">
                    <div class="item-info">
                        <div class="item-title">Item 4 - <span style="font-size: 12px;">seriecode</span></div>
                        <div class="item-description">Short description of item 4</div>
                        </div>
                    <div class="item-date">
                            <span>Start date: 15/05/24</span> 
                            <div class="calendar-icon">📅</div>
                    </div>
                    <div class="item-date">
                            <span>End date: 20/05/24</span>
                            <div class="calendar-icon">📅</div>
                    </div>
                    
                    <div class="item-trash">
                        <img src="#trashcan-icon.png" alt="Delete">
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Selected items + button nog -->

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

        .cart-title {
            font-size: 24px;
            margin-top: 20px;
            text-align: center;
        }

        .cart-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .cart-items {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
            width: 100%;
        }

        .item-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #ddd;
            margin-bottom: 20px;
            padding: 10px;
            width: 80%;
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

</style>
