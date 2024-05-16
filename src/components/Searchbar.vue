<template>
  <div id="test">
  <div class="search-container">
    <div class="search-bar">
      <input type="text" v-model="querystring" @keyup.enter="confirmedSearch" placeholder="Search">
      <div>
        <select v-model="selectedCategory">
          <option value="" disabled>Categories</option>
          <option v-for="(option, index) in dropdownOptions" :key="index" :value="option" >{{ option }}</option>
        </select>
      </div>
      <span class="calendar" @click="togglePopup(true)">
            <img src="../assets/calendar.png" alt="">
      </span>
      <button @click="confirmedSearch">Search</button>
    </div>
  </div>
    <Teleport to="body">
  <Popup v-if="showPopup" @close="togglePopup(false)">
            <h3>Pick a date</h3>
            <Calendar></Calendar>
            <button>Pick date</button>
    </Popup>
  </Teleport>
    
    <div class="search-results" v-if="showResults">
      <div v-for="result in store.results" :key="result.id">
        <div class="iteminfo">
          <img :src="result.Image" alt="item">
          <p>{{ result.Name }}</p>
          <button @click="addToCart(result)">Add to loan</button>
        </div>
      </div>
    </div>
  </div>
  </template>
  
<script setup>
  import {onMounted, ref, watch} from '../main.js'
  import {collection,where,db,query,getDocs} from '../Firebase/Index.js'
  import router from '@/router';
  import { useStore,useCart,useCategories} from '@/Pinia/Store.js';
  import ItemScreen from '@/views/ItemScreen.vue';
  import Popup from './Popup.vue';
  import Calendar from './Calendar.vue';
  

  
  const selectedCategory = ref('');
  const dropdownOptions = useCategories().categories;
  let showPopup = ref();


  
  const togglePopup = () => {
        showPopup.value = !showPopup.value;
    }

  const showResults = ref(false);
  const props = defineProps({
    page: String,
    class: String
  });
  const querystring = ref('');
  const store = useStore();
  const cart = useCart();

  const search = async() => {
    let results = [];
    store.updateResults([]);
    const itemquery = query(collection(db, "Items"), 
    where('SubStrings', 'array-contains', querystring.value.toLowerCase())
    );
    
    const querySnapshot = await getDocs(itemquery);
      querySnapshot.forEach((snap) =>{
        console.log(snap.data())
        results.push(snap.data())
    })
    console.log(results)
    store.updateResults(results)
  };
  const confirmedSearch = async() => {
    await search();
    if(props.page == "UserHome"){
        router.push({name: "productscreen"})
      }else if(props.page == "AdminHome"){
        console.log("AdminHome")
      }
  }
  if(props.page == "HomeAdmin"){
    watch(querystring, async(newVal, oldVal) => {
    // If the new value has 3 or more characters, trigger the search
    if (newVal.length >= 3) {
      await search();
      showResults.value = store.results.length > 0;
    }else{
      showResults.value = false;
    }
  })
};
  const addToCart = (item) => {
    cart.addItem(item);
    console.log(cart.items)
  }
  
</script>
  

  <style scoped>
  .search-container {
  width: 800px; /* Adjust this value to suit your needs */
  position: relative; /* This makes the .search-results position relative to this container */
  background-color: #c1c1c1;
  padding: 0.5em;
  }
  .search-bar {
    display: flex;
    align-items: center;
    margin-top: 0%;
    justify-content: center;
  }
  img{
    width: 110px;
    height: 40px;
  }
  .search-bar input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 5px;
  }
  
  .search-bar button {
     padding: 8px 12px; 
    background-color: #d50000;
    color: white;
    border: none;
    border-radius: 4px;
    
  }
  .search-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
  z-index: 1;
}
.iteminfo{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  overflow: visible;
}
img{
  max-width: 35%;
  margin-top: 2px;
  align-self: start;
}
button {
  background-color: #ff3333;
  color: #fff;
  border: none;
  padding: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}


  
  </style>
  