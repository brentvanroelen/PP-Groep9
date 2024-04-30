<template v-if="Item">
    <div id="box">
      <div class="searchcontainer">
        <div class="searchbar-overlay"></div>
        <div class="searchbar">
          <SearchBar></SearchBar>
        </div>
    </div>
    <div id="itemBox">
      <Items :item="Item"></Items>
    </div>
    <div  id="calendarBox">
      <Calendar></Calendar>
    </div>
    <ReservationHandler :item="Item"></ReservationHandler>
  </div>
        
<Footer></Footer>
  </template>
  
  
  <script setup>
  import SearchBar from "../components/Searchbar.vue"
  import Footer from "../components/Footer.vue"
  import ReservationHandler from "@/components/ReservationHandler.vue";
  import { useStore } from "@/Pinia/Store.js";
  import { computed } from "../main.js";
  import { useRouter } from 'vue-router';
  import Items from "@/components/Items.vue";
  import Calendar from "@/components/Calendar.vue";

  const props = defineProps({
    Name: String
  });
  
  const store = useStore();
  const results = computed(() => store.results);
  const router = useRouter();
  const params = router.currentRoute.value.params;
  const Item = results.value.find(item => item.Name === params.Name);

  </script>

  <style scoped>
    #box {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background-color: aqua;
    width: 70%;
    margin: auto;
    height: 500px;
  }
  #itemBox{
    padding: 1em;
  }
  #photo {
    max-width: 200px;
    max-height: 200px;
  } 
  
   #pfotoDiv {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .searchcontainer {
    position: relative;
    margin-bottom: 20px;
  }
  
  .searchbar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black overlay */
  }
  
  .searchbar {
    z-index: 1; /* Ensure searchbar stays on top of overlay */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  h1 {
    text-align: center;
    font-size: 30px;
    margin-top: 20px;
  }
  
  .itemDescription {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .forProject {
    margin-top: 10px;
  }
  
  /* Adjustments for mobile devices */
  @media (max-width: 768px) {
    #pfotoDiv {
      margin-left: 10%;
      margin-right: 10%;
    }
  }
  </style>
  
  <!-- <style scoped>

  #photo {
    max-width: 200px;
    max-height: 200px;
  }

  #pfotoDiv {
    display: flex;
    justify-content: right;
    margin-left: 70%;
    margin-right: 30%;

  }

  .searchbar{
    display: flex;
    align-items: center;
    margin-bottom: 100%;
    
    
  }

  h1 {
    text-align: center;
    font-size: 30px;
    margin-top: 5%;
  }

    .itemDescription {
       display: flex;
       justify-content: center;
    }
  
  
  </style>  -->