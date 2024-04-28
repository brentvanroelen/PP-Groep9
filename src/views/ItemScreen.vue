<template v-if="Item">
    <div class="searchcontainer">
        <div class="searchbar-overlay"></div>
        <div class="searchbar">
          <searchbar></searchbar>
        </div>
    </div>
    <div id="box">
  <div id="itemBox">
      <Items :item="Item"></Items>
    </div>
    <div  id="calendarBox">
      <Calendar></Calendar>
    </div>
  </div>
    
        <Footer></Footer>
  </template>
  
  
  <script setup>

  import SearchBar from "../components/Searchbar.vue"
  import Footer from "../components/Footer.vue"
  import { onMounted, useStore } from "../main.js";
  import { computed } from "../main.js";
  import { useRouter } from 'vue-router';
  import { defineProps } from "vue";
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
    justify-content: space-evenly;
  }
  #Search{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    }
  
  
  </style>