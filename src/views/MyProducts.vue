<template>
    <button @click="log"> test</button>
  <div v-for="(cancellableReservation, Index) in cancellableReservationsArrayifier" :key= Index  class="product1">
        <div class="kolom1">
            <p>Name: {{ cancellableReservation.ItemName }}</p>
            <img :src="cancellableReservation.ItemImage" alt="img">
        </div>
        <div class="kolom1">
        <button>
            <router-link class="link" to="/ExtensionPage">Request extension</router-link>
        </button>  
        </div>
        <div class="kolom4">
            <p>{{ startDate.getDate }}/{{ startDate.getMonth }}/{{ year }} </p>   
            <p>{{ endDate.getDate }}/{{ endDate.getMonth }}/{{ year }}</p>
        </div>    
    </div>
    <div v-for="(reservation, Index) in arrayifier" class="product1">
        <div class="kolom1">
            <p></p>
            <p>Categorie: Audio</p>
        </div>
        <div class="kolom1">
            <button>
                Request extension
            </button>  
        </div>
        <button>Report issue</button>
        <div class="kolom4">
            <p>Start date: 12/05/2024</p>   
            <p>Deadline: 18/05/2024</p>
        </div>    
    </div>

</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { db,collection,query,where,getDocs,doc } from "../Firebase/Index.js";
import SearchBar from "../components/Searchbar.vue"


let reservations = ref([]);
let cancellableReservations = ref([]);
const year = ref(new Date().getFullYear());
let startDate = ref(new Date());
let endDate = ref(new Date());

const cancellableReservationsCalc = computed(() => {
    if (reservations.value == undefined){
        console.log("loading...")
    } else {
        console.log(reservations.value)
        for (let reservation of reservations.value){
            startDate.value.setDate(reservation.StartDate);
            startDate.value.setMonth(reservation.StartMonth);
            endDate.value.setDate(reservation.EndDate);
            endDate.value.setMonth(reservation.EndMonth);
            let adjustedStartDate = new Date(startDate.value);
            adjustedStartDate.setDate(adjustedStartDate.getDate() - 2);
            adjustedStartDate.setMonth(adjustedStartDate.getMonth() - 1);
            console.log(adjustedStartDate)
            console.log(!reservation.CurrentlyWithUser && new Date() < adjustedStartDate)
            if (!reservation.CurrentlyWithUser && new Date() < adjustedStartDate){
                reservations.value.splice(reservations.value.indexOf(reservation), 1);
                console.log(reservations.value)
                cancellableReservations.value.push(reservation);
            }
        }
    }
});

const arrayifier = computed(() => {
    let array = [];
    for (let reservation of reservations.value){
        for (let i = 1; i <= 10; i++){
            if (reservation[`Item${i}`] != undefined){
                array.push(reservation[`Item${i}`]);
            }else{
                break;
            }
        }
    }
    return array;
});
const cancellableReservationsArrayifier = computed(() => {
    let array = [];
    if(cancellableReservations.value != undefined){
        console.log(cancellableReservations.value)
        for (let reservation of cancellableReservations.value){
            for (let i = 1; i <= 10; i++){
                if (reservation[`Item${i}`] != undefined){
                    array.push(reservation[`Item${i}`]);
                }else{
                    break;
                }
            }
        }
        return array;
    }else {console.log("loading...")};
});

const log = () => {
    console.log(cancellableReservationsArrayifier)
}
const getUser = () => {
    /* get user id when logged in*/ 
    const user = "Tester";
    return user
}
const getReservations = async () => {
    const collectionRef = collection(db, "Reservations");
    const q = query(collectionRef, where("User", "==", `${getUser()}`));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.size)
    querySnapshot.forEach((doc) => {
        console.log(doc.data())
        reservations.value.push(doc.data());
        
    });
}


onMounted( async() => {
    await getReservations();
});

</script>

<style scoped>
    div{
        display: flex;
        margin: 20px;
        background-color: #c1c1c1;
        padding: 20px;
    }

    p{
        margin: auto;
    }

    .kolom1{
        margin: auto;
        display: flex;
        flex-direction: column;
    }
    .kolom4{
        margin: auto;
        display: flex;
        flex-direction: column;
    }
    button{
        margin: auto;
        border-radius: 50px;
        padding: 15px 10px 15px 10px;
        background-color: red;
        color: white;
        border: 0cap;
    }
    .available{
        background-color: lightgreen;
    }
</style>