<template>
    <button @click="handleReservation(item)">submit</button>
</template>
<script setup>
import { useStore } from '@/Pinia/Store';
import { useDates } from '@/Pinia/Store';
import { computed,ref } from 'vue';
import { db, query,where,collection,getDocs,setDoc,doc,updateDoc} from "../Firebase/Index.js";

const data = ref([]);
const chosenitem = ref();

defineProps({
    item: Object
})

const store = useStore();
const dates = useDates();

const handleReservation = async(item) => {
    store.updateResults(item);
    if(dates.startDate != "" && dates.endDate != ""){
        if(store.results.Available){
            getItems().then(MakeReservation).then(markInstanceAsUnavailable)
            .then(changeAmountAvailable);
        }else{
            console.log("Hoo boy i'm not looking forward to this")
        }
    }else{
        alert("Please select a date range")
    }
   
}
const getItems = async() => {
    const creference = collection(db, `Items/${store.results.Name.charAt(0).toUpperCase() 
                    + store.results.Name.slice(1)}/${store.results.Name.charAt(0).toUpperCase() 
                    + store.results.Name.slice(1)} items`);
            console.log(creference);
            const reservedQuery = query(creference,where("Reserved", "==", false));
            const reservedSnapshot = await getDocs(reservedQuery);
            reservedSnapshot.forEach((doc) => {
                data.value.push(doc.data());
            });
            chosenitem.value = data.value[0];
            console.log(chosenitem.value.Serial);
}
const markInstanceAsUnavailable = async() => {
    const docRef = doc(db, `Items/${store.results.Name.charAt(0).toUpperCase() 
                    + store.results.Name.slice(1)}/${store.results.Name.charAt(0).toUpperCase() 
                    + store.results.Name.slice(1)} items/${chosenitem.value.Serial}`);
    await updateDoc(docRef, {
        Reserved: true
    });
}
const changeAmountAvailable = async() => {
    const docRef = doc(db, `Items/${store.results.Name.charAt(0).toUpperCase() 
                    + store.results.Name.slice(1)}`);
    await updateDoc(docRef, {
        AvailableAmount: store.results.AvailableAmount - 1
    });
}
const MakeReservation = async() => {
    const docRef = doc(db, "Reservations", store.results.Name + " " + "Tester" + " " + dates.startDate + " " + dates.endDate);
    await setDoc(docRef, {
        ItemName: store.results.Name,
        StartDate: dates.startDate,
        EndDate: dates.endDate,
        User: "Tester",
        Serial: chosenitem.value.Serial,
        ForProject: false,
        Extended: false,
        CurrentlyWithUser: false
    });
}
</script>