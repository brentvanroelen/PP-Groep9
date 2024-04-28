<template v-if="Item">
    <div class="searchcontainer">
        <div class="searchbar-overlay"></div>
        <div class="searchbar">
          
        </div>
    </div>
    <div>
      <Items :item="Item"></Items>
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
  .item{
    background-color: 
  }
  </style>