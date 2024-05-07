<template>
    <div class="product">
            <div class="title">
                <h1>Product</h1>
                <h4>Category:</h4>
                <h4>Brand:</h4>
            </div>
    
            <div class="image">Image</div>
        </div>
        <div class="info">
            <div class="date">
                <p class="how">How long is the extension you want to request?</p>
                <div class="calendar">
                    <Calendar></Calendar>
                </div>
            </div>

            <div class="reason">
                <p class="why">Why do you want the extension?</p>
                <div class="text">
                    <input type="text" style="padding-bottom: 200px; padding-right: 200px;" placeholder="Enter reason here">

                </div>
                <button>Request extension</button>
            </div>
        </div>
        
        <div>
            <h2></h2>
        </div>
</template>
<script setup>
import Calendar from '@/components/Calendar.vue';
</script>
<style scoped>  
.product{
    display: flex;
    text-align: center;
}

.title{
    margin-left: 30em;
    margin-top: 1.2em;
}

.image{
    margin-left: auto;
    padding-right: 26em;
    padding-top: 2em;
}

h1, h4{
    margin: 3px;
}
h1{
    margin-left: 4em;
}
.info{
    display: flex;
    margin-top: 1em;
    margin-left: 2em
    }

.reason{
    padding-right: 15em;
}

.text{
    width: 400px; 
    height: 250px; 
}


p{
    text-align: center;
}

.date{
    margin-right: auto;
}

button{
    flex: 1; 
    height: 40px; 
    padding: 5px 20px; 
    border: none;
    border-radius: 20px;
    background-color: red;
    color: white;
    text-align: center;
    margin-bottom: 5px;
}

.how{
    padding-bottom: 1em;
    margin-left: 2em;
}
.why{
    margin-top: 4em;
}
.calendar{
    margin-left: 2em;
}

input{
    background-color: #c1c1c1;
}
</style>
