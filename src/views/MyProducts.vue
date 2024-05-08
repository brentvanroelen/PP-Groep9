<template>
    <button @click="log"> test</button>
  	<div v-for="(cancellableReservation, Index) in displayReservations[0]" :key= Index  class="product1">
        <div class="kolom1">
            <p>Serial: Reservation code</p>
            <details>
                <summary>See Items</summary>
                <ul>
                  <li v-for="(item, index) in getItems(cancellableReservation)" :key="index">
                    Name: {{ item.ItemName}}
                    Serialnumber: {{ item.Serial}}
                    <img :src="item.ItemImage" alt="picture">
                  </li>
                </ul>
            </details>
        </div>
        <div class="kolom1">
        <button @click="">
            Cancel Reservation
        </button>  
        </div>
        <div class="kolom4">
            <p>{{ cancellableReservation.StartDate }}/{{ cancellableReservation.StartMonth }}/{{ year }} </p>   
            <p>{{ cancellableReservation.EndDate }}/{{ cancellableReservation.EndMonth }}/{{ year }}</p>
        </div>    
    </div>
    <div v-for="(reservation, Index) in displayReservations[1]" :key="Index" class="product1">
        <div class="kolom1">
            <p>Serial: Reservation Code</p>
            <details>
                <summary>See Items</summary>
                <ul>
                  <li v-for="(item, index) in getItems(reservation)" :key="index">
                    Name: {{ item.ItemName}}
                    Serialnumber: {{ item.Serial}}
                    <img :src="item.ItemImage" alt="picture">
                    <button><router-link class="link" to="/ExtensionPage">Request singular extension</router-link></button>
                  </li>
                </ul>
            </details>
        </div>
        <div class="kolom1">
            <button>
                <router-link class="link" to="/ExtensionPage">Request extension</router-link>
            </button>  
        </div>
        <button>Report issue</button>
        <div class="kolom4">
            <p>{{ reservation.StartDate }}/{{ reservation.StartMonth }}/{{ year }} </p>   
            <p>{{ reservation.EndDate }}/{{ reservation.EndMonth }}/{{ year }}</p>
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


const displayReservations = computed(() => {
    let array = [cancellableReservationsCalc()[0], cancellableReservationsCalc()[1]];
    console.log(array)
    return array;
});
const arrayifier = computed(() => {
    let array = [];
    for (let reservation of reservations.value){
        console.log(reservations.value)
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
const getItems = (reservation) => {
    let array = [];
    if(reservation != undefined){
        for (let i = 1; i <= 10; i++){
            if (reservation[`Item${i}`] != undefined){
                array.push(reservation[`Item${i}`]);
            }else{
                break;
            }
        }
        return array;
    }else {console.log("loading...")};
};

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

const cancellableReservationsCalc = () => {
    if (reservations.value == undefined){
        console.log("loading...")
    } else {
        console.log(reservations.value)
        for (let reservation of reservations.value){
            startDate.value.setDate(reservation.StartDate);
            startDate.value.setMonth(reservation.StartMonth);
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
        return [cancellableReservations.value, reservations.value];
    }
};


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