<template>
  <div class="search-container" :class="props.page">
    <div class="search-bar">
      <input id="input" type="text" v-model="querystring" @keyup.enter="confirmedSearch" :placeholder="placeholder">
      <span v-if="props.page != 'HomeAdmin'" class="calendar">
        <VueDatePicker class="datepicker" v-model="date" 
          :min-date="new Date()" 
          :teleport="true"
          :max-date="maxDate"
          :enable-time-picker="false"
          :disabled-week-days="[6,0]"
          :clearable="true"
          @update:model-value="Reload"
          :auto-apply="true"
          :range="{ maxRange: maxSelect, minMaxRawRange:true }">
          <template #trigger>
            <img src="../assets/calendar.png" alt="">
          </template>
        </VueDatePicker>
      </span>
      <div class="kitoptions" v-if="props.page != 'HomeAdmin' ">
        <label for="kits">See kits:</label>
        <input type="checkbox" v-model="seeKits">
      </div>
      <button class="searchbutton" @click="confirmedSearch">{{ searchBarText }}</button>
    </div>
  </div>
    <div class="search-results" v-if="showResults">
      <div v-for="result in spontaneousLoans.results" :key="result.id">
        <div class="iteminfo">
          <img :src="result.Image" alt="item">
          <p>{{ result.Name }}</p>
          <button class="cartButton" @click="addToCart(result)">Add to loan</button>
        </div>
      </div>
    </div>

  <AvailabilityHandler v-if="props.page == 'UserHome'" :page="'UserHome'"></AvailabilityHandler>
  </template>
  
<script setup>
import {onMounted, ref, watch, computed} from '../main.js'
import {collection,where,db,query,getDocs,doc, getDoc,} from '../Firebase/Index.js'
import router from '@/router';
import { useSpontaneousLoans,useDates,useStore,useCart,useCategories, useUserIdentification,useTrigger, useItemsToGet} from '@/Pinia/Store.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import AvailabilityHandler from './AvailabilityHandler.vue';
import { imageGetter } from '@/js/functions.js';

let maxSelect = ref(7);
const date = ref();
const datesStore = useDates();
const student = ref();
const teacher = ref();
const studentReservation = ref();
const teacherReservation = ref();
const selectedCategory = ref('');
const dropdownOptions = useCategories().categories;
const userType = useUserIdentification();
const cart = useCart();
const seeKits = ref(false);
let showPopup = ref();
const trigger = useTrigger()
let placeholder = ref("Search");
const showResults = ref(false);
const props = defineProps({
  page: String,
  class: String
});
const querystring = ref('');
const store = useStore();
const spontaneousLoans = useSpontaneousLoans();
let searchBarText = computed(() => {
  if(querystring.value.length == 0 && props.page != "HomeAdmin"){
    return "catalog"
  }else{
    return "Search"
  }
});



const fetchData = async () => {
  const docRef = doc(db, "Settings", "Options");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()){
    const data = docSnap.data();
    student.value = data.student;
    teacher.value = data.teacher;
    studentReservation.value = data.studentReservation;
    teacherReservation.value = data.teacherReservation;
  }
}

const Reload = () => {
  console.log(props.page)
  console.log(date.value)
  let startDate = date.value[0];
  let endDate = date.value[1];
  let startDay = startDate.getDate();
  let startMonth = startDate.getMonth() + 1;
  let endDay = endDate.getDate();
  let endMonth = endDate.getMonth() + 1;
  datesStore.updateGeneralDates([startDay, startMonth, endDay, endMonth])
  if(store.results.length > 0 ){
    console.log("triggering")
    trigger.fireTrigger();
  }
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

const search = async() => {
  console.log(props.page)
  let results = [];
  store.updateResults([]);
  if(seeKits.value){
    const kitquery = query(collection(db, "Kits"), 
    where('SubStrings', 'array-contains', querystring.value.toLowerCase()),
    );
    const kitquerySnapshot = await getDocs(kitquery);
    kitquerySnapshot.forEach((snap) => {
      snap.data().isKit = true;
      results.push(snap.data())
    })
  }else{
    console.log("searching")
    const itemquery = query(collection(db, "Items"), 
    where('SubStrings', 'array-contains', querystring.value.toLowerCase()),
    );
    const querySnapshot = await getDocs(itemquery);
      querySnapshot.forEach((snap) =>{
        results.push(snap.data())
    })
  }
  if(props.page == "HomeAdmin"){
    spontaneousLoans.updateResults(results)
    console.log(spontaneousLoans.results)
  }else{
    store.updateResults(results)
  }
  if(store.results.length == 0 && props.page == "UserHome"){
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
      console.log("searching")
      await search();
      for (let item of spontaneousLoans.results){
        imageGetter(`ItemImages/${item.Image}`).then((res) => {
          item.Image = res;
        })
      }
      showResults.value = spontaneousLoans.results.length > 0;
    }else{
      showResults.value = false;
    }
  })
};
const addToCart = (item) => {
  cart.addItem(item);
  querystring.value = '';
}
onMounted(() => {
  if(props.page == "HomeAdmin"){
    useItemsToGet().items = [];
    placeholder.value = "Add items to the reservation"
  }
  fetchData();
});

  

</script>
  

<style scoped>

.calendar{
  width: 50px;
  height: 50px
}
  .search-container.HomeAdmin{
    max-height: fit-content;
    width: 95%	;
    display: flex;
    align-items: center;
    justify-content: center;
    /*background-color: #d50000*/
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
    width: 50px;
    height: 50px;
    margin-top: 2px;
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
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 20px;
    
  }
  button:hover {
    background-color: #c82333;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}
  .search-results {
  display: flex;
  flex-direction: column;
  align-items: space-between;
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
.kitoptions{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.cartButton{
  background-color: #ff3333;
  color: #fff;
  border: none;
  padding: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
}


  
</style>
  