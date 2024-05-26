<template>
  <div class="search-container" :class="props.page">
    <div class="search-bar">
      <input id="input" type="text" v-model="querystring" @keyup.enter="confirmedSearch" :placeholder="placeholder">
      <div v-if="props.page != 'HomeAdmin'">
        <select v-model="selectedCategory">
          <option value="" disabled>Categories</option>
          <option v-for="(option, index) in dropdownOptions" :key="index" :value="option" >{{ option }}</option>
        </select>
      </div>
      <span v-if="props.page != 'HomeAdmin'" class="calendar">
        <VueDatePicker v-model="date" 
          :min-date="new Date()" 
          :teleport="true"
          :max-date="maxDate"
          :enable-time-picker="false"
          :disabled-week-days="[6,0]"
          @update:model-value="log"
          :range="{ maxRange: maxSelect, minMaxRawRange:true }">
          <template #trigger>
            <img src="../assets/calendar.png" alt="">
          </template>
        </VueDatePicker>
      </span>
      <button class="searchbutton"@click="confirmedSearch">Search</button>
    </div>
  </div>
    <div class="search-results" v-if="showResults">
      <div v-for="result in store.results" :key="result.id">
        <div class="iteminfo">
          <img :src="result.Image" alt="item">
          <p>{{ result.Name }}</p>
          <button @click="addToCart(result)">Add to loan</button>
        </div>
      </div>
    </div>

  <AvailabilityHandler :page="'UserHome'"></AvailabilityHandler>
  </template>
  
<script setup>
  import {onMounted, ref, watch, computed} from '../main.js'
  import {collection,where,db,query,getDocs} from '../Firebase/Index.js'
  import router from '@/router';
  import { useDates,useStore,useCart,useCategories, useUserIdentification,useTrigger} from '@/Pinia/Store.js';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
  import { doc, getDoc, orderBy } from 'firebase/firestore';
  import AvailabilityHandler from './AvailabilityHandler.vue';
  
  let maxSelect = ref(7);
  const date = ref();
  const datesStore = useDates();

  onMounted(() => {
    fetchData();
  });


  const student = ref();
  const teacher = ref();
  const studentReservation = ref();
  const teacherReservation = ref();
  const selectedCategory = ref('');
  const dropdownOptions = useCategories().categories;
  const userType = useUserIdentification();
  const fetchData = async () => {
  const docRef = doc(db, "Settings", "Options");
  const docSnap = await getDoc(docRef);
  const cart = useCart();

  let showPopup = ref();
  let placeholder = ref("Search");

  if (docSnap.exists()){
    const data = docSnap.data();
    student.value = data.student;
    teacher.value = data.teacher;
    studentReservation.value = data.studentReservation;
    teacherReservation.value = data.teacherReservation;
  }}

const log = () => {
  console.log(date.value)

  let startDate = date.value[0];
  let endDate = date.value[1];

  let startDay = startDate.getDate();
  let startMonth = startDate.getMonth() + 1;

  let endDay = endDate.getDate();
  let endMonth = endDate.getMonth() + 1;

  datesStore.updateGeneralDates([startDay, startMonth, endDay, endMonth])
}
  const maxDate = computed(() => {
    let length = ref();
    if(userType.user.type === "student" ){
      length = studentReservation.value * 7 ;
      maxSelect = student.value * 7;
    }else if(userType.user.type === "docent"){
      length = teacherReservation.value * 7 ;
      maxSelect = teacher.value * 7;
    }else if(userType.user.type === "admin"){
      length = 365;
    }
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + length);
    return futureDate;
  });
  



  const showResults = ref(false);
  const props = defineProps({
    page: String,
    class: String
  });
  const querystring = ref('');
  const store = useStore();

  const search = async() => {
    const trigger = useTrigger()
    let results = [];
    store.updateResults([]);
    const itemquery = query(collection(db, "Items"), 
    where('SubStrings', 'array-contains', querystring.value.toLowerCase()),
    );
    const querySnapshot = await getDocs(itemquery);
      querySnapshot.forEach((snap) =>{
        console.log(snap.data())
        results.push(snap.data())
    })
    console.log(results)
    store.updateResults(results)
    if(store.results.length == 0){
      trigger.fireTrigger();
    }
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
    querystring.value = '';
    console.log(cart.items)
  }
  

  onMounted(async() => {
    if(props.page == "HomeAdmin"){
      placeholder.value = "Add items to the reservation"
    }
  })
</script>
  

<style>
.calendar{
  width: 60px;
  height: 60px
}
  .search-container.HomeAdmin{
    max-height: fit-content;
    width: 95%	;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d50000
  }
  .search-container {
  position: relative; /* This makes the .search-results position relative to this container */
  padding: 0.5em;
  height: fit-content;
  width: 100%;
  }
  .search-bar {
    display: flex;
    align-items: center;
    margin-top: 0%;
    justify-content: space-evenly;
    width: 100%	;
    height: fit-content;
  }
  img{
    width: 60px;
    height: 60px;
  }
  .search-bar input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 5px;
  }
  #input{
    width: 40%;
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
  max-height: 400px;
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
  max-width: 100%;
  margin-top: 2px;
  align-self: start;
  overflow: visible;
  overflow-clip-margin: 2px;
}
.searchbutton {
  background-color: #ff3333;
  color: #fff;
  border: none;
  padding: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  width: 15%;
}


  
</style>
  