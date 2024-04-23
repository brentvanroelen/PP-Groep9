<template>
  <div class="searchcontainer">
    <img src="../assets/Flavor.jpg" alt="">
    <div class="searchbar-overlay"></div>
    <div class="searchbar">
      <SearchBar @search="handleSearch" />
    </div>
  </div>
  
  <div class="most_leased_items">
    <h1>Most leased items</h1>
    <section class="itemslisting">
        <div class="item" v-for="item in Items" :key="item.id" :class="{available: item.beschikbaar === true}">
            <h3>{{item.Name}}</h3>
            <img :src="item.Picture" alt="">
            <p>Categorie: {{item.Category}}</p>
            <p v-if="item.beschikbaar">Beschikbaarheid: Morgen afhaalbaar
                <br>
                <br>
                <a v-if="item.beschikbaar">add to Cart</a>
            </p>
            <p v-else>Beschikbaarheid: Item niet beschikbaar</p>
        </div>   
    </section>
  </div>
</template>

<script setup>






import { onMounted, ref } from "vue";
import {collection, getDocs} from  'firebase/firestore'
import {db} from "../Firebase/Index.js";
import SearchBar from '../components/SearchbarB.vue';



const Items = ref([

])

onMounted( async () => {
    const querySnapshot = await getDocs(collection(db, "Items"))
    querySnapshot.forEach((doc) => {
    const  Item = {
        id: doc.id,
        Name: doc.data().Name,
        Picture: doc.data().Picture,
        beschikbaar: doc.data().Available,
        Category: doc.data().Category
    }
    Items.value.push(Item);
    })
    console.log(Items)

})


</script>

<style>
 .searchcontainer{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
 }
 .overlay {
  position: absolute;
  top: 75;
  left: 0;
  width: 100%; 
  height: 300px;
  background-color: rgba(0, 0, 0, 0.5); 
  pointer-events: none; 
  z-index: -1;
}
.searchcontainer img{
    width: 100%;
    height: 300px;
    z-index: -2;
}
.searchbar{
    align-content: center;
    position: absolute;
    top: 205px;
    left: 40%;
    width: 250px;
    height: 30px;
    
    font-size: 18px;
    
}
.most_leased_items{
    background: #2c3e50 ;
}

.itemslisting{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.item{
    border: solid 2px  black;
    margin: 6px;
    padding: 30px;
    background: crimson;
    text-align: center;
    width: 240px;
}
.item img{
    width: 150px;
}
.item a{
    width: 25px;
    border: #333 solid 2px;
    margin-top: 4px;
    background: #333;
}
.item a:hover{
    cursor: pointer;
}
.available{
    background: rgb(82, 129, 12);
}
</style>